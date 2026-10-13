/**
 * Authentication business logic, kept free of Express so it is easy to test.
 * Dependencies (database, password hasher, breach checker) are injected.
 */
import crypto from 'node:crypto';
import { POLICY } from '../shared/passwordPolicy.js';
import { isCommonPassword } from '../shared/commonPasswords.js';
import { validateEmail, emailDomain } from '../shared/emailPolicy.js';
import { DuplicateUserError } from './store.js';
import { maskEmail } from './mailer.js';

export class AuthError extends Error {
  constructor(status, code, message, errors, retryAfterSec) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
    this.code = code;
    this.errors = errors; // optional per-field messages: { username, email, password }
    this.retryAfterSec = retryAfterSec; // set for lockouts -> "Retry-After" header
  }
}

export const MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid username/email or password.', // never says WHICH one was wrong
  DUPLICATE: 'An account with this username or email already exists.',
};

const USERNAME_RE = /^[A-Za-z0-9_.-]{3,30}$/;

const publicUser = (user, loginTime) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  memberSince: user.createdAt,
  loginTime: loginTime || user.lastLoginAt,
  emailVerified: Boolean(user.emailVerifiedAt),
});

const BAD_CODE = 'That code is invalid or has expired. Request a new one and try again.';
const CODE_RE = /^\d{6}$/;

const lockedError = (retryAfterMs) => {
  const minutes = Math.max(1, Math.ceil(retryAfterMs / 60000));
  return new AuthError(
    429,
    'ACCOUNT_LOCKED',
    `Too many failed attempts. Please try again in ${minutes} minute${minutes === 1 ? '' : 's'}.`,
    undefined,
    Math.ceil(retryAfterMs / 1000),
  );
};

/** Password rules shared by registration and change-password. Returns an error message or null. */
function passwordRuleError(password) {
  if (!password) return 'Password is required';
  if (password.length < POLICY.MIN_LENGTH || !/\d/.test(password)) {
    return 'Password must be at least 8 characters and include at least 1 number';
  }
  if (password.length > POLICY.MAX_LENGTH || Buffer.byteLength(password, 'utf8') > 72) {
    return `Password must be at most ${POLICY.MAX_LENGTH} characters`;
  }
  if (isCommonPassword(password)) return 'This password is far too common. Please choose a different one.';
  return null;
}

