/**
 * Pending email codes in SQLite (one active code per user per purpose: 'verify' or 'reset').
 * Only the HMAC of the code is stored, never the code itself.
 */
import { prepared } from './sql.js';

export function createSqliteCodeStore({ db, now = () => Date.now() }) {
  const q = {
    put: prepared(db, 
      `INSERT INTO email_codes (user_id, purpose, code_hash, expires_at, attempts, last_sent_at)
       VALUES (?, ?, ?, ?, 0, ?)
       ON CONFLICT(user_id, purpose) DO UPDATE SET
         code_hash = excluded.code_hash, expires_at = excluded.expires_at,
         attempts = 0, last_sent_at = excluded.last_sent_at`,
    ),
    get: prepared(db, 'SELECT code_hash, expires_at, attempts, last_sent_at FROM email_codes WHERE user_id = ? AND purpose = ?'),
    bump: prepared(db, 'UPDATE email_codes SET attempts = attempts + 1 WHERE user_id = ? AND purpose = ?'),
    del: prepared(db, 'DELETE FROM email_codes WHERE user_id = ? AND purpose = ?'),
    delUser: prepared(db, 'DELETE FROM email_codes WHERE user_id = ?'),
    sweep: prepared(db, 'DELETE FROM email_codes WHERE expires_at <= ?'),
  };

  q.sweep.run(now());
  const timer = setInterval(() => q.sweep.run(now()), 10 * 60 * 1000);
  timer.unref?.();

  return {
    db, // strong reference (see sqliteStore.js)
    put(userId, purpose, { codeHash, expiresAt, sentAt }) {
      q.put.run(userId, purpose, codeHash, expiresAt, sentAt ?? now());
    },
    get(userId, purpose) {
      const r = q.get.get(userId, purpose);
      return r
        ? { codeHash: r.code_hash, expiresAt: Number(r.expires_at), attempts: Number(r.attempts), lastSentAt: Number(r.last_sent_at) }
        : null;
    },
    bumpAttempts(userId, purpose) {
      q.bump.run(userId, purpose);
    },
    delete(userId, purpose) {
      q.del.run(userId, purpose);
    },
    deleteAllForUser(userId) {
      q.delUser.run(userId);
    },
    stop: () => clearInterval(timer),
  };
}
