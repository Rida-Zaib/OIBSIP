/**
 * Breached-password detection using the free "Pwned Passwords" API from Have I Been Pwned.
 *
 * HOW IT STAYS PRIVATE (k-anonymity):
 *   1. We compute the SHA-1 hash of the password, e.g.  5BAA6 1E4C9B93F3F0682250B6CF8331B7EE68FD8
 *   2. We send ONLY the first 5 characters ("5BAA6") to the API.
 *   3. The API returns every leaked-hash SUFFIX that starts with that prefix (hundreds of them).
 *   4. We look for our own suffix in that list locally. The password (and even its full hash)
 *      never leaves this machine.
 *
 * A built-in list of the most common passwords is checked first, so the most obvious bad
 * choices are blocked instantly and even when the internet / API is unavailable.
 */
import { sha1Hex, findInRangeResponse } from '../shared/passwordPolicy.js';
import { isCommonPassword } from '../shared/commonPasswords.js';

const PREFIX_RE = /^[0-9A-F]{5}$/i;

export function createBreachChecker({
  enabled = true,
  failMode = 'open',
  baseUrl = 'https://api.pwnedpasswords.com',
  fetchImpl = globalThis.fetch,
  timeoutMs = 4000,
  cacheTtlMs = 60 * 60 * 1000,
  maxCacheEntries = 500,
} = {}) {
  const cache = new Map(); // prefix -> { text, expires }

  /** Returns the raw range response text for a 5-char hash prefix (cached for an hour). */
  async function fetchRange(prefix) {
    if (!PREFIX_RE.test(prefix)) throw new Error('Invalid hash prefix');
    const key = prefix.toUpperCase();

    const hit = cache.get(key);
    if (hit && hit.expires > Date.now()) return hit.text;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetchImpl(`${baseUrl}/range/${key}`, {
        headers: {
          // "Padding" adds fake entries so response size can't hint at the real match count
          'Add-Padding': 'true',
          'User-Agent': 'AuraAuth-StudentProject',
        },
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`Breach service responded with HTTP ${res.status}`);
      const text = await res.text();

      if (cache.size >= maxCacheEntries) cache.delete(cache.keys().next().value);
      cache.set(key, { text, expires: Date.now() + cacheTtlMs });
      return text;
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * @returns {Promise<{status: 'breached'|'safe'|'unknown'|'skipped', count: number|null, source: string}>}
   */
  async function check(password) {
    if (isCommonPassword(password)) {
      return { status: 'breached', count: null, source: 'builtin-list' };
    }
    if (!enabled) return { status: 'skipped', count: null, source: 'disabled' };

    try {
      const hash = await sha1Hex(password);
      const text = await fetchRange(hash.slice(0, 5));
      const count = findInRangeResponse(text, hash.slice(5));
      return count > 0
        ? { status: 'breached', count, source: 'hibp' }
        : { status: 'safe', count: 0, source: 'hibp' };
    } catch (err) {
      console.warn(`[breach] Could not reach breach database: ${err.message}`);
      return { status: 'unknown', count: null, source: 'error' };
    }
  }

  return { check, fetchRange, failMode, enabled };
}
