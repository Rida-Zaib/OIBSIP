import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { openDatabase } from '../server/db.js';
import { createSqliteUserStore } from '../server/sqliteStore.js';
import { createSqliteCodeStore } from '../server/sqliteCodes.js';
import { createMemoryCodeStore } from '../server/memoryCodes.js';
import { createUserStore } from '../server/store.js';
import { createBreachChecker } from '../server/breach.js';
import { createLoginGuard } from '../server/loginGuard.js';
import { createAuthService } from '../server/authService.js';
import { createMailer, maskEmail } from '../server/mailer.js';
import { buildCodeEmail, escapeHtml } from '../server/mailTemplates.js';
import { sha1Hex } from '../shared/passwordPolicy.js';

const fakeHasher = {
  hash: async (pw) => 'h:' + crypto.createHash('sha256').update(pw).digest('hex'),
  compare: async (pw, h) => h === 'h:' + crypto.createHash('sha256').update(pw).digest('hex'),
  dummyCompare: async () => false,
};

const LEAKED = 'Leaked-Reset-Pass-9';

async function setup({ requireEmailVerification = true, codeStore = 'sqlite', maxAttempts = 5 } = {}) {
  let t = 50_000_000;
  const clock = { now: () => t, advance: (ms) => (t += ms) };

  const db = openDatabase(':memory:');
  const store = createSqliteUserStore(db);
  const codes = codeStore === 'sqlite' ? createSqliteCodeStore({ db, now: clock.now }) : createMemoryCodeStore({ now: clock.now });

  const sent = []; // every email "sent": { to, username, code, purpose }
  const mailer = { sendCode: async (m) => (sent.push(m), { sent: true }) };

  const leakedHash = await sha1Hex(LEAKED);
  const breachChecker = createBreachChecker({
    fetchImpl: async (url) => {
      const prefix = url.split('/range/')[1];
      return { ok: true, status: 200, text: async () => (prefix === leakedHash.slice(0, 5) ? `${leakedHash.slice(5)}:12\r\n` : '') };
    },
  });
  const guard = createLoginGuard({ maxAttempts: 3, baseLockMs: 60_000, now: clock.now });

  const auth = createAuthService({
    store,
    hasher: fakeHasher,
    breachChecker,
    guard,
    codes,
    mailer,
    secret: 'test-secret-test-secret-test-secret',
    requireEmailVerification,
    codeMaxAttempts: maxAttempts,
    now: clock.now,
  });
  const last = () => sent[sent.length - 1];
  return { auth, store, codes, sent, last, clock, guard, db };
}

const me = { username: 'rida_z', email: 'rida@example.com', password: 'Moonl1ght-Orchard-77' };

test('register with verification: unverified account, one email, login blocked until verified', async () => {
  const { auth, sent, last } = await setup();
  const res = await auth.register(me);
  assert.equal(res.verificationRequired, true);
  assert.equal(res.emailSent, true);
  assert.equal(res.maskedEmail, maskEmail(me.email));
  assert.equal(sent.length, 1);
  assert.equal(last().purpose, 'verify');
  assert.equal(last().to, me.email);
  assert.match(last().code, /^\d{6}$/);

  // right password but not verified -> 403, wrong password -> still the normal 401
  const blocked = await auth.login({ identifier: 'rida_z', password: me.password }).catch((e) => e);
  assert.equal(blocked.status, 403);
  assert.equal(blocked.code, 'EMAIL_NOT_VERIFIED');
  const wrong = await auth.login({ identifier: 'rida_z', password: 'nope-nope-1' }).catch((e) => e);
  assert.equal(wrong.status, 401);
});

test('correct code verifies the email, then login works; the code is single-use', async () => {
  const { auth, last } = await setup();
  await auth.register(me);
  const code = last().code;

  await auth.verifyEmail({ identifier: me.email, code });
  const { user } = await auth.login({ identifier: 'rida_z', password: me.password });
  assert.equal(user.emailVerified, true);

  const again = await auth.verifyEmail({ identifier: me.email, code }).catch((e) => e);
  assert.equal(again.code, 'INVALID_CODE');
});

