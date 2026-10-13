/** In-memory version of the code store, used with the JSON-file fallback (codes vanish on restart). */
export function createMemoryCodeStore({ now = () => Date.now() } = {}) {
  const map = new Map(); // `${userId}:${purpose}` -> { codeHash, expiresAt, attempts, lastSentAt }
  const key = (u, p) => `${u}:${p}`;

  const timer = setInterval(() => {
    const t = now();
    for (const [k, v] of map) if (v.expiresAt <= t) map.delete(k);
  }, 10 * 60 * 1000);
  timer.unref?.();

  return {
    put(userId, purpose, { codeHash, expiresAt, sentAt }) {
      map.set(key(userId, purpose), { codeHash, expiresAt, attempts: 0, lastSentAt: sentAt ?? now() });
    },
    get: (userId, purpose) => {
      const v = map.get(key(userId, purpose));
      return v ? { ...v } : null;
    },
    bumpAttempts(userId, purpose) {
      const v = map.get(key(userId, purpose));
      if (v) v.attempts += 1;
    },
    delete: (userId, purpose) => void map.delete(key(userId, purpose)),
    deleteAllForUser(userId) {
      for (const k of [...map.keys()]) if (k.startsWith(`${userId}:`)) map.delete(k);
    },
    stop: () => clearInterval(timer),
  };
}
