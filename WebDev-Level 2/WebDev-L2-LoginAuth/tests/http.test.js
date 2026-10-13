/**
 * End-to-end HTTP tests: a real Express app on a random port, real cookies, real routes.
 * Needs the project dependencies (run `npm install` first). If Express isn't installed these
 * tests are skipped instead of failing.
 */
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { openDatabase } from '../server/db.js';
import { createSqliteUserStore } from '../server/sqliteStore.js';
import { createSqliteSessionStore } from '../server/sqliteSessions.js';
import { createSqliteCodeStore } from '../server/sqliteCodes.js';
import { createBreachChecker } from '../server/breach.js';
import { createLoginGuard } from '../server/loginGuard.js';
import { createAuthService } from '../server/authService.js';
import { sha1Hex } from '../shared/passwordPolicy.js';

let createApp = null;
try {
  ({ createApp } = await import('../server/app.js'));
} catch (err) {
  console.warn(`[http tests] skipped, dependencies missing: ${err.message}`);
}
const skip = createApp ? false : 'run "npm install" to enable the HTTP tests';

const fakeHasher = {
  hash: async (pw) => 'h:' + crypto.createHash('sha256').update(pw).digest('hex'),
  compare: async (pw, h) => h === 'h:' + crypto.createHash('sha256').update(pw).digest('hex'),
  dummyCompare: async () => false,
};

const LEAKED = 'Leaked-Http-Pass-3';
let server, base, db, sessions, guard;
// second app instance with email verification switched ON and a fake mailer that records codes
let server2, base2, db2, sessions2, guard2, codes2;
const sentMails = [];
let deps; // pieces reused by the Dev Inbox test below

before(async () => {
  if (!createApp) return;
  db = openDatabase(':memory:');
  const store = createSqliteUserStore(db);
  sessions = createSqliteSessionStore({ db, ttlMs: 60_000 });
  guard = createLoginGuard({ maxAttempts: 4 });

  const leakedHash = await sha1Hex(LEAKED);
  const breachChecker = createBreachChecker({
    fetchImpl: async (url) => {
      const prefix = url.split('/range/')[1];
      return { ok: true, status: 200, text: async () => (prefix === leakedHash.slice(0, 5) ? `${leakedHash.slice(5)}:99\r\n` : '') };
    },
  });
  const auth = createAuthService({ store, hasher: fakeHasher, breachChecker, guard });
  const config = { isProd: false, sessionTtlMs: 60_000, trustProxy: false, distDir: '/nonexistent', allowDevSeed: false };
  const app = createApp({ auth, sessions, breachChecker, config });

  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  base = `http://127.0.0.1:${server.address().port}`;

  // ---- instance #2: verification required ----
  db2 = openDatabase(':memory:');
  const store2 = createSqliteUserStore(db2);
  sessions2 = createSqliteSessionStore({ db: db2, ttlMs: 60_000 });
  codes2 = createSqliteCodeStore({ db: db2 });
  guard2 = createLoginGuard({ maxAttempts: 4 });
  const auth2 = createAuthService({
    store: store2,
    hasher: fakeHasher,
    breachChecker,
    guard: guard2,
    codes: codes2,
    mailer: { sendCode: async (m) => (sentMails.push(m), { sent: true }) },
    secret: 'http-test-secret-http-test-secret',
    requireEmailVerification: true,
    resendCooldownMs: 0, // no waiting in tests
  });
  deps = { auth: auth2, sessions: sessions2, breachChecker, config };
  const app2 = createApp({ auth: auth2, sessions: sessions2, breachChecker, config });
  await new Promise((resolve) => {
    server2 = app2.listen(0, resolve);
  });
  base2 = `http://127.0.0.1:${server2.address().port}`;
});

after(() => {
  server?.close();
  server2?.close();
  sessions?.stop();
  sessions2?.stop();
  guard?.stop();
  guard2?.stop();
  codes2?.stop();
  db?.close();
  db2?.close();
});