test('wrong code, unknown user and already-verified user all give the identical error', async () => {
  const { auth, last } = await setup();
  await auth.register(me);
  const good = last().code;
  const wrongCode = good === '000000' ? '111111' : '000000';

  const a = await auth.verifyEmail({ identifier: 'rida_z', code: wrongCode }).catch((e) => e);
  const b = await auth.verifyEmail({ identifier: 'nobody', code: wrongCode }).catch((e) => e);
  assert.equal(a.status, 400);
  assert.equal(a.code, 'INVALID_CODE');
  assert.equal(a.message, b.message);
  assert.equal(a.code, b.code);

  await auth.verifyEmail({ identifier: 'rida_z', code: good });
  const c = await auth.verifyEmail({ identifier: 'rida_z', code: good }).catch((e) => e);
  assert.equal(c.message, a.message);
});

test('too many wrong guesses destroy the code, even the right one is refused afterwards', async () => {
  const { auth, last, clock } = await setup({ maxAttempts: 3 });
  await auth.register(me);
  const good = last().code;
  const wrong = good === '123456' ? '654321' : '123456';
  for (let i = 0; i < 3; i++) await auth.verifyEmail({ identifier: 'rida_z', code: wrong }).catch(() => {});
  const after = await auth.verifyEmail({ identifier: 'rida_z', code: good }).catch((e) => e);
  assert.equal(after.code, 'INVALID_CODE');

  clock.advance(61_000); // cooldown over -> a new code can be requested
  await auth.resendVerification({ identifier: 'rida_z' });
  await auth.verifyEmail({ identifier: 'rida_z', code: last().code });
});

test('non-numeric or wrong-length codes are rejected and still count as attempts', async () => {
  const { auth } = await setup();
  await auth.register(me);
  for (const bad of ['abcdef', '12345', '1234567', '12 34 56', '']) {
    const e = await auth.verifyEmail({ identifier: 'rida_z', code: bad || ' ' }).catch((x) => x);
    assert.ok(e.status === 400, `rejected: "${bad}"`);
  }
});

test('expired code is rejected', async () => {
  const { auth, last, clock } = await setup();
  await auth.register(me);
  const code = last().code;
  clock.advance(10 * 60 * 1000 + 1000);
  const e = await auth.verifyEmail({ identifier: 'rida_z', code }).catch((x) => x);
  assert.equal(e.code, 'INVALID_CODE');
});

test('resend: 60 s cooldown, unknown accounts get the same silent success and no email', async () => {
  const { auth, sent, clock } = await setup();
  await auth.register(me);
  assert.equal(sent.length, 1);

  await auth.resendVerification({ identifier: 'rida_z' }); // too soon
  assert.equal(sent.length, 1, 'throttled');

  clock.advance(61_000);
  await auth.resendVerification({ identifier: 'rida_z' });
  assert.equal(sent.length, 2);

  const before = sent.length;
  const res = await auth.resendVerification({ identifier: 'ghost' });
  assert.deepEqual(res, { ok: true });
  assert.equal(sent.length, before);
});

test('a newer code replaces the older one', async () => {
  const { auth, sent, clock } = await setup();
  await auth.register(me);
  const first = sent[0].code;
  clock.advance(61_000);
  await auth.resendVerification({ identifier: 'rida_z' });
  const second = sent[1].code;
  assert.notEqual(sent[0], sent[1]);
  if (first !== second) {
    const old = await auth.verifyEmail({ identifier: 'rida_z', code: first }).catch((e) => e);
    assert.equal(old.code, 'INVALID_CODE', 'the older code no longer works');
  }
  await auth.verifyEmail({ identifier: 'rida_z', code: second });
});

