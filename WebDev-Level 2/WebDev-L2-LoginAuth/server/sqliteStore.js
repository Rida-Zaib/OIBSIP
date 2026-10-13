/**
 * SQLite-backed user store. Same interface as the JSON store (store.js), so the rest of the
 * server doesn't care which one is in use. All SQL uses prepared statements with bound
 * parameters, so SQL injection is not possible.
 */
import { DuplicateUserError } from './store.js';
import { prepared } from './sql.js';

const toUser = (r) =>
  r && {
    id: r.id,
    username: r.username,
    email: r.email,
    passwordHash: r.password_hash,
    createdAt: r.created_at,
    lastLoginAt: r.last_login_at,
    emailVerifiedAt: r.email_verified_at || null,
  };

const lower = (s) => String(s).toLowerCase();

export function createSqliteUserStore(db) {
  const q = {
    count: prepared(db, 'SELECT COUNT(*) AS n FROM users'),
    byId: prepared(db, 'SELECT * FROM users WHERE id = ?'),
    byIdent: prepared(db, 'SELECT * FROM users WHERE username_lc = ? OR email_lc = ?'),
    taken: prepared(db, 'SELECT 1 AS x FROM users WHERE username_lc = ? OR email_lc = ?'),
    insert: prepared(db, 
      `INSERT INTO users (id, username, email, username_lc, email_lc, password_hash, created_at, last_login_at, email_verified_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ),
    setHash: prepared(db, 'UPDATE users SET password_hash = ? WHERE id = ?'),
    setLogin: prepared(db, 'UPDATE users SET last_login_at = ? WHERE id = ?'),
    setVerified: prepared(db, 'UPDATE users SET email_verified_at = ? WHERE id = ?'),
  };

  return {
    db, // strong reference: the database must never be garbage-collected while the store is in use
    count: () => Number(q.count.get().n),
    findById: (id) => toUser(q.byId.get(id)) || null,
    findByIdentifier(identifier) {
      const id = lower(identifier);
      return toUser(q.byIdent.get(id, id)) || null;
    },
    isTaken(username, email) {
      return Boolean(q.taken.get(lower(username), lower(email)));
    },
    async create(u) {
      try {
        q.insert.run(u.id, u.username, u.email, lower(u.username), lower(u.email), u.passwordHash, u.createdAt, u.lastLoginAt, u.emailVerifiedAt ?? null);
      } catch (err) {
        if (/UNIQUE constraint failed/i.test(String(err?.message))) throw new DuplicateUserError();
        throw err;
      }
      return u;
    },
    async update(id, patch) {
      if (patch.passwordHash !== undefined) q.setHash.run(patch.passwordHash, id);
      if (patch.lastLoginAt !== undefined) q.setLogin.run(patch.lastLoginAt, id);
      if (patch.emailVerifiedAt !== undefined) q.setVerified.run(patch.emailVerifiedAt, id);
      return toUser(q.byId.get(id)) || null;
    },
    flush: async () => {},
  };
}
