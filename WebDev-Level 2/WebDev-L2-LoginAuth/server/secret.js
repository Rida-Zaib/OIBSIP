/**
 * The server secret is used to HMAC the 6-digit email codes before they are stored, so a leaked
 * database file alone cannot be used to brute-force them.
 *
 * Order: APP_SECRET from .env, otherwise a random one saved to server/data/secret.key (created
 * once, reused after restarts, git-ignored).
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export function loadOrCreateSecret({ envValue, file }) {
  if (envValue && envValue.length >= 16) return envValue;
  try {
    const existing = fs.readFileSync(file, 'utf8').trim();
    if (existing.length >= 32) return existing;
  } catch {
    /* no file yet */
  }
  const secret = crypto.randomBytes(32).toString('hex');
  try {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, secret, { mode: 0o600 });
  } catch (err) {
    console.warn(`[secret] Could not save ${file} (${err.message}). Email codes will stop working after a restart.`);
  }
  return secret;
}