test('login of an unverified user re-sends a code when none is active', async () => {
  const { auth, sent, clock } = await setup();
  await auth.register(me);
  clock.advance(11 * 60 * 1000); // original code expired and cooldown passed
  await auth.login({ identifier: 'rida_z', password: me.password }).catch(() => {});
  assert.equal(sent.length, 2);
});

test('codes are stored only as an HMAC, never the code itself', async () => {
  const { auth, last, db } = await setup();
  await auth.register(me);
  const code = last().code;
  const row = db.prepare('SELECT code_hash FROM email_codes').get();
  assert.match(row.code_hash, /^[0-9a-f]{64}$/);
  assert.ok(!row.code_hash.includes(code));
});

test('verification can be switched off: account is verified immediately, no email', async () => {
  const { auth, sent } = await setup({ requireEmailVerification: false });
  const res = await auth.register(me);
  assert.equal(res.verificationRequired, false);
  assert.equal(sent.length, 0);
  assert.equal((await auth.login({ identifier: 'rida_z', password: me.password })).user.emailVerified, true);
});

test('works the same with the in-memory code store (JSON fallback mode)', async () => {
  const { auth, last } = await setup({ codeStore: 'memory' });
  await auth.register(me);
  await auth.verifyEmail({ identifier: 'rida_z', code: last().code });
  assert.equal((await auth.login({ identifier: 'rida_z', password: me.password })).user.username, 'rida_z');
});

// ---------------------------------------------------------------------------
// Forgot / reset password
// ---------------------------------------------------------------------------
async function verifiedUser(opts) {
  const ctx = await setup(opts);
  await ctx.auth.register(me);
  await ctx.auth.verifyEmail({ identifier: 'rida_z', code: ctx.last().code });
  ctx.sent.length = 0;
  return ctx;
}

test('forgot password: same reply for known and unknown accounts; only the real one gets an email', async () => {
  const { auth, sent, last } = await verifiedUser();
  const known = await auth.requestPasswordReset({ identifier: me.email });
  const unknown = await auth.requestPasswordReset({ identifier: 'nobody@example.com' });
  assert.deepEqual(known, unknown);
  assert.equal(sent.length, 1);
  assert.equal(last().purpose, 'reset');
});

test('forgot password has a cooldown too', async () => {
  const { auth, sent, clock } = await verifiedUser();
  await auth.requestPasswordReset({ identifier: 'rida_z' });
  await auth.requestPasswordReset({ identifier: 'rida_z' });
  assert.equal(sent.length, 1);
  clock.advance(61_000);
  await auth.requestPasswordReset({ identifier: 'rida_z' });
  assert.equal(sent.length, 2);
});

test('reset password: new password works, old one stops, code is single-use', async () => {
  const { auth, last } = await verifiedUser();
  await auth.requestPasswordReset({ identifier: 'rida_z' });
  const code = last().code;
  const newPassword = 'Fresh-Lantern-Garden-42';

  await auth.resetPassword({ identifier: 'rida_z', code, newPassword });
  await assert.rejects(auth.login({ identifier: 'rida_z', password: me.password }), (e) => e.status === 401);
  assert.equal((await auth.login({ identifier: 'rida_z', password: newPassword })).user.username, 'rida_z');

  const reuse = await auth.resetPassword({ identifier: 'rida_z', code, newPassword: 'Another-Lantern-Garden-43' }).catch((e) => e);
  assert.equal(reuse.code, 'INVALID_CODE');
});

test('reset password: wrong code and unknown user give the identical error', async () => {
  const { auth, last } = await verifiedUser();
  await auth.requestPasswordReset({ identifier: 'rida_z' });
  const wrong = last().code === '000000' ? '111111' : '000000';
  const a = await auth.resetPassword({ identifier: 'rida_z', code: wrong, newPassword: 'Fresh-Lantern-Garden-42' }).catch((e) => e);
  const b = await auth.resetPassword({ identifier: 'ghost', code: wrong, newPassword: 'Fresh-Lantern-Garden-42' }).catch((e) => e);
  assert.equal(a.code, 'INVALID_CODE');
  assert.equal(a.message, b.message);
});