/** Tiny fetch wrapper that remembers the session cookie like a browser would. */
function client(which = 'plain') {
  let cookie = '';
  return {
    async call(method, path, body, headers = {}) {
      const res = await fetch((which === 'verify' ? base2 : base) + path, {
        method,
        headers: { ...(body ? { 'Content-Type': 'application/json' } : {}), ...(cookie ? { Cookie: cookie } : {}), ...headers },
        body: body ? JSON.stringify(body) : undefined,
      });
      const set = res.headers.get('set-cookie');
      if (set) cookie = set.startsWith('aura_sid=;') || /aura_sid=;/.test(set) ? '' : set.split(';')[0];
      let json = null;
      try {
        json = await res.clone().json();
      } catch {
        /* not JSON */
      }
      return { status: res.status, json, headers: res.headers, setCookie: set };
    },
    get cookie() {
      return cookie;
    },
  };
}

const user = (n) => ({ username: `http_user_${n}`, email: `http${n}@example.com`, password: `Sunlit-Meadow-Rain-${n}7` });

test('full flow: register, login, protected /me, logout', { skip }, async () => {
  const c = client();
  const u = user(1);

  assert.equal((await c.call('GET', '/api/me')).status, 401, 'protected before login');

  const reg = await c.call('POST', '/api/register', u);
  assert.equal(reg.status, 201);
  assert.equal((await c.call('GET', '/api/me')).status, 401, 'registering does not log you in');

  const login = await c.call('POST', '/api/login', { identifier: u.email, password: u.password });
  assert.equal(login.status, 200);
  assert.match(login.setCookie, /aura_sid=/);
  assert.match(login.setCookie, /HttpOnly/i);
  assert.match(login.setCookie, /SameSite=Strict/i);

  const me = await c.call('GET', '/api/me');
  assert.equal(me.status, 200);
  assert.equal(me.json.user.username, u.username);
  assert.ok(!JSON.stringify(me.json).includes('passwordHash'), 'never leak the hash');

  assert.equal((await c.call('POST', '/api/logout')).status, 200);
  assert.equal((await c.call('GET', '/api/me')).status, 401, 'session is gone after logout');
});

test('forged or garbage cookies are rejected', { skip }, async () => {
  const res = await fetch(base + '/api/me', { headers: { Cookie: 'aura_sid=not-a-real-token' } });
  assert.equal(res.status, 401);
});

test('registration rules over HTTP: weak, duplicate, breached', { skip }, async () => {
  const c = client();
  const u = user(2);

  const weak = await c.call('POST', '/api/register', { ...u, password: 'short1' });
  assert.equal(weak.status, 400);
  assert.ok(weak.json.errors.password);

  const breached = await c.call('POST', '/api/register', { ...u, password: LEAKED });
  assert.equal(breached.status, 422);
  assert.equal(breached.json.code, 'PASSWORD_BREACHED');

  assert.equal((await c.call('POST', '/api/register', u)).status, 201);
  const dup = await c.call('POST', '/api/register', { ...u, username: 'someone_else' });
  assert.equal(dup.status, 409);
  assert.equal(dup.json.message, 'An account with this username or email already exists.');
});

test('wrong user and wrong password return the identical response', { skip }, async () => {
  const c = client();
  const u = user(3);
  await c.call('POST', '/api/register', u);
  const a = await c.call('POST', '/api/login', { identifier: u.username, password: 'wrong-password-1' });
  const b = await c.call('POST', '/api/login', { identifier: 'nobody_here', password: 'wrong-password-1' });
  assert.equal(a.status, 401);
  assert.equal(b.status, 401);
  assert.deepEqual(a.json, b.json);
});

test('account lockout over HTTP returns 429 with Retry-After', { skip }, async () => {
  const c = client();
  const u = user(4);
  await c.call('POST', '/api/register', u);
  let last;
  for (let i = 0; i < 4; i++) last = await c.call('POST', '/api/login', { identifier: u.username, password: 'bad-password-9' });
  assert.equal(last.status, 429);
  assert.ok(Number(last.headers.get('retry-after')) > 0);
  const good = await c.call('POST', '/api/login', { identifier: u.username, password: u.password });
  assert.equal(good.status, 429, 'locked even for the right password');
});

