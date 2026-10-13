/**
 * Per-account brute-force protection (in addition to the per-IP rate limiter in routes.js).
 *
 * After MAX_ATTEMPTS wrong passwords for the same username/email, that identifier is locked for
 * a few minutes, and each repeat lockout doubles the wait (5, 10, 20... up to 1 hour). A
 * successful login resets the counter.
 *
 * The identifier is tracked WHETHER OR NOT the account exists, so "locked" looks identical for
 * real and made-up usernames and doesn't leak which accounts exist.
 *
 * Known trade-off: anyone can deliberately lock someone else's account for a few minutes by
 * typing wrong passwords. That is why the lock is short, grows only on repeats, and the
 * per-IP limiter also applies.
 */
export function createLoginGuard({
  maxAttempts = 5,
  baseLockMs = 5 * 60 * 1000,
  maxLockMs = 60 * 60 * 1000,
  windowMs = 15 * 60 * 1000,
  maxEntries = 10_000,
  now = () => Date.now(),
} = {}) {
  const entries = new Map(); // key -> { fails, firstFailAt, lockedUntil, lockCount }
  const keyOf = (identifier) => String(identifier).trim().toLowerCase().slice(0, 254);

  const sweep = setInterval(() => {
    const t = now();
    for (const [k, e] of entries) {
      if (e.lockedUntil <= t && t - e.firstFailAt > windowMs && e.lockCount === 0) entries.delete(k);
      else if (e.lockedUntil <= t && t - e.firstFailAt > maxLockMs * 2) entries.delete(k);
    }
  }, 5 * 60 * 1000);
  sweep.unref?.();

  return {
    /** @returns {{locked: boolean, retryAfterMs: number}} */
    check(identifier) {
      const e = entries.get(keyOf(identifier));
      const remaining = e ? e.lockedUntil - now() : 0;
      return remaining > 0 ? { locked: true, retryAfterMs: remaining } : { locked: false, retryAfterMs: 0 };
    },
    fail(identifier) {
      const key = keyOf(identifier);
      const t = now();
      let e = entries.get(key);
      if (!e) {
        if (entries.size >= maxEntries) entries.delete(entries.keys().next().value); // bounded memory
        e = { fails: 0, firstFailAt: t, lockedUntil: 0, lockCount: 0 };
        entries.set(key, e);
      }
      if (e.lockedUntil <= t && t - e.firstFailAt > windowMs) {
        e.fails = 0;
        e.firstFailAt = t;
      }
      e.fails += 1;
      if (e.fails >= maxAttempts) {
        e.lockCount += 1;
        e.lockedUntil = t + Math.min(baseLockMs * 2 ** (e.lockCount - 1), maxLockMs);
        e.fails = 0;
        e.firstFailAt = t;
      }
    },
    reset(identifier) {
      entries.delete(keyOf(identifier));
    },
    stop: () => clearInterval(sweep),
  };
}