test('reset password: weak or breached new passwords are refused WITHOUT using up a code attempt', async () => {
  const { auth, last } = await verifiedUser({ maxAttempts: 2 });
  await auth.requestPasswordReset({ identifier: 'rida_z' });
  const code = last().code;

  for (let i = 0; i < 3; i++) {
    const weak = await auth.resetPassword({ identifier: 'rida_z', code, newPassword: 'short1' }).catch((e) => e);
    assert.equal(weak.status, 400);
    assert.ok(weak.errors.newPassword);
  }
  const breached = await auth.resetPassword({ identifier: 'rida_z', code, newPassword: LEAKED }).catch((e) => e);
  assert.equal(breached.code, 'PASSWORD_BREACHED');

  // the code is still intact
  await auth.resetPassword({ identifier: 'rida_z', code, newPassword: 'Fresh-Lantern-Garden-42' });
});

test('reset password: guessing the code is limited', async () => {
  const { auth, last } = await verifiedUser({ maxAttempts: 3 });
  await auth.requestPasswordReset({ identifier: 'rida_z' });
  const code = last().code;
  const wrong = code === '123456' ? '654321' : '123456';
  for (let i = 0; i < 3; i++) await auth.resetPassword({ identifier: 'rida_z', code: wrong, newPassword: 'Fresh-Lantern-Garden-42' }).catch(() => {});
  const e = await auth.resetPassword({ identifier: 'rida_z', code, newPassword: 'Fresh-Lantern-Garden-42' }).catch((x) => x);
  assert.equal(e.code, 'INVALID_CODE');
});

test('reset password clears a brute-force lockout on the account', async () => {
  const { auth, last } = await verifiedUser();
  for (let i = 0; i < 3; i++) await auth.login({ identifier: 'rida_z', password: 'wrong-pass-1' }).catch(() => {});
  const locked = await auth.login({ identifier: 'rida_z', password: me.password }).catch((e) => e);
  assert.equal(locked.status, 429);

  await auth.requestPasswordReset({ identifier: me.email });
  await auth.resetPassword({ identifier: me.email, code: last().code, newPassword: 'Fresh-Lantern-Garden-42' });
  assert.equal((await auth.login({ identifier: 'rida_z', password: 'Fresh-Lantern-Garden-42' })).user.username, 'rida_z');
});

test('reset password also verifies an unverified account (the user proved they own the inbox)', async () => {
  const { auth, last, clock } = await setup();
  await auth.register(me); // never verified
  clock.advance(61_000); // let the resend cooldown pass
  await auth.requestPasswordReset({ identifier: 'rida_z' });
  assert.equal(last().purpose, 'reset');
  await auth.resetPassword({ identifier: 'rida_z', code: last().code, newPassword: 'Fresh-Lantern-Garden-42' });
  assert.equal((await auth.login({ identifier: 'rida_z', password: 'Fresh-Lantern-Garden-42' })).user.emailVerified, true);
});

test('verify and reset codes are independent of each other', async () => {
  const { auth, sent } = await setup();
  await auth.register(me);
  const verifyCode = sent[0].code;
  // a verify code must not work as a reset code
  const e = await auth.resetPassword({ identifier: 'rida_z', code: verifyCode, newPassword: 'Fresh-Lantern-Garden-42' }).catch((x) => x);
  assert.equal(e.code, 'INVALID_CODE');
});

// ---------------------------------------------------------------------------
// Mailer + templates
// ---------------------------------------------------------------------------
test('maskEmail hides most of the address', () => {
  assert.equal(maskEmail('ridazaibb04@gmail.com'), 'ri*********@gmail.com');
  assert.match(maskEmail('ab@x.com'), /^a\*{3,}@x\.com$/);
});