test('change password logs out OTHER devices but keeps this one; logout-all ends everything', { skip }, async () => {
  const u = user(5);
  const phone = client();
  const laptop = client();
  await phone.call('POST', '/api/register', u);
  await phone.call('POST', '/api/login', { identifier: u.username, password: u.password });
  await laptop.call('POST', '/api/login', { identifier: u.username, password: u.password });
  assert.equal((await laptop.call('GET', '/api/me')).json.user.activeSessions, 2);

  const newPw = 'Brand-New-Lantern-Pass-58';
  const changed = await laptop.call('POST', '/api/change-password', { currentPassword: u.password, newPassword: newPw });
  assert.equal(changed.status, 200);
  assert.equal((await laptop.call('GET', '/api/me')).status, 200, 'this device stays signed in');
  assert.equal((await phone.call('GET', '/api/me')).status, 401, 'other device is signed out');

  const again = client();
  await again.call('POST', '/api/login', { identifier: u.username, password: newPw });
  assert.equal((await laptop.call('POST', '/api/logout-all')).status, 200);
  assert.equal((await laptop.call('GET', '/api/me')).status, 401);
  assert.equal((await again.call('GET', '/api/me')).status, 401);
});

test('change password requires a session', { skip }, async () => {
  const res = await client().call('POST', '/api/change-password', { currentPassword: 'a', newPassword: 'b' });
  assert.equal(res.status, 401);
});

test('cross-origin POSTs are blocked; breach lookup only accepts a 5-char hex prefix', { skip }, async () => {
  const evil = await client().call('POST', '/api/login', { identifier: 'a', password: 'b' }, { Origin: 'http://evil.example' });
  assert.equal(evil.status, 403);

  assert.equal((await client().call('GET', '/api/breach/range/ZZZZZ')).status, 400);
  assert.equal((await client().call('GET', '/api/breach/range/5BAA61E4C9B93F3F')).status, 400, 'full hashes are refused');
  const h = await sha1Hex(LEAKED);
  const range = await fetch(`${base}/api/breach/range/${h.slice(0, 5)}`);
  assert.equal(range.status, 200);
  assert.match(await range.text(), new RegExp(h.slice(5)));
});

test('malformed JSON gets a clean 400, not a stack trace', { skip }, async () => {
  const res = await fetch(base + '/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{oops' });
  assert.equal(res.status, 400);
  assert.ok(!(await res.text()).includes('at '));
});

test('security headers are present', { skip }, async () => {
  const res = await fetch(base + '/api/me');
  assert.ok(res.headers.get('content-security-policy'));
  assert.equal(res.headers.get('x-powered-by'), null);
});


// ---------------------------------------------------------------------------
// Email verification + forgot password over HTTP (instance #2)
// ---------------------------------------------------------------------------
const lastMail = () => sentMails[sentMails.length - 1];
const vuser = (n) => ({ username: `verify_user_${n}`, email: `verify${n}@example.com`, password: `Quiet-River-Lantern-${n}3` });

test('register with verification: no session, 403 until verified, then login works', { skip }, async () => {
  const c = client('verify');
  const u = vuser(1);
  const reg = await c.call('POST', '/api/register', u);
  assert.equal(reg.status, 201);
  assert.equal(reg.json.verificationRequired, true);
  assert.match(reg.json.maskedEmail, /\*+@example\.com$/);
  assert.ok(!JSON.stringify(reg.json).includes(lastMail().code), 'the code is never in the response');
  assert.equal(lastMail().purpose, 'verify');

  const blocked = await c.call('POST', '/api/login', { identifier: u.username, password: u.password });
  assert.equal(blocked.status, 403);
  assert.equal(blocked.json.code, 'EMAIL_NOT_VERIFIED');
  assert.equal(blocked.setCookie, null, 'no session cookie for an unverified account');

  const wrong = await c.call('POST', '/api/verify-email', { identifier: u.username, code: lastMail().code === '000000' ? '111111' : '000000' });
  assert.equal(wrong.status, 400);
  assert.equal(wrong.json.code, 'INVALID_CODE');

  const ok = await c.call('POST', '/api/verify-email', { identifier: u.email, code: lastMail().code });
  assert.equal(ok.status, 200);

  const login = await c.call('POST', '/api/login', { identifier: u.username, password: u.password });
  assert.equal(login.status, 200);
  assert.equal(login.json.user.emailVerified, true);
});

