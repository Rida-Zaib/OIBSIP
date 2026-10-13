/**
 * HTTP API. Thin layer: parse the request, call the auth service, set/clear the cookie.
 *
 *   POST /api/register            create an account
 *   POST /api/login               verify credentials, start a session (httpOnly cookie)
 *   POST /api/logout              destroy the session
 *   POST /api/logout-all          destroy EVERY session of this user (all devices)
 *   GET  /api/config              public: is email verification on? is mail in console mode?
 *   POST /api/verify-email        confirm the emailed 6-digit code after registering
 *   POST /api/resend-verification send a new code (same reply for every account)
 *   POST /api/forgot-password     email a reset code (same reply for every account)
 *   POST /api/reset-password      code + new password; signs out every device
 *   POST /api/change-password     change password (needs the current one), logs out other devices
 *   POST /api/verify-email        confirm the email address with the 6-digit code
 *   POST /api/resend-verification send a new verification code
 *   POST /api/forgot-password     email a password-reset code (same reply whether or not the account exists)
 *   POST /api/reset-password      set a new password using the code; signs out all devices
 *   GET  /api/me                  who is logged in? (401 if nobody)  -> used by the protected page
 *   GET  /api/breach/range/:pfx   proxy for the breach-lookup (5-char hash prefix only)
 *   POST /api/dev/seed            development only: create the demo user
 */
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { AuthError } from './authService.js';

export const SESSION_COOKIE = 'aura_sid';