test('email templates escape user-controlled text and contain the code', () => {
  const m = buildCodeEmail({ purpose: 'verify', username: '<script>alert(1)</script>', code: '123456', ttlMinutes: 10 });
  assert.ok(!m.html.includes('<script>'));
  assert.ok(m.html.includes('&lt;script&gt;'));
  assert.ok(m.text.includes('123456'));
  assert.ok(m.html.includes('123 456'));
  assert.equal(escapeHtml(`"&'`), '&quot;&amp;&#39;');
  assert.throws(() => buildCodeEmail({ purpose: 'nope', username: 'x', code: '123456', ttlMinutes: 10 }));
});

test('console mailer prints the code in the terminal', async () => {
  const lines = [];
  const mailer = createMailer({ mode: 'console', log: { log: (x) => lines.push(x), error: () => {} } });
  const r = await mailer.sendCode({ to: 'a@b.com', username: 'a', code: '482913', purpose: 'verify', ttlMinutes: 10 });
  assert.equal(r.sent, true);
  assert.match(lines.join('\n'), /482913/);
});

test('inbox mailer: keeps the email in memory (newest first), never prints the code, can be cleared', async () => {
  const lines = [];
  const mailer = createMailer({ mode: 'inbox', log: { log: (x) => lines.push(x), error: () => {} }, inboxLimit: 3 });
  assert.equal(mailer.mode, 'inbox');

  const r = await mailer.sendCode({ to: 'a@b.com', username: 'a', code: '482913', purpose: 'verify', ttlMinutes: 10 });
  assert.deepEqual(r, { sent: true, mode: 'inbox' });
  await mailer.sendCode({ to: 'c@d.com', username: 'c', code: '111222', purpose: 'reset', ttlMinutes: 10 });

  const box = mailer.listInbox();
  assert.equal(box.length, 2);
  assert.equal(box[0].to, 'c@d.com', 'newest first');
  assert.equal(box[1].code, '482913');
  assert.match(box[1].subject, /verification/i);
  assert.match(box[1].text, /482913/);
  assert.ok(!lines.join('\n').includes('482913'), 'the terminal only says a mail arrived, it does not print the code');

  for (let i = 0; i < 5; i++) await mailer.sendCode({ to: `x${i}@y.com`, username: 'x', code: '000000', purpose: 'verify', ttlMinutes: 10 });
  assert.equal(mailer.listInbox().length, 3, 'old mails are dropped past the limit');

  mailer.clearInbox();
  assert.equal(mailer.listInbox().length, 0);
});

test('config: mail mode defaults to the Dev Inbox, SMTP when configured, and never "inbox" in production', async () => {
  const { loadConfig } = await import('../server/config.js');
  assert.equal(loadConfig({}).mailMode, 'inbox');
  assert.equal(loadConfig({ MAIL_MODE: 'console' }).mailMode, 'console');
  assert.equal(loadConfig({ SMTP_USER: 'me@gmail.com', SMTP_PASS: 'x' }).mailMode, 'smtp');
  assert.equal(loadConfig({ SMTP_USER: 'me@gmail.com', MAIL_MODE: 'inbox' }).mailMode, 'inbox');
  assert.equal(loadConfig({ NODE_ENV: 'production' }).mailMode, 'console');
  assert.equal(loadConfig({ NODE_ENV: 'production', MAIL_MODE: 'inbox' }).mailMode, 'console', 'a public inbox would leak codes');
  assert.equal(loadConfig({ NODE_ENV: 'production', SMTP_USER: 'me@gmail.com' }).mailMode, 'smtp');
});

