/**
 * SQLite database (uses Node's built-in `node:sqlite`, so there is nothing extra to install
 * and no native compiler needed. Requires Node.js 22.13 or newer).
 *
 * Tables:
 *   users        : accounts. UNIQUE columns make duplicate usernames/emails impossible even if two
 *                  sign-ups arrive at the same instant (the database itself is the final judge).
 *   sessions     : login sessions, so users stay logged in across server restarts.
 *   email_codes  : pending 6-digit codes (email verification / password reset), stored only as an
 *                  HMAC, with an expiry and a wrong-attempts counter.
 */
import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

export function openDatabase(filePath) {
  if (filePath !== ':memory:') fs.mkdirSync(path.dirname(filePath), { recursive: true });

  const db = new DatabaseSync(filePath);
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    PRAGMA busy_timeout = 3000;

    CREATE TABLE IF NOT EXISTS users (
      id            TEXT PRIMARY KEY,
      username      TEXT NOT NULL,
      email         TEXT NOT NULL,
      username_lc   TEXT NOT NULL UNIQUE,
      email_lc      TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at    TEXT NOT NULL,
      last_login_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      login_time TEXT NOT NULL,
      expires_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

    CREATE TABLE IF NOT EXISTS email_codes (
      user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      purpose      TEXT NOT NULL,
      code_hash    TEXT NOT NULL,
      expires_at   INTEGER NOT NULL,
      attempts     INTEGER NOT NULL DEFAULT 0,
      last_sent_at INTEGER NOT NULL,
      PRIMARY KEY (user_id, purpose)
    );
  `);

  // Migration for databases created before email verification existed: add the column and treat
  // the accounts that already exist as verified, so nobody gets locked out of their old account.
  const columns = db.prepare('PRAGMA table_info(users)').all().map((c) => c.name);
  if (!columns.includes('email_verified_at')) {
    db.exec('ALTER TABLE users ADD COLUMN email_verified_at TEXT');
    db.exec('UPDATE users SET email_verified_at = created_at WHERE email_verified_at IS NULL');
  }
  return db;
}
