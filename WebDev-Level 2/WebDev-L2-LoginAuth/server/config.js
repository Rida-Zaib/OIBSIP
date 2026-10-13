/**
 * Central server configuration, read from environment variables (see .env.example).
 * Every value has a safe default so `npm run server` works with zero setup.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const num = (value, fallback) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

export function loadConfig(env = process.env) {
  const isProd = env.NODE_ENV === 'production';

  // Mail transport: "inbox" shows emails on an in-app Dev Inbox page (default while developing, no setup),
  // "console" prints the code in the server terminal, "smtp" really sends the email (e.g. Gmail).
  // In production without SMTP it falls back to "console", because an open inbox page must never be public.
  const demoCodes = env.DEMO_SHOW_CODES === 'on'; // explicit opt-in, see README
  const mailMode = (() => {
    if (demoCodes) return 'demo';
    if (env.MAIL_MODE === 'smtp' || (env.SMTP_USER && !env.MAIL_MODE)) return 'smtp';
    if (env.MAIL_MODE === 'console') return 'console';
    if (env.MAIL_MODE === 'inbox' && !isProd) return 'inbox';
    return isProd ? 'console' : 'inbox';
  })();
  // Can a visitor actually RECEIVE a code? On a public server only real SMTP can deliver one.
  const canEmail = mailMode === 'smtp' || mailMode === 'demo' || !isProd;

  return {
    isProd,
    port: num(env.PORT, 4000),
    bcryptRounds: Math.min(num(env.BCRYPT_ROUNDS, 12), 15),
    sessionTtlMs: num(env.SESSION_TTL_HOURS, 12) * 60 * 60 * 1000,
    // "sqlite" (default, needs Node 22.13+; falls back to json automatically) or "json"
    storeType: env.STORE === 'json' ? 'json' : 'sqlite',
    dbFile: env.DB_FILE || path.join(here, 'data', 'auraauth.db'),
    dataFile: env.DATA_FILE || path.join(here, 'data', 'users.json'),

    // Per-account lockout after repeated wrong passwords
    loginMaxAttempts: num(env.LOGIN_MAX_ATTEMPTS, 5),
    loginLockMinutes: num(env.LOGIN_LOCK_MINUTES, 5),
    distDir: path.join(here, '..', 'dist'),
    trustProxy: env.TRUST_PROXY ? num(env.TRUST_PROXY, 1) : false,

    // Email verification + password reset (6-digit codes sent by email)
    // Safety net: a public site that cannot send real email must NOT demand a code nobody can receive,
    // otherwise every new visitor would be locked out. So verification switches itself off there.
    // Look up the e-mail domain in DNS at sign-up (EMAIL_DNS_CHECK=off to disable, e.g. when offline)
    emailDnsCheck: env.EMAIL_DNS_CHECK !== 'off',
    requireEmailVerification: env.REQUIRE_EMAIL_VERIFICATION !== 'off' && canEmail,
    verificationWantedButNoEmail: env.REQUIRE_EMAIL_VERIFICATION !== 'off' && !canEmail,
    codeTtlMinutes: num(env.CODE_TTL_MINUTES, 10),
    codeMaxAttempts: num(env.CODE_MAX_ATTEMPTS, 5),
    resendCooldownSec: num(env.RESEND_COOLDOWN_SEC, 60),
    appSecret: env.APP_SECRET || '', // if empty, one is generated and kept in server/data/secret.key
    secretFile: env.SECRET_FILE || path.join(here, 'data', 'secret.key'),

    mailMode,
    canEmail,
    demoCodes,
    smtp: {
      host: env.SMTP_HOST || 'smtp.gmail.com',
      port: num(env.SMTP_PORT, 465),
      user: env.SMTP_USER || '',
      pass: (env.SMTP_PASS || '').replace(/\s+/g, ''), // Google shows App Passwords with spaces; remove them
      from: env.MAIL_FROM || (env.SMTP_USER ? `AuraAuth <${env.SMTP_USER}>` : 'AuraAuth <no-reply@auraauth.local>'),
    },

    // Breach checking (Have I Been Pwned "Pwned Passwords", k-anonymity range API)
    breachCheckEnabled: env.BREACH_CHECK !== 'off',
    // If the breach service cannot be reached: "open" = allow the password (still blocks the
    // built-in common-password list), "closed" = refuse registration until it is reachable.
    breachFailMode: env.BREACH_FAIL_MODE === 'closed' ? 'closed' : 'open',
    hibpBaseUrl: env.HIBP_BASE_URL || 'https://api.pwnedpasswords.com',

    // The dev-only "Seed Demo User" button is never available in production.
    allowDevSeed: !isProd && env.ALLOW_DEV_SEED !== 'false',
  };
}