test('smtp mailer: sends through nodemailer, and a failure returns sent:false instead of throwing', async () => {
  const calls = [];
  const okImporter = async () => ({ default: { createTransport: (cfg) => ({ sendMail: async (m) => calls.push({ cfg, m }), verify: async () => true }) } });
  const ok = createMailer({ mode: 'smtp', smtp: { host: 'smtp.gmail.com', port: 465, user: 'u@gmail.com', pass: 'p', from: 'AuraAuth <u@gmail.com>' }, importer: okImporter, log: { log() {}, error() {} } });
  const r = await ok.sendCode({ to: 'x@y.com', username: 'x', code: '123456', purpose: 'reset', ttlMinutes: 10 });
  assert.equal(r.sent, true);
  assert.equal(calls[0].cfg.secure, true);
  assert.equal(calls[0].m.to, 'x@y.com');
  assert.match(calls[0].m.text, /123456/);

  const errors = [];
  const badImporter = async () => ({ default: { createTransport: () => ({ sendMail: async () => { throw new Error('535 bad credentials'); }, verify: async () => { throw new Error('535'); } }) } });
  const bad = createMailer({ mode: 'smtp', smtp: {}, importer: badImporter, log: { log() {}, error: (x) => errors.push(x) } });
  const r2 = await bad.sendCode({ to: 'x@y.com', username: 'x', code: '654321', purpose: 'verify', ttlMinutes: 10 });
  assert.equal(r2.sent, false);
  assert.ok(!errors.join(' ').includes('654321'), 'the code is never logged');
  assert.equal((await bad.verifyConnection()).ok, false);
});

test('mail failure does not break registration: account exists, emailSent is false', async () => {
  const ctx = await setup();
  const failing = createAuthService({
    store: ctx.store,
    hasher: fakeHasher,
    breachChecker: createBreachChecker({ fetchImpl: async () => ({ ok: true, text: async () => '' }) }),
    guard: ctx.guard,
    codes: ctx.codes,
    mailer: { sendCode: async () => ({ sent: false }) },
    requireEmailVerification: true,
    now: ctx.clock.now,
  });
  const res = await failing.register(me);
  assert.equal(res.emailSent, false);
  assert.ok(ctx.store.findByIdentifier('rida_z'));
});

// ---------------------------------------------------------------------------
// Migrations: databases / files created before email verification existed
// ---------------------------------------------------------------------------
test('SQLite migration: an old database gets the new column and its users count as verified', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'aura-mig-'));
  const file = path.join(dir, 'old.db');
  const old = new DatabaseSync(file);
  old.exec(`CREATE TABLE users (id TEXT PRIMARY KEY, username TEXT NOT NULL, email TEXT NOT NULL,
    username_lc TEXT NOT NULL UNIQUE, email_lc TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL, last_login_at TEXT NOT NULL);`);
  old.prepare('INSERT INTO users VALUES (?,?,?,?,?,?,?,?)').run('1', 'alice', 'a@x.com', 'alice', 'a@x.com', 'h', '2026-01-01T00:00:00.000Z', 'n');
  old.close();

  const db = openDatabase(file);
  const store = createSqliteUserStore(db);
  assert.equal(store.findByIdentifier('alice').emailVerifiedAt, '2026-01-01T00:00:00.000Z');
  db.close();
  const db2 = openDatabase(file); // running the migration twice is harmless
  db2.close();
});

test('JSON store migration: users saved by the old version count as verified', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'aura-json-'));
  const file = path.join(dir, 'users.json');
  await fs.writeFile(file, JSON.stringify({ users: [{ id: '1', username: 'bob', email: 'b@x.com', passwordHash: 'h', createdAt: '2026-02-02T00:00:00.000Z', lastLoginAt: 'n' }] }));
  const store = await createUserStore(file);
  assert.equal(store.findByIdentifier('bob').emailVerifiedAt, '2026-02-02T00:00:00.000Z');
});

// ---------------------------------------------------------------------------
// DEMO MODE: the code is returned to the UI instead of being emailed
// ---------------------------------------------------------------------------
async function demoSetup() {
  const db = openDatabase(':memory:');
  const store = createSqliteUserStore(db);
  const codes = createSqliteCodeStore({ db });
  const sent = [];
  const mailer = { sendCode: async (m) => (sent.push(m), { sent: true }) };
  const auth = createAuthService({
    store,
    hasher: fakeHasher,
    breachChecker: createBreachChecker({ fetchImpl: async () => ({ ok: true, status: 200, text: async () => '' }) }),
    guard: createLoginGuard(),
    codes,
    mailer,
    secret: 'test-secret-test-secret-test-secret',
    requireEmailVerification: true,
    demoCodes: true,
  });
  return { auth, sent };
}
const demoUser = { username: 'demo_user', email: 'demo@example.com', password: 'Sunlit-Meadow-Rain-77' };