export function createRoutes({ auth, sessions, breachChecker, config, mailer }) {
  const router = Router();

  const cookieOptions = {
    httpOnly: true, // JavaScript on the page can never read the session token
    sameSite: 'strict', // the cookie is never sent on cross-site requests (CSRF protection)
    secure: config.isProd, // HTTPS-only in production
    path: '/',
  };

  const limiter = (windowMs, limit, message, skipSuccessfulRequests = false) =>
    rateLimit({
      windowMs,
      limit,
      skipSuccessfulRequests,
      standardHeaders: true,
      legacyHeaders: false,
      handler: (_req, res) => res.status(429).json({ code: 'RATE_LIMITED', message }),
    });

  const loginLimiter = limiter(15 * 60 * 1000, 10, 'Too many login attempts. Please wait a few minutes and try again.', true);
  const registerLimiter = limiter(60 * 60 * 1000, 15, 'Too many sign-up attempts. Please try again later.');
  const changePwLimiter = limiter(60 * 60 * 1000, 10, 'Too many password change attempts. Please try again later.');
  const verifyLimiter = limiter(15 * 60 * 1000, 20, 'Too many attempts. Please wait a few minutes and try again.');
  const resendLimiter = limiter(10 * 60 * 1000, 8, 'Too many code requests. Please wait a few minutes.');
  const forgotLimiter = limiter(60 * 60 * 1000, 10, 'Too many reset requests. Please try again later.');
  const resetLimiter = limiter(15 * 60 * 1000, 15, 'Too many attempts. Please wait a few minutes and try again.');
  const breachLimiter = limiter(60 * 1000, 120, 'Too many password checks. Please slow down.');

  const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

  function requireAuth(req, res, next) {
    const token = req.cookies?.[SESSION_COOKIE];
    const session = sessions.get(token);
    const user = session ? auth.getUser(session.userId) : null;
    if (!user) {
      if (token) res.clearCookie(SESSION_COOKIE, cookieOptions);
      return res.status(401).json({ code: 'UNAUTHENTICATED', message: 'Please sign in.' });
    }
    req.authUser = { ...user, loginTime: session.loginTime };
    req.sessionToken = token;
    next();
  }

  router.post(
    '/register',
    registerLimiter,
    wrap(async (req, res) => {
      const result = await auth.register(req.body);
      // Registration does NOT log the user in. With verification on, they enter the emailed code next.
      res.status(201).json({
        user: { username: result.user.username, email: result.user.email },
        verificationRequired: result.verificationRequired,
        emailSent: result.emailSent,
        maskedEmail: result.maskedEmail,
        ...(result.demoCode ? { demoCode: result.demoCode } : {}), // demo mode only
      });
    }),
  );

  router.post(
    '/login',
    loginLimiter,
    wrap(async (req, res) => {
      const { user } = await auth.login(req.body);

      // Fresh token on every login (prevents session fixation), old one is discarded
      sessions.destroy(req.cookies?.[SESSION_COOKIE]);
      const token = sessions.create(user.id);
      res.cookie(SESSION_COOKIE, token, { ...cookieOptions, maxAge: config.sessionTtlMs });
      res.json({ user });
    }),
  );

  router.post('/logout', (req, res) => {
    sessions.destroy(req.cookies?.[SESSION_COOKIE]);
    res.clearCookie(SESSION_COOKIE, cookieOptions);
    res.json({ ok: true });
  });

  router.post('/logout-all', requireAuth, (req, res) => {
    sessions.destroyAllForUser(req.authUser.id);
    res.clearCookie(SESSION_COOKIE, cookieOptions);
    res.json({ ok: true });
  });

  router.post(
    '/change-password',
    requireAuth,
    changePwLimiter,
    wrap(async (req, res) => {
      await auth.changePassword(req.authUser.id, req.body);
      // The password changed, so every OTHER device is signed out; this one stays signed in.
      sessions.destroyAllForUser(req.authUser.id, req.sessionToken);
      res.json({ ok: true });
    }),
  );

  router.post(
    '/verify-email',
    verifyLimiter,
    wrap(async (req, res) => {
      await auth.verifyEmail(req.body);
      res.json({ ok: true });
    }),
  );

  router.post(
    '/resend-verification',
    resendLimiter,
    wrap(async (req, res) => {
      const { demoCode } = await auth.resendVerification(req.body);
      // Same reply for every account, so this can't be used to discover who is registered
      res.json({ ok: true, message: 'If that account is waiting for verification, a new code is on its way.', ...(demoCode ? { demoCode } : {}) });
    }),
  );

  router.post(
    '/forgot-password',
    forgotLimiter,
    wrap(async (req, res) => {
      const { demoCode } = await auth.requestPasswordReset(req.body);
      res.json({ ok: true, message: 'If an account matches, a reset code is on its way.', ...(demoCode ? { demoCode } : {}) });
    }),
  );

  router.post(
    '/reset-password',
    resetLimiter,
    wrap(async (req, res) => {
      const { userId } = await auth.resetPassword(req.body);
      sessions.destroyAllForUser(userId); // anyone who was signed in (maybe the attacker) is kicked out
      res.json({ ok: true });
    }),
  );

  // Dev Inbox: only exists when mail is in "inbox" mode (never in production). It shows the emails the
  // app "sent", so the verification / reset code can be read without any real email account.
  if (mailer && mailer.mode === 'inbox' && !config.isProd) {
    // Only the computer running the server may open it (Vite's proxy connects from localhost), so
    // someone else on the same Wi-Fi can't read your codes.
    const localOnly = (req, res, next) => {
      const addr = req.socket?.remoteAddress || '';
      if (addr === '127.0.0.1' || addr === '::1' || addr === '::ffff:127.0.0.1') return next();
      res.status(404).json({ code: 'NOT_FOUND', message: 'Unknown API route.' });
    };
    router.get('/dev/inbox', localOnly, (_req, res) => {
      res.set('Cache-Control', 'no-store');
      res.json({ messages: mailer.listInbox() });
    });
    router.delete('/dev/inbox', localOnly, (_req, res) => {
      mailer.clearInbox();
      res.json({ ok: true });
    });
  }

  // Public, non-sensitive: lets the UI show the right hint ("check your inbox" vs "check the server terminal")
  router.get('/config', (_req, res) => {
    res.json({
      emailVerification: Boolean(config.requireEmailVerification),
      mailMode: (mailer && mailer.mode) || config.mailMode || 'console',
      demoCodes: Boolean(config.demoCodes),
      canEmail: config.canEmail !== false, // false = nobody could receive a code, so the UI hides "Forgot password?"
    });
  });

  router.get('/me', requireAuth, (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.json({ user: { ...req.authUser, activeSessions: sessions.countForUser(req.authUser.id) } });
  });

  router.get(
    '/breach/range/:prefix',
    breachLimiter,
    wrap(async (req, res) => {
      if (!/^[0-9A-Fa-f]{5}$/.test(req.params.prefix)) {
        return res.status(400).json({ code: 'BAD_PREFIX', message: 'Expected a 5-character hex prefix.' });
      }
      if (!breachChecker.enabled) {
        return res.status(200).json({ code: 'DISABLED', message: 'Breach checking is disabled.' });
      }
      try {
        const text = await breachChecker.fetchRange(req.params.prefix);
        res.type('text/plain').send(text);
      } catch {
        res.status(502).json({ code: 'BREACH_SERVICE_UNAVAILABLE', message: 'Breach database unreachable.' });
      }
    }),
  );

  if (config.allowDevSeed) {
    router.post(
      '/dev/seed',
      wrap(async (_req, res) => {
        res.json(await auth.seedDemoUser());
      }),
    );
  }

  // JSON 404 for unknown API routes
  router.use((_req, res) => res.status(404).json({ code: 'NOT_FOUND', message: 'Unknown API route.' }));

  // Error handler: AuthError -> clean JSON, anything else -> generic 500 (details only in server log)
  // eslint-disable-next-line no-unused-vars
  router.use((err, _req, res, _next) => {
    if (err instanceof AuthError) {
      if (err.retryAfterSec) res.set('Retry-After', String(err.retryAfterSec));
      return res.status(err.status).json({ code: err.code, message: err.message, errors: err.errors });
    }
    if (err?.type === 'entity.parse.failed' || err?.type === 'entity.too.large') {
      return res.status(400).json({ code: 'BAD_REQUEST', message: 'Invalid request body.' });
    }
    console.error('[server] Unexpected error:', err);
    res.status(500).json({ code: 'SERVER_ERROR', message: 'Something went wrong. Please try again.' });
  });

  return router;
}