test('resend-verification and forgot-password give the same reply for unknown accounts', { skip }, async () => {
  const c = client('verify');
  const u = vuser(2);
  await c.call('POST', '/api/register', u);
  await c.call('POST', '/api/verify-email', { identifier: u.username, code: lastMail().code });

  const before = sentMails.length;
  const known = await c.call('POST', '/api/forgot-password', { identifier: u.email });
  const unknown = await c.call('POST', '/api/forgot-password', { identifier: 'ghost@example.com' });
  assert.equal(known.status, 200);
  assert.deepEqual(known.json, unknown.json);
  assert.equal(sentMails.length, before + 1, 'only the real account got an email');

  const r1 = await c.call('POST', '/api/resend-verification', { identifier: u.username });
  const r2 = await c.call('POST', '/api/resend-verification', { identifier: 'ghost' });
  assert.deepEqual(r1.json, r2.json);
});

test('reset password over HTTP signs out every device and the old password stops working', { skip }, async () => {
  const u = vuser(3);
  const laptop = client('verify');
  await laptop.call('POST', '/api/register', u);
  await laptop.call('POST', '/api/verify-email', { identifier: u.username, code: lastMail().code });
  await laptop.call('POST', '/api/login', { identifier: u.username, password: u.password });
  assert.equal((await laptop.call('GET', '/api/me')).status, 200);

  const attacker = client('verify'); // somebody who only knows the email address
  await attacker.call('POST', '/api/forgot-password', { identifier: u.email });
  const code = lastMail().code;
  const newPw = 'Brand-New-Orchard-Gate-61';

  const weak = await attacker.call('POST', '/api/reset-password', { identifier: u.email, code, newPassword: 'short1' });
  assert.equal(weak.status, 400);
  const breached = await attacker.call('POST', '/api/reset-password', { identifier: u.email, code, newPassword: LEAKED });
  assert.equal(breached.status, 422);

  const done = await attacker.call('POST', '/api/reset-password', { identifier: u.email, code, newPassword: newPw });
  assert.equal(done.status, 200);
  assert.equal((await laptop.call('GET', '/api/me')).status, 401, 'existing sessions were destroyed');
  assert.equal((await client('verify').call('POST', '/api/login', { identifier: u.username, password: u.password })).status, 401);
  assert.equal((await client('verify').call('POST', '/api/login', { identifier: u.username, password: newPw })).status, 200);

  const reuse = await attacker.call('POST', '/api/reset-password', { identifier: u.email, code, newPassword: 'Yet-Another-Gate-Pass-62' });
  assert.equal(reuse.status, 400);
});

test('new email routes reject empty bodies cleanly', { skip }, async () => {
  const c = client('verify');
  for (const route of ['/api/verify-email', '/api/resend-verification', '/api/forgot-password', '/api/reset-password']) {
    const res = await c.call('POST', route, {});
    assert.equal(res.status, 400, route);
  }
});


test('Dev Inbox routes exist only in inbox mode and are never exposed in production', { skip }, async () => {
  const { createMailer } = await import('../server/mailer.js');
  const mailer = createMailer({ mode: 'inbox', log: { log() {}, error() {} } });
  await mailer.sendCode({ to: 'q@w.com', username: 'q', code: '135790', purpose: 'verify', ttlMinutes: 10 });

  const mk = async (cfg, m) => {
    const app = createApp({ ...deps, config: { ...deps.config, ...cfg }, mailer: m });
    const srv = await new Promise((resolve) => {
      const s = app.listen(0, () => resolve(s));
    });
    return { srv, url: `http://127.0.0.1:${srv.address().port}` };
  };

  const dev = await mk({ isProd: false }, mailer);
  const list = await (await fetch(dev.url + '/api/dev/inbox')).json();
  assert.equal(list.messages[0].code, '135790');
  assert.equal((await fetch(dev.url + '/api/dev/inbox', { method: 'DELETE' })).status, 200);
  assert.equal(mailer.listInbox().length, 0);
  dev.srv.close();

  const prod = await mk({ isProd: true }, mailer);
  assert.equal((await fetch(prod.url + '/api/dev/inbox')).status, 404);
  prod.srv.close();

  const consoleMode = await mk({ isProd: false }, createMailer({ mode: 'console', log: { log() {}, error() {} } }));
  assert.equal((await fetch(consoleMode.url + '/api/dev/inbox')).status, 404);
  consoleMode.srv.close();
});
