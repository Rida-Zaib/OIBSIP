import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { createUserStore } from '../server/store.js';
import { createSessionStore } from '../server/sessions.js';
import { createBreachChecker } from '../server/breach.js';
import { loadConfig } from '../server/config.js';
import { createLoginGuard } from '../server/loginGuard.js';
import { openDatabase } from '../server/db.js';
import { createSqliteUserStore } from '../server/sqliteStore.js';
import { createSqliteSessionStore } from '../server/sqliteSessions.js';
import { createAuthService, AuthError } from '../server/authService.js';
import { sha1Hex } from '../shared/passwordPolicy.js';

// Fake hasher so the tests don't need bcrypt installed (bcrypt itself is exercised when you run the real server)
const fakeHasher = {
  hash: async (pw) => 'hash:' + crypto.createHash('sha256').update(pw).digest('hex'),
  compare: async (pw, h) => h === 'hash:' + crypto.createHash('sha256').update(pw).digest('hex'),
  dummyCompare: async () => false,
};

/** Fake Have I Been Pwned: "leaks" the given passwords. */
async function fakeHibp(leaked, { fail = false } = {}) {
  const db = new Map();
  for (const [pw, count] of Object.entries(leaked)) {
    const h = await sha1Hex(pw);
    const p = h.slice(0, 5);
    db.set(p, (db.get(p) || '') + `${h.slice(5)}:${count}\r\n`);
  }
  let calls = 0;
  const fetchImpl = async (url) => {
    calls++;
    if (fail) throw new Error('network down');
    const prefix = url.split('/range/')[1];
    return { ok: true, status: 200, text: async () => (db.get(prefix) || '') + '0000000000000000000000000000000000A:0\r\n' };
  };
  return { fetchImpl, calls: () => calls };
}

async function setup({ leaked = {}, failMode = 'open', hibpDown = false, guardOptions = {} } = {}) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'aura-'));
  const file = path.join(dir, 'users.json');
  const store = await createUserStore(file);
  const hibp = await fakeHibp(leaked, { fail: hibpDown });
  const breachChecker = createBreachChecker({ fetchImpl: hibp.fetchImpl, failMode });
  const guard = createLoginGuard(guardOptions);
  const auth = createAuthService({ store, hasher: fakeHasher, breachChecker, guard });
  return { dir, file, store, auth, hibp, guard };
}

const good = { username: 'rida_z', email: 'rida@example.com', password: 'Moonl1ght-Orchard-77' };

