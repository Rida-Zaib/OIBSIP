/**
 * Tiny JSON-file user database (the assignment allows "a simple JSON or SQLite store").
 *
 *  - Whole file is kept in memory and written back atomically (write temp file, then rename)
 *    so a crash can never leave a half-written users.json.
 *  - Writes are queued so two requests can never interleave their saves.
 *  - Duplicate checks happen synchronously inside create(), so two simultaneous registrations
 *    with the same username/email cannot both succeed.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

export class DuplicateUserError extends Error {
  constructor() {
    super('Duplicate username or email');
    this.name = 'DuplicateUserError';
  }
}

export async function createUserStore(filePath) {
  let users = [];

  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    users = Array.isArray(parsed.users) ? parsed.users : [];
    // Accounts saved before email verification existed count as verified (so nobody is locked out)
    for (const u of users) if (u.emailVerifiedAt === undefined) u.emailVerifiedAt = u.createdAt || new Date().toISOString();
  } catch (err) {
    if (err.code !== 'ENOENT') {
      // Corrupted file: keep a copy for inspection and start fresh instead of crashing.
      console.error(`[store] Could not read ${filePath} (${err.message}). Backing it up and starting empty.`);
      await fs.rename(filePath, `${filePath}.corrupt-${Date.now()}`).catch(() => {});
    }
  }

  let queue = Promise.resolve();
  const persist = () => {
    queue = queue
      .catch(() => {}) // a failed earlier save must not block later ones
      .then(async () => {
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        const tmp = `${filePath}.tmp`;
        await fs.writeFile(tmp, JSON.stringify({ users }, null, 2), 'utf8');
        await fs.rename(tmp, filePath);
      });
    return queue;
  };

  const lower = (s) => String(s).toLowerCase();

  return {
    count: () => users.length,
    findById: (id) => users.find((u) => u.id === id) || null,
    /** Matches a username OR an email, case-insensitively. */
    findByIdentifier(identifier) {
      const id = lower(identifier);
      return users.find((u) => lower(u.username) === id || lower(u.email) === id) || null;
    },
    isTaken(username, email) {
      const un = lower(username);
      const em = lower(email);
      return users.some((u) => lower(u.username) === un || lower(u.email) === em);
    },
    async create(user) {
      if (this.isTaken(user.username, user.email)) throw new DuplicateUserError();
      users.push(user);
      await persist();
      return user;
    },
    async update(id, patch) {
      const user = users.find((u) => u.id === id);
      if (!user) return null;
      Object.assign(user, patch);
      await persist();
      return user;
    },
    flush: () => queue,
  };
}
