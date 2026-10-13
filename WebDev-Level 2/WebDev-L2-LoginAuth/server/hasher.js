/**
 * Password hashing with bcrypt (bcryptjs = pure JavaScript, so no native build tools needed
 * on Windows). bcrypt generates a random salt for every password and embeds it in the hash,
 * and its cost factor makes each guess deliberately slow for an attacker.
 */
import bcrypt from 'bcryptjs';

export function createBcryptHasher(rounds = 12) {
  // A real hash of a random value, used to burn the same CPU time when the user doesn't
  // exist, so response time doesn't reveal which usernames/emails are registered.
  const dummyHash = bcrypt.hashSync(`dummy-${Math.random()}-${Date.now()}`, rounds);

  return {
    hash: (password) => bcrypt.hash(password, rounds),
    compare: (password, hash) => bcrypt.compare(password, hash),
    dummyCompare: async (password) => {
      await bcrypt.compare(password, dummyHash);
      return false;
    },
  };
}
