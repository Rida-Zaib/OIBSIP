/**
 * AuraAuth server entry point (wiring only; the Express app itself is built in app.js).
 *
 *   Development : npm run dev:all     (Vite on :3000 proxies /api to this server on :4000)
 *   Production  : npm run build && npm start   (this server serves the built site AND the API)
 */
import 'dotenv/config';
import { loadConfig } from './config.js';
import { createUserStore } from './store.js';
import { createSessionStore } from './sessions.js';
import { createBcryptHasher } from './hasher.js';
import { createBreachChecker } from './breach.js';
import { createLoginGuard } from './loginGuard.js';
import { createMailer } from './mailer.js';
import { createMemoryCodeStore } from './memoryCodes.js';
import { loadOrCreateSecret } from './secret.js';
import { createAuthService } from './authService.js';
import { createApp } from './app.js';
import { createEmailDomainChecker } from './emailDomain.js';

const config = loadConfig();

// ---- Storage: SQLite (default) or the simple JSON file ------------------------------------
let store;
let sessions;
let codes;
let storeName;
let database = null; // module-level on purpose: keeps the SQLite database alive for the whole run

if (config.storeType === 'sqlite') {
  try {
    const { openDatabase } = await import('./db.js'); // needs Node 22.13+ (built-in node:sqlite)
    const { createSqliteUserStore } = await import('./sqliteStore.js');
    const { createSqliteSessionStore } = await import('./sqliteSessions.js');
    const { createSqliteCodeStore } = await import('./sqliteCodes.js');
    const db = openDatabase(config.dbFile);
    database = db;
    store = createSqliteUserStore(db);
    sessions = createSqliteSessionStore({ db, ttlMs: config.sessionTtlMs });
    codes = createSqliteCodeStore({ db });
    storeName = `SQLite (${config.dbFile})`;
  } catch (err) {
    console.warn(`\n  [warning] SQLite is not available on this Node.js version (${process.version}): ${err.message}`);
    console.warn('  Falling back to the JSON file store. Install Node.js 22.13+ to use SQLite.\n');
  }
}
if (!store) {
  store = await createUserStore(config.dataFile);
  sessions = createSessionStore({ ttlMs: config.sessionTtlMs });
  codes = createMemoryCodeStore();
  storeName = `JSON file (${config.dataFile}), sessions and email codes are in memory`;
}

const hasher = createBcryptHasher(config.bcryptRounds);
const breachChecker = createBreachChecker({
  enabled: config.breachCheckEnabled,
  failMode: config.breachFailMode,
  baseUrl: config.hibpBaseUrl,
});
const guard = createLoginGuard({
  maxAttempts: config.loginMaxAttempts,
  baseLockMs: config.loginLockMinutes * 60 * 1000,
});

const mailer = createMailer({ mode: config.demoCodes ? 'console' : config.mailMode, smtp: config.smtp }); // demo mode never mails
const secret = loadOrCreateSecret({ envValue: config.appSecret, file: config.secretFile });

const auth = createAuthService({
  store,
  hasher,
  breachChecker,
  guard,
  codes,
  mailer,
  secret,
  requireEmailVerification: config.requireEmailVerification,
  emailDomainCheck: config.emailDnsCheck ? createEmailDomainChecker() : null,
  codeTtlMs: config.codeTtlMinutes * 60 * 1000,
  codeMaxAttempts: config.codeMaxAttempts,
  resendCooldownMs: config.resendCooldownSec * 1000,
  demoCodes: config.demoCodes,
});

const app = createApp({ auth, sessions, breachChecker, config, mailer });

if (config.verificationWantedButNoEmail) {
  console.warn('\n  [warning] Running in production WITHOUT real email (SMTP_USER / SMTP_PASS are not set).');
  console.warn('  Email verification and "Forgot password" are switched off so visitors are not locked out.');
  console.warn('  Set SMTP_USER and SMTP_PASS on your host to turn them on.\n');
}

app.listen(config.port, async () => {
  console.log(`\n  AuraAuth API running on http://localhost:${config.port}`);
  console.log(`  Storage     : ${storeName}  (${store.count()} user${store.count() === 1 ? '' : 's'})`);
  console.log(
    `  Breach check: ${config.breachCheckEnabled ? 'ON (Have I Been Pwned, k-anonymity)' : 'OFF'}, if unreachable: fail-${config.breachFailMode}`,
  );
  console.log(
    `  Email verify: ${config.requireEmailVerification ? 'REQUIRED' : 'off'}, codes via ${
      config.mailMode === 'smtp'
        ? `SMTP (${config.smtp.host}, as ${config.smtp.user})`
        : config.mailMode === 'demo'
          ? 'DEMO MODE (the code is shown on screen, nothing is emailed: for demos only!)'
          : config.mailMode === 'inbox'
            ? 'DEV INBOX (a pretend mailbox in the app: open #/inbox)'
            : 'CONSOLE (codes are printed in this terminal)'
    }`,
  );
  if (config.mailMode === 'smtp') {
    const check = await mailer.verifyConnection();
    console.log(check.ok ? '  SMTP login  : OK' : `  SMTP login  : FAILED (${check.error}). Check SMTP_USER / SMTP_PASS in .env`);
  }
  console.log(`  Login lockout: ${config.loginMaxAttempts} wrong attempts -> ${config.loginLockMinutes} min lock (doubles on repeats)\n`);
});

// Close the database cleanly when you press Ctrl+C
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    try {
      database?.close();
    } catch {
      /* already closed */
    }
    process.exit(0);
  });
}