test('register stores a hash, never the plain password', async () => {
  const { auth, file, store } = await setup();
  await auth.register(good);
  await store.flush();
  const raw = await fs.readFile(file, 'utf8');
  assert.ok(!raw.includes(good.password), 'plain password must not be on disk');
  assert.match(raw, /"passwordHash": "hash:/);
});

test('weak passwords are rejected (min 8 chars + 1 number)', async () => {
  const { auth } = await setup();
  for (const password of ['short1', 'longbutnonumber']) {
    await assert.rejects(auth.register({ ...good, password }), (e) => e instanceof AuthError && e.status === 400 && Boolean(e.errors.password));
  }
});

test('breached password is rejected with the breach count', async () => {
  const { auth } = await setup({ leaked: { 'Tr1cky-But-Leaked-9': 4321 } });
  await assert.rejects(auth.register({ ...good, password: 'Tr1cky-But-Leaked-9' }), (e) => {
    assert.equal(e.status, 422);
    assert.equal(e.code, 'PASSWORD_BREACHED');
    assert.match(e.errors.password, /4,321/);
    return true;
  });
});

test('very common password is rejected even with the breach API down', async () => {
  const { auth } = await setup({ hibpDown: true });
  await assert.rejects(auth.register({ ...good, password: 'Password123' }), (e) => e.status === 400 || e.status === 422);
});

test('breach API down: fail-open allows, fail-closed refuses', async () => {
  const open = await setup({ hibpDown: true, failMode: 'open' });
  await open.auth.register(good);

  const closed = await setup({ hibpDown: true, failMode: 'closed' });
  await assert.rejects(closed.auth.register(good), (e) => e.status === 503 && e.code === 'BREACH_CHECK_UNAVAILABLE');
});

test('duplicate username or email is rejected (case-insensitive)', async () => {
  const { auth } = await setup();
  await auth.register(good);
  await assert.rejects(auth.register({ ...good, email: 'other@example.com', username: 'RIDA_Z' }), (e) => e.status === 409);
  // same email again (lowercase, as the rules require) is a duplicate
  await assert.rejects(auth.register({ ...good, username: 'someone' }), (e) => e.status === 409);
  // capital letters in an email are refused outright, with a lowercase suggestion
  const upper = await auth.register({ ...good, username: 'someone', email: 'RIDA@example.com' }).catch((e) => e);
  assert.equal(upper.status, 400);
  assert.match(upper.errors.email, /lowercase/);
  assert.match(upper.errors.email, /rida@example\.com/);
});

test('two simultaneous registrations cannot both succeed', async () => {
  const { auth } = await setup();
  const results = await Promise.allSettled([auth.register(good), auth.register(good)]);
  assert.equal(results.filter((r) => r.status === 'fulfilled').length, 1);
});

test('login works by username or email; wrong user and wrong password give the SAME error', async () => {
  const { auth } = await setup();
  await auth.register(good);
  assert.equal((await auth.login({ identifier: 'rida_z', password: good.password })).user.username, 'rida_z');
  assert.equal((await auth.login({ identifier: 'RIDA@example.com', password: good.password })).user.username, 'rida_z');

  const wrongPw = await auth.login({ identifier: 'rida_z', password: 'nope' }).catch((e) => e);
  const wrongUser = await auth.login({ identifier: 'ghost', password: 'nope' }).catch((e) => e);
  assert.equal(wrongPw.status, 401);
  assert.equal(wrongUser.status, 401);
  assert.equal(wrongPw.message, wrongUser.message);
  assert.equal(wrongPw.message, 'Invalid username/email or password.');
});

test('empty login fields are rejected', async () => {
  const { auth } = await setup();
  await assert.rejects(auth.login({ identifier: '', password: '' }), (e) => e.status === 400);
});

test('users persist across a restart', async () => {
  const { auth, file, store } = await setup();
  await auth.register(good);
  await store.flush();
  const reopened = await createUserStore(file);
  assert.equal(reopened.count(), 1);
});

test('sessions: create / get / expire / destroy', async () => {
  let t = 1_000_000;
  const sessions = createSessionStore({ ttlMs: 1000, now: () => t });
  const token = sessions.create('u1');
  assert.equal(sessions.get(token).userId, 'u1');
  assert.equal(sessions.get('forged-token'), null);
  t += 1001;
  assert.equal(sessions.get(token), null, 'expired');
  const t2 = sessions.create('u2');
  sessions.destroy(t2);
  assert.equal(sessions.get(t2), null, 'destroyed');
  sessions.stop();
});

test('breach range lookups are cached per prefix', async () => {
  const hibp = await fakeHibp({ 'Leaked-Pass-1': 5 });
  const checker = createBreachChecker({ fetchImpl: hibp.fetchImpl });
  await checker.check('Leaked-Pass-1');
  await checker.check('Leaked-Pass-1');
  assert.equal(hibp.calls(), 1);
});

test('only a 5-character prefix is ever sent to the breach API', async () => {
  const urls = [];
  const checker = createBreachChecker({
    fetchImpl: async (url) => {
      urls.push(url);
      return { ok: true, text: async () => '' };
    },
  });
  await checker.check('Totally-Unique-Pass-42!');
  assert.equal(urls.length, 1);
  assert.match(urls[0], /\/range\/[0-9A-F]{5}$/);
  assert.ok(!urls[0].includes('Unique'));
});


// ---------------------------------------------------------------------------
// Per-account lockout
// ---------------------------------------------------------------------------
test('account locks after repeated wrong passwords, with the same answer for real and fake users', async () => {
  let t = 1_000_000;
  const { auth, guard } = await setup({ guardOptions: { maxAttempts: 3, baseLockMs: 60_000, now: () => t } });
  await auth.register(good);

  for (let i = 0; i < 2; i++) {
    const e = await auth.login({ identifier: 'rida_z', password: 'wrong' }).catch((x) => x);
    assert.equal(e.status, 401);
  }
  const third = await auth.login({ identifier: 'rida_z', password: 'wrong' }).catch((x) => x);
  assert.equal(third.status, 429);
  assert.equal(third.code, 'ACCOUNT_LOCKED');

  // even the CORRECT password is refused while locked
  const locked = await auth.login({ identifier: 'rida_z', password: good.password }).catch((x) => x);
  assert.equal(locked.status, 429);

  // a username that does not exist locks in exactly the same way (no account enumeration)
  for (let i = 0; i < 2; i++) await auth.login({ identifier: 'ghost', password: 'x' }).catch(() => {});
  const ghost = await auth.login({ identifier: 'ghost', password: 'x' }).catch((x) => x);
  assert.equal(ghost.status, 429);
  assert.equal(ghost.code, 'ACCOUNT_LOCKED');

  // after the lock expires the right password works again
  t += 61_000;
  assert.equal((await auth.login({ identifier: 'rida_z', password: good.password })).user.username, 'rida_z');
  guard.stop();
});

test('repeat lockouts last longer and a successful login resets the counter', async () => {
  let t = 5_000_000;
  const { guard } = await setup({ guardOptions: { maxAttempts: 2, baseLockMs: 60_000, now: () => t } });
  guard.fail('a');
  guard.fail('a'); // lock #1 = 60s
  assert.equal(guard.check('a').retryAfterMs, 60_000);
  t += 61_000;
  guard.fail('a');
  guard.fail('a'); // lock #2 = 120s
  assert.equal(guard.check('a').retryAfterMs, 120_000);
  t += 121_000;
  guard.reset('a');
  assert.equal(guard.check('a').locked, false);
  guard.stop();
});

// ---------------------------------------------------------------------------
// Change password
// ---------------------------------------------------------------------------
test('change password: needs the right current password, a different and non-breached new one', async () => {
  const { auth, store } = await setup({ leaked: { 'Leaked-New-Pass-5': 77 } });
  const { user } = await auth.register(good);

  const wrong = await auth.changePassword(user.id, { currentPassword: 'nope', newPassword: 'Another-Fine-Pass-81' }).catch((e) => e);
  assert.ok(wrong.errors.currentPassword);

  const same = await auth.changePassword(user.id, { currentPassword: good.password, newPassword: good.password }).catch((e) => e);
  assert.ok(same.errors.newPassword);

  const weak = await auth.changePassword(user.id, { currentPassword: good.password, newPassword: 'short1' }).catch((e) => e);
  assert.equal(weak.status, 400);

  const breached = await auth.changePassword(user.id, { currentPassword: good.password, newPassword: 'Leaked-New-Pass-5' }).catch((e) => e);
  assert.equal(breached.code, 'PASSWORD_BREACHED');

  await auth.changePassword(user.id, { currentPassword: good.password, newPassword: 'Another-Fine-Pass-81' });
  await assert.rejects(auth.login({ identifier: 'rida_z', password: good.password }), (e) => e.status === 401);
  assert.equal((await auth.login({ identifier: 'rida_z', password: 'Another-Fine-Pass-81' })).user.username, 'rida_z');
  assert.ok(store.findById(user.id));
});

test('change password: guessing the current password is locked out too', async () => {
  const { auth } = await setup({ guardOptions: { maxAttempts: 3, baseLockMs: 60_000 } });
  const { user } = await auth.register(good);
  let last;
  for (let i = 0; i < 3; i++) last = await auth.changePassword(user.id, { currentPassword: 'bad', newPassword: 'Another-Fine-Pass-81' }).catch((e) => e);
  assert.equal(last.code, 'ACCOUNT_LOCKED');
});

// ---------------------------------------------------------------------------
// SQLite store + persistent sessions (same behaviour as the JSON store)
// ---------------------------------------------------------------------------
test('SQLite: users are unique case-insensitively and survive reopening the database', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'aura-sql-'));
  const dbFile = path.join(dir, 'a.db');

  let db = openDatabase(dbFile);
  let store = createSqliteUserStore(db);
  const hibp = await fakeHibp({});
  const auth = createAuthService({
    store,
    hasher: fakeHasher,
    breachChecker: createBreachChecker({ fetchImpl: hibp.fetchImpl }),
    guard: createLoginGuard(),
  });
  await auth.register(good);
  await assert.rejects(auth.register({ ...good, username: 'RIDA_Z', email: 'new@example.com' }), (e) => e.status === 409);
  assert.equal(store.findByIdentifier('RIDA@EXAMPLE.COM').username, 'rida_z');

  // the database itself refuses duplicates, even if the application check were bypassed
  await assert.rejects(store.create({ id: 'x', username: 'Rida_Z', email: 'z@z.com', passwordHash: 'h', createdAt: 'n', lastLoginAt: 'n' }));
  db.close();

  db = openDatabase(dbFile);
  store = createSqliteUserStore(db);
  assert.equal(store.count(), 1);
  db.close();
});