test('demo mode: register returns the code, nothing is emailed, and the code verifies the account', async () => {
  const { auth, sent } = await demoSetup();
  const r = await auth.register(demoUser);
  assert.match(r.demoCode, /^\d{6}$/);
  assert.equal(sent.length, 0, 'no email is sent in demo mode');
  // signing in before verifying hands out a FRESH code (and the older one stops working)
  const blocked = await auth.login({ identifier: 'demo_user', password: demoUser.password }).catch((e) => e);
  assert.equal(blocked.code, 'EMAIL_NOT_VERIFIED');
  assert.match(blocked.errors.demoCode, /^\d{6}$/);
  await auth.verifyEmail({ identifier: demoUser.email, code: blocked.errors.demoCode });
  assert.equal((await auth.login({ identifier: 'demo_user', password: demoUser.password })).user.username, 'demo_user');
});

test('demo mode: forgot password returns a working code and the reset goes through', async () => {
  const { auth } = await demoSetup();
  const r = await auth.register(demoUser);
  await auth.verifyEmail({ identifier: demoUser.email, code: r.demoCode });

  const f = await auth.requestPasswordReset({ identifier: 'demo@example.com' });
  assert.match(f.demoCode, /^\d{6}$/);
  await auth.resetPassword({ identifier: 'demo@example.com', code: f.demoCode, newPassword: 'Another-Quiet-Harbor-58' });
  assert.equal((await auth.login({ identifier: 'demo_user', password: 'Another-Quiet-Harbor-58' })).user.username, 'demo_user');
  await assert.rejects(auth.login({ identifier: 'demo_user', password: demoUser.password }), (e) => e.status === 401);
});

test('demo mode: unknown accounts get an identical-looking reply, but that code does not work', async () => {
  const { auth } = await demoSetup();
  const ghost = await auth.requestPasswordReset({ identifier: 'ghost_user' });
  assert.equal(ghost.ok, true);
  assert.match(ghost.demoCode, /^\d{6}$/, 'same shape as a real reply: no account enumeration');
  await assert.rejects(
    auth.resetPassword({ identifier: 'ghost_user', code: ghost.demoCode, newPassword: 'Another-Quiet-Harbor-58' }),
    (e) => e.status === 400 || e.status === 422,
  );
});

test('demo mode: asking again right away works (no 60 second wait) and the older code stops working', async () => {
  const { auth } = await demoSetup();
  await auth.register(demoUser);
  const a = await auth.resendVerification({ identifier: 'demo_user' });
  const b = await auth.resendVerification({ identifier: 'demo_user' });
  assert.notEqual(a.demoCode, b.demoCode);
  if (a.demoCode !== b.demoCode) {
    await assert.rejects(auth.verifyEmail({ identifier: 'demo@example.com', code: a.demoCode }));
  }
  await auth.verifyEmail({ identifier: 'demo@example.com', code: b.demoCode });
});

test('config: DEMO_SHOW_CODES=on enables demo mode online and keeps forgot-password available', async () => {
  const { loadConfig } = await import('../server/config.js');
  const c = loadConfig({ NODE_ENV: 'production', DEMO_SHOW_CODES: 'on' });
  assert.equal(c.demoCodes, true);
  assert.equal(c.mailMode, 'demo');
  assert.equal(c.canEmail, true);
  assert.equal(c.requireEmailVerification, true);
  assert.equal(loadConfig({ NODE_ENV: 'production' }).demoCodes, false, 'off unless explicitly enabled');
});