export function createAuthService({
  store,
  hasher,
  breachChecker,
  guard,
  codes,
  mailer,
  secret = 'dev-only-secret-change-me',
  requireEmailVerification = false,
  emailDomainCheck = null, // async (domain) => true | false | null; see emailDomain.js
  codeTtlMs = 10 * 60 * 1000,
  codeMaxAttempts = 5,
  resendCooldownMs = 60 * 1000,
  // DEMO MODE: instead of emailing the code, hand it back in the API reply so the UI can show it on screen.
  // Only for demos / coursework on a site with no email service. Anyone can then reset any account.
  demoCodes = false,
  now = () => Date.now(),
}) {
  const ttlMinutes = Math.round(codeTtlMs / 60000);

  // ---- email codes -----------------------------------------------------------------------
  /** HMAC so the stored value is useless without the server secret (6 digits alone are brute-forceable). */
  const hashCode = (userId, purpose, code) =>
    crypto.createHmac('sha256', secret).update(`${userId}:${purpose}:${code}`).digest('hex');

  const safeEqual = (a, b) => {
    const A = Buffer.from(a, 'hex');
    const B = Buffer.from(b, 'hex');
    return A.length === B.length && crypto.timingSafeEqual(A, B);
  };

  /**
   * Creates and emails a fresh code. Silently does nothing if one was sent less than the
   * cooldown ago (stops people using us to spam an inbox). Returns { sent, throttled }.
   */
  async function issueCode(user, purpose) {
    const existing = codes.get(user.id, purpose);
    if (!demoCodes && existing && now() - existing.lastSentAt < resendCooldownMs) return { sent: false, throttled: true };

    const code = String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
    codes.put(user.id, purpose, { codeHash: hashCode(user.id, purpose, code), expiresAt: now() + codeTtlMs, sentAt: now() });
    if (demoCodes) return { sent: true, throttled: false, code }; // shown on screen, nothing is emailed
    const result = await mailer.sendCode({ to: user.email, username: user.username, code, purpose, ttlMinutes });
    return { sent: result.sent, throttled: false };
  }

  /**
   * Checks a code the user typed. Wrong guesses are counted; after codeMaxAttempts the code is
   * destroyed and a new one must be requested. Returns true / false (never says WHY it failed).
   */
  function checkCode(user, purpose, input) {
    const entry = codes.get(user.id, purpose);
    if (!entry || entry.expiresAt <= now()) {
      if (entry) codes.delete(user.id, purpose);
      return false;
    }
    if (entry.attempts >= codeMaxAttempts) {
      codes.delete(user.id, purpose);
      return false;
    }
    const typed = typeof input === 'string' ? input.trim() : '';
    const ok = CODE_RE.test(typed) && safeEqual(entry.codeHash, hashCode(user.id, purpose, typed));
    if (!ok) {
      codes.bumpAttempts(user.id, purpose);
      if (entry.attempts + 1 >= codeMaxAttempts) codes.delete(user.id, purpose);
      return false;
    }
    codes.delete(user.id, purpose); // single use
    return true;
  }

  /** Checks username / email / password rules. Returns { errors, values }. */
  function validateRegistration(body) {
    const errors = {};
    const username = typeof body?.username === 'string' ? body.username.trim() : '';
    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    if (!username) errors.username = 'Username is required';
    else if (!USERNAME_RE.test(username)) {
      errors.username = 'Username must be 3-30 characters: letters, numbers, dot, dash or underscore';
    }

    const emailCheck = validateEmail(email); // format, Gmail rules, typos, disposable and made-up names
    if (!emailCheck.ok) errors.email = emailCheck.message;

    const passwordProblem = passwordRuleError(password);
    if (passwordProblem) errors.password = passwordProblem;

    return { errors, values: { username, email, password } };
  }

  /** Throws if the password is known-breached (or, in fail-closed mode, if we can't tell). */
  async function assertNotBreached(password) {
    const breach = await breachChecker.check(password);
    if (breach.status === 'breached') {
      const times = breach.count ? ` It has appeared ${breach.count.toLocaleString('en-US')} times in known data breaches.` : '';
      throw new AuthError(
        422,
        'PASSWORD_BREACHED',
        'This password has been exposed in a data breach and cannot be used.',
        { password: `This password has been exposed in a data breach.${times} Please choose a different one.` },
      );
    }
    if (breach.status === 'unknown' && breachChecker.failMode === 'closed') {
      throw new AuthError(
        503,
        'BREACH_CHECK_UNAVAILABLE',
        'We could not verify your password against known breaches right now. Please try again shortly.',
      );
    }
    return breach;
  }

  async function register(body) {
    const { errors, values } = validateRegistration(body);
    if (Object.keys(errors).length > 0) {
      throw new AuthError(400, 'VALIDATION_FAILED', 'Please fix the highlighted fields.', errors);
    }
    const { username, email, password } = values;

    // Does the email's domain really exist and accept mail? (skipped when no checker is given or DNS is unreachable)
    if (emailDomainCheck && (await emailDomainCheck(emailDomain(email))) === false) {
      throw new AuthError(400, 'VALIDATION_FAILED', 'Please fix the highlighted fields.', {
        email: `We could not find a mail server for "${emailDomain(email)}". Please check the spelling of your email.`,
      });
    }

    // 1) Breach check (the password is only ever compared via a 5-character hash prefix)
    const breach = await assertNotBreached(password);

    // 2) Duplicate check (cheap, so do it before the slow bcrypt hash)
    if (store.isTaken(username, email)) throw new AuthError(409, 'DUPLICATE_USER', MESSAGES.DUPLICATE);

    // 3) Hash + save. bcrypt adds its own random salt; the plain password is never stored.
    const passwordHash = await hasher.hash(password);
    const stamp = new Date().toISOString();
    try {
      const user = await store.create({
        id: crypto.randomUUID(),
        username,
        email,
        passwordHash,
        createdAt: stamp,
        lastLoginAt: stamp,
        emailVerifiedAt: requireEmailVerification ? null : stamp,
      });

      let emailSent = false;
      let demoCode;
      if (requireEmailVerification) {
        const issued = await issueCode(user, 'verify');
        emailSent = issued.sent;
        demoCode = issued.code;
      }
      return {
        demoCode,
        user: publicUser(user),
        breachStatus: breach.status,
        verificationRequired: requireEmailVerification,
        emailSent,
        maskedEmail: maskEmail(user.email),
      };
    } catch (err) {
      if (err instanceof DuplicateUserError) throw new AuthError(409, 'DUPLICATE_USER', MESSAGES.DUPLICATE);
      throw err;
    }
  }

  async function login(body) {
    const identifier = typeof body?.identifier === 'string' ? body.identifier.trim() : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    if (!identifier || !password) {
      throw new AuthError(400, 'VALIDATION_FAILED', 'Username/email and password are required.', {
        ...(identifier ? {} : { identifier: 'Username or email is required' }),
        ...(password ? {} : { password: 'Password is required' }),
      });
    }
    if (identifier.length > 254 || password.length > 1024) {
      throw new AuthError(401, 'INVALID_CREDENTIALS', MESSAGES.INVALID_CREDENTIALS);
    }

    // Locked? Same answer whether or not the account exists.
    const lock = guard.check(identifier);
    if (lock.locked) throw lockedError(lock.retryAfterMs);

    const fail = () => {
      guard.fail(identifier);
      const after = guard.check(identifier); // this failure may have just triggered a lock
      return after.locked ? lockedError(after.retryAfterMs) : new AuthError(401, 'INVALID_CREDENTIALS', MESSAGES.INVALID_CREDENTIALS);
    };

    const user = store.findByIdentifier(identifier);
    if (!user) {
      await hasher.dummyCompare(password); // same timing as a real check
      throw fail();
    }

    const ok = await hasher.compare(password, user.passwordHash);
    if (!ok) throw fail();

    guard.reset(identifier);

    // Right password but the email was never confirmed: no session yet. (Only someone who knows the
    // password sees this, so it doesn't reveal which accounts exist.)
    if (requireEmailVerification && !user.emailVerifiedAt) {
      // convenience: make sure a fresh code is on its way (in demo mode it is shown on screen instead)
      let demoCode;
      if (demoCodes) demoCode = (await issueCode(user, 'verify').catch(() => ({}))).code;
      else void issueCode(user, 'verify').catch(() => {});
      throw new AuthError(403, 'EMAIL_NOT_VERIFIED', 'Please verify your email first. Enter the 6-digit code we emailed you.', {
        email: maskEmail(user.email),
        ...(demoCode ? { demoCode } : {}),
      });
    }

    const loginTime = new Date().toISOString();
    await store.update(user.id, { lastLoginAt: loginTime });
    return { user: publicUser(user, loginTime) };
  }

  // ---- email verification ---------------------------------------------------------------
  async function verifyEmail(body) {
    const identifier = typeof body?.identifier === 'string' ? body.identifier.trim() : '';
    const code = typeof body?.code === 'string' ? body.code : '';
    if (!identifier || !code.trim()) {
      throw new AuthError(400, 'VALIDATION_FAILED', 'Enter your username/email and the 6-digit code.');
    }
    const user = identifier.length <= 254 ? store.findByIdentifier(identifier) : null;
    // Unknown account, already verified, wrong or expired code: all look exactly the same.
    if (!user || user.emailVerifiedAt || !checkCode(user, 'verify', code)) {
      throw new AuthError(400, 'INVALID_CODE', BAD_CODE);
    }
    await store.update(user.id, { emailVerifiedAt: new Date().toISOString() });
    return { ok: true };
  }

  /** Always succeeds from the caller's point of view (no way to probe which accounts exist). */
  /**
   * Demo mode only: returns the real code for a real account and a random look-alike for everything
   * else, so the reply looks identical either way and still doesn't reveal which accounts exist.
   */
  async function demoReply(user, purpose, eligible) {
    if (eligible) {
      const issued = await issueCode(user, purpose).catch(() => ({}));
      if (issued.code) return issued.code;
    }
    return String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
  }

  async function resendVerification(body) {
    const identifier = typeof body?.identifier === 'string' ? body.identifier.trim() : '';
    if (!identifier) throw new AuthError(400, 'VALIDATION_FAILED', 'Enter your username or email.');
    const user = identifier.length <= 254 ? store.findByIdentifier(identifier) : null;
    // Not awaited on purpose: sending an email takes a second or two, and a reply that is slower for
    // real accounts would reveal which ones exist. The reply is instant either way.
    const eligible = Boolean(user && !user.emailVerifiedAt && requireEmailVerification);
    if (demoCodes) return { ok: true, demoCode: await demoReply(user, 'verify', eligible) };
    if (eligible) void issueCode(user, 'verify').catch(() => {});
    return { ok: true };
  }

  // ---- forgot / reset password ----------------------------------------------------------------
  /** Always succeeds from the caller's point of view, whether or not the account exists. */
  async function requestPasswordReset(body) {
    const identifier = typeof body?.identifier === 'string' ? body.identifier.trim() : '';
    if (!identifier) throw new AuthError(400, 'VALIDATION_FAILED', 'Enter your username or email.');
    const user = identifier.length <= 254 ? store.findByIdentifier(identifier) : null;
    // Not awaited on purpose (see resendVerification): same instant reply for every identifier.
    if (demoCodes) return { ok: true, demoCode: await demoReply(user, 'reset', Boolean(user)) };
    if (user) void issueCode(user, 'reset').catch(() => {});
    return { ok: true };
  }

  async function resetPassword(body) {
    const identifier = typeof body?.identifier === 'string' ? body.identifier.trim() : '';
    const code = typeof body?.code === 'string' ? body.code : '';
    const newPassword = typeof body?.newPassword === 'string' ? body.newPassword : '';

    if (!identifier || !code.trim()) {
      throw new AuthError(400, 'VALIDATION_FAILED', 'Enter your username/email and the 6-digit code.');
    }
    // Password rules first: they don't depend on the account, so they reveal nothing about it,
    // and a typo in the new password must not use up one of the code attempts.
    const ruleProblem = passwordRuleError(newPassword);
    if (ruleProblem) throw new AuthError(400, 'VALIDATION_FAILED', 'Please fix the highlighted fields.', { newPassword: ruleProblem });
    await assertNotBreached(newPassword);

    const user = identifier.length <= 254 ? store.findByIdentifier(identifier) : null;
    if (!user || !checkCode(user, 'reset', code)) throw new AuthError(400, 'INVALID_CODE', BAD_CODE);

    await store.update(user.id, {
      passwordHash: await hasher.hash(newPassword),
      // being able to read the email proves the address is theirs
      ...(user.emailVerifiedAt ? {} : { emailVerifiedAt: new Date().toISOString() }),
    });
    codes.deleteAllForUser(user.id);
    guard.reset(user.username); // a reset also clears any brute-force lock on the account
    guard.reset(user.email);
    guard.reset(`change:${user.id}`);
    return { userId: user.id };
  }

  /** Changes the password of a logged-in user. The new password goes through the full policy + breach check. */
  async function changePassword(userId, body) {
    const currentPassword = typeof body?.currentPassword === 'string' ? body.currentPassword : '';
    const newPassword = typeof body?.newPassword === 'string' ? body.newPassword : '';

    const user = store.findById(userId);
    if (!user) throw new AuthError(401, 'UNAUTHENTICATED', 'Please sign in.');

    if (!currentPassword) {
      throw new AuthError(400, 'VALIDATION_FAILED', 'Please fix the highlighted fields.', { currentPassword: 'Current password is required' });
    }
    const ruleProblem = passwordRuleError(newPassword);
    if (ruleProblem) throw new AuthError(400, 'VALIDATION_FAILED', 'Please fix the highlighted fields.', { newPassword: ruleProblem });

    // Someone who stole an open session must not be able to brute-force the current password
    const guardKey = `change:${user.id}`;
    const lock = guard.check(guardKey);
    if (lock.locked) throw lockedError(lock.retryAfterMs);

    if (!(await hasher.compare(currentPassword, user.passwordHash))) {
      guard.fail(guardKey);
      const after = guard.check(guardKey); // this failure may have just triggered a lock
      if (after.locked) throw lockedError(after.retryAfterMs);
      throw new AuthError(400, 'VALIDATION_FAILED', 'Please fix the highlighted fields.', { currentPassword: 'Current password is incorrect' });
    }
    guard.reset(guardKey);

    if (newPassword === currentPassword) {
      throw new AuthError(400, 'VALIDATION_FAILED', 'Please fix the highlighted fields.', { newPassword: 'New password must be different from the current one' });
    }

    await assertNotBreached(newPassword);
    await store.update(user.id, { passwordHash: await hasher.hash(newPassword) });
    return { ok: true };
  }

  /** Dev-only helper behind the "Seed Demo User" button: skips the password policy on purpose. */
  async function seedDemoUser() {
    const username = 'alice';
    const email = 'alice@celestial.vault';
    const password = 'Secret123';
    if (store.isTaken(username, email)) return { created: false, username, password };
    const stamp = new Date().toISOString();
    await store.create({
      id: crypto.randomUUID(),
      username,
      email,
      passwordHash: await hasher.hash(password),
      createdAt: stamp,
      lastLoginAt: stamp,
      emailVerifiedAt: stamp, // the demo account skips verification on purpose
    });
    return { created: true, username, password };
  }

  const getUser = (id) => {
    const user = store.findById(id);
    return user ? publicUser(user) : null;
  };

  return {
    register,
    login,
    changePassword,
    verifyEmail,
    resendVerification,
    requestPasswordReset,
    resetPassword,
    seedDemoUser,
    getUser,
    validateRegistration,
  };
}