test('SQLite: SQL-injection style input is treated as plain text', async () => {
  const db = openDatabase(':memory:');
  const store = createSqliteUserStore(db);
  await store.create({ id: '1', username: 'bob', email: 'bob@x.com', passwordHash: 'h', createdAt: 'n', lastLoginAt: 'n' });
  assert.equal(store.findByIdentifier("' OR '1'='1"), null);
  assert.equal(store.findByIdentifier("bob'; DROP TABLE users;--"), null);
  assert.equal(store.count(), 1);
  db.close();
});

test('SQLite sessions: persist, expire, logout-all keeps the current one', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'aura-sess-'));
  const dbFile = path.join(dir, 's.db');
  let t = 10_000_000;
  let db = openDatabase(dbFile);
  const store = createSqliteUserStore(db);
  await store.create({ id: 'u1', username: 'u1', email: 'u1@x.com', passwordHash: 'h', createdAt: 'n', lastLoginAt: 'n' });

  let sessions = createSqliteSessionStore({ db, ttlMs: 1000, now: () => t });
  const a = sessions.create('u1');
  const b = sessions.create('u1');
  assert.equal(sessions.countForUser('u1'), 2);
  assert.equal(sessions.get('forged'), null);

  sessions.destroyAllForUser('u1', a);
  assert.ok(sessions.get(a));
  assert.equal(sessions.get(b), null);

  sessions.stop();
  db.close();

  // "server restart": a fresh connection still knows the session
  db = openDatabase(dbFile);
  sessions = createSqliteSessionStore({ db, ttlMs: 1000, now: () => t });
  assert.equal(sessions.get(a).userId, 'u1');
  t += 1500;
  assert.equal(sessions.get(a), null, 'expired');
  sessions.stop();
  db.close();
});

