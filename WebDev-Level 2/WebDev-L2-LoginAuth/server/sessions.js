/**
 * Server-side sessions (see MDN: "HTTP cookies" + sessions).
 *
 * The browser only ever holds a random, unguessable token in an httpOnly cookie. Everything
 * else (who the user is, when the session expires) lives here on the server, so JavaScript
 * in the page can never read or forge a session, unlike the old localStorage approach.
 * Only a SHA-256 hash of the token is kept in memory, so even a memory dump leaks no live tokens.
 */
import crypto from 'node:crypto';

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

export function createSessionStore({ ttlMs, now = () => Date.now() }) {
  const sessions = new Map(); // tokenHash -> { userId, loginTime, expiresAt }

  const sweep = setInterval(() => {
    const t = now();
    for (const [key, s] of sessions) if (s.expiresAt <= t) sessions.delete(key);
  }, 10 * 60 * 1000);
  sweep.unref?.(); // don't keep the process alive just for cleanup

  return {
    create(userId) {
      const token = crypto.randomBytes(32).toString('base64url');
      sessions.set(hashToken(token), {
        userId,
        loginTime: new Date(now()).toISOString(),
        expiresAt: now() + ttlMs,
      });
      return token;
    },
    get(token) {
      if (!token || typeof token !== 'string') return null;
      const key = hashToken(token);
      const s = sessions.get(key);
      if (!s) return null;
      if (s.expiresAt <= now()) {
        sessions.delete(key);
        return null;
      }
      return s;
    },
    destroy(token) {
      if (token && typeof token === 'string') sessions.delete(hashToken(token));
    },
    destroyAllForUser(userId, exceptToken) {
      const keep = exceptToken ? hashToken(exceptToken) : null;
      for (const [key, s] of sessions) if (s.userId === userId && key !== keep) sessions.delete(key);
    },
    countForUser(userId) {
      const t = now();
      let n = 0;
      for (const s of sessions.values()) if (s.userId === userId && s.expiresAt > t) n++;
      return n;
    },
    size: () => sessions.size,
    stop: () => clearInterval(sweep),
  };
}
