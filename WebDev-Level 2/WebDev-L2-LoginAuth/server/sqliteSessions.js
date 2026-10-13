/**
 * SQLite-backed sessions: same idea as sessions.js, but they survive a server restart.
 * Only a SHA-256 hash of each token is stored, so a leaked database file contains no usable
 * session tokens.
 */
import crypto from 'node:crypto';
import { prepared } from './sql.js';

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

export function createSqliteSessionStore({ db, ttlMs, now = () => Date.now() }) {
  const q = {
    insert: prepared(db, 'INSERT INTO sessions (token_hash, user_id, login_time, expires_at) VALUES (?, ?, ?, ?)'),
    get: prepared(db, 'SELECT user_id, login_time, expires_at FROM sessions WHERE token_hash = ?'),
    del: prepared(db, 'DELETE FROM sessions WHERE token_hash = ?'),
    delUser: prepared(db, 'DELETE FROM sessions WHERE user_id = ?'),
    delUserExcept: prepared(db, 'DELETE FROM sessions WHERE user_id = ? AND token_hash != ?'),
    countUser: prepared(db, 'SELECT COUNT(*) AS n FROM sessions WHERE user_id = ? AND expires_at > ?'),
    count: prepared(db, 'SELECT COUNT(*) AS n FROM sessions'),
    sweep: prepared(db, 'DELETE FROM sessions WHERE expires_at <= ?'),
  };

  q.sweep.run(now()); // clean out anything that expired while the server was off
  const timer = setInterval(() => q.sweep.run(now()), 10 * 60 * 1000);
  timer.unref?.();

  return {
    db, // strong reference (see sqliteStore.js)
    create(userId) {
      const token = crypto.randomBytes(32).toString('base64url');
      q.insert.run(hashToken(token), userId, new Date(now()).toISOString(), now() + ttlMs);
      return token;
    },
    get(token) {
      if (!token || typeof token !== 'string') return null;
      const key = hashToken(token);
      const row = q.get.get(key);
      if (!row) return null;
      if (Number(row.expires_at) <= now()) {
        q.del.run(key);
        return null;
      }
      return { userId: row.user_id, loginTime: row.login_time, expiresAt: Number(row.expires_at) };
    },
    destroy(token) {
      if (token && typeof token === 'string') q.del.run(hashToken(token));
    },
    /** Log a user out everywhere, optionally keeping the session they are using right now. */
    destroyAllForUser(userId, exceptToken) {
      if (exceptToken) q.delUserExcept.run(userId, hashToken(exceptToken));
      else q.delUser.run(userId);
    },
    countForUser: (userId) => Number(q.countUser.get(userId, now()).n),
    size: () => Number(q.count.get().n),
    stop: () => clearInterval(timer),
  };
}