test('SQLite: the token itself is never stored, only its hash', async () => {
  const db = openDatabase(':memory:');
  const store = createSqliteUserStore(db);
  await store.create({ id: 'u1', username: 'u1', email: 'u1@x.com', passwordHash: 'h', createdAt: 'n', lastLoginAt: 'n' });
  const sessions = createSqliteSessionStore({ db, ttlMs: 60_000 });
  const token = sessions.create('u1');
  const rows = db.prepare('SELECT token_hash FROM sessions').all();
  assert.equal(rows.length, 1);
  assert.notEqual(rows[0].token_hash, token);
  sessions.stop();
  db.close();
});


// ---------------------------------------------------------------------------
// Config safety net for public deployments
// ---------------------------------------------------------------------------
test('production without SMTP switches email verification off (so visitors are not locked out)', () => {
  const c = loadConfig({ NODE_ENV: 'production' });
  assert.equal(c.mailMode, 'console');
  assert.equal(c.canEmail, false);
  assert.equal(c.requireEmailVerification, false);
  assert.equal(c.verificationWantedButNoEmail, true);
});

test('production WITH SMTP keeps verification on and can email', () => {
  const c = loadConfig({ NODE_ENV: 'production', SMTP_USER: 'a@gmail.com', SMTP_PASS: 'abcdabcdabcdabcd' });
  assert.equal(c.mailMode, 'smtp');
  assert.equal(c.canEmail, true);
  assert.equal(c.requireEmailVerification, true);
});

test('development defaults: dev inbox, verification on, can "email"', () => {
  const c = loadConfig({});
  assert.equal(c.mailMode, 'inbox');
  assert.equal(c.canEmail, true);
  assert.equal(c.requireEmailVerification, true);
  assert.equal(loadConfig({ REQUIRE_EMAIL_VERIFICATION: 'off' }).requireEmailVerification, false);
});

// ---------------------------------------------------------------------------
// Email domain (DNS) check + prepared-statement recovery
// ---------------------------------------------------------------------------
import { createEmailDomainChecker } from '../server/emailDomain.js';
import { prepared } from '../server/sql.js';

test('registration is refused when the email domain does not exist, and allowed when DNS is unreachable', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'aura-dns-'));
  const mk = async (domainCheck) => {
    const store = await createUserStore(path.join(dir, `u-${Math.random()}.json`));
    return createAuthService({
      store,
      hasher: fakeHasher,
      breachChecker: createBreachChecker({ fetchImpl: async () => ({ ok: true, text: async () => '' }) }),
      guard: createLoginGuard(),
      emailDomainCheck: domainCheck,
    });
  };
  const user = { username: 'rida_z', email: 'rida.zaib04@nonexistent-domain-xyz.com', password: 'Moonl1ght-Orchard-77' };

  const nope = await mk(async () => false);
  const e = await nope.register(user).catch((x) => x);
  assert.equal(e.status, 400);
  assert.match(e.errors.email, /mail server/);

  assert.ok(await (await mk(async () => true)).register(user));
  assert.ok(await (await mk(async () => null)).register(user), 'unknown (offline) must not block people');
});

test('domain checker: MX ok, NXDOMAIN rejected, timeouts unknown, A-record fallback, cached', async () => {
  let calls = 0;
  const err = (code) => Object.assign(new Error(code), { code });
  const resolver = {
    resolveMx: async (d) => {
      calls++;
      if (d === 'good.com') return [{ exchange: 'mx.good.com', priority: 10 }];
      if (d === 'onlya.com') throw err('ENODATA');
      if (d === 'slow.com') throw err('ETIMEOUT');
      throw err('ENOTFOUND');
    },
    resolve4: async (d) => {
      if (d === 'onlya.com') return ['1.2.3.4'];
      throw err('ENOTFOUND');
    },
  };
  const check = createEmailDomainChecker({ resolver, timeoutMs: 500 });
  assert.equal(await check('good.com'), true);
  assert.equal(await check('GOOD.com'), true);
  assert.equal(calls, 1, 'second lookup came from the cache');
  assert.equal(await check('onlya.com'), true);
  assert.equal(await check('nothere.example'), false);
  assert.equal(await check('slow.com'), null);
});

test('prepared(): recovers when Node reports a finalized statement', () => {
  let prepareCalls = 0;
  const fakeDb = {
    prepare() {
      prepareCalls++;
      let dead = prepareCalls === 1; // the first statement is "finalized" behind our back
      return {
        get: () => {
          if (dead) throw Object.assign(new Error('statement has been finalized'), { code: 'ERR_INVALID_STATE' });
          return { ok: true };
        },
      };
    },
  };
  const q = prepared(fakeDb, 'SELECT 1');
  assert.deepEqual(q.get(), { ok: true });
  assert.equal(prepareCalls, 2, 'prepared a fresh statement and retried');
  assert.deepEqual(q.get(), { ok: true });
  assert.equal(prepareCalls, 2, 'and keeps using the healthy one');
});
