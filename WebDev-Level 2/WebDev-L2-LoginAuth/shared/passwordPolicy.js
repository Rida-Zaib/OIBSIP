/**
 * Shared password logic used by BOTH the React front-end and the Express server.
 * Pure functions only (no DOM, no Node-only APIs) so it runs in both places.
 *
 *  - evaluatePassword()  : 5-level strength meter + checklist + crack-time estimate
 *  - generatePassword()  : cryptographically secure random password generator
 *  - sha1Hex()           : SHA-1 helper for the k-anonymity breach lookup
 *  - findInRangeResponse : parses a Have I Been Pwned "range" response
 */
import { isCommonPassword } from './commonPasswords.js';

export const POLICY = Object.freeze({
  MIN_LENGTH: 8, // assignment requirement
  MAX_LENGTH: 64, // bcrypt only uses the first 72 bytes, so we cap well below
  STRONG_LENGTH: 12,
});

export const STRENGTH_LEVELS = [
  { label: 'Very Weak', color: '#B5483C' },
  { label: 'Weak', color: '#C9703A' },
  { label: 'Fair', color: '#D9B86C' },
  { label: 'Strong', color: '#4F9A7E' },
  { label: 'Excellent', color: '#1F6B5E' },
];

const KEYBOARD_ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm', '1234567890', 'abcdefghijklmnopqrstuvwxyz'];

function formatCrackTime(seconds) {
  if (!isFinite(seconds) || seconds > 1e15) return 'millions of years+';
  if (seconds < 1) return 'instantly';
  const units = [
    ['second', 60],
    ['minute', 60],
    ['hour', 24],
    ['day', 30],
    ['month', 12],
    ['year', 100],
    ['century', 1e6],
  ];
  let value = seconds;
  for (const [name, size] of units) {
    if (value < size) {
      const n = Math.max(1, Math.round(value));
      const plural = name === 'century' ? 'centuries' : `${name}s`;
      return `${n.toLocaleString('en-US')} ${n === 1 ? name : plural}`;
    }
    value /= size;
  }
  return 'millions of years+';
}

/** Detects runs like "abc", "321", "qwe" and returns how many characters they waste. */
function patternPenalty(lower) {
  let penalty = 0;

  // repeated characters: "aaaa" only counts as one
  for (let i = 1; i < lower.length; i++) {
    if (lower[i] === lower[i - 1]) penalty += 1;
  }

  // ascending / descending runs of 3+ (abc, 123, cba, 321)
  let run = 1;
  let dir = 0;
  for (let i = 1; i <= lower.length; i++) {
    const diff = i < lower.length ? lower.charCodeAt(i) - lower.charCodeAt(i - 1) : 0;
    if ((diff === 1 || diff === -1) && (dir === 0 || dir === diff)) {
      run++;
      dir = diff;
    } else {
      if (run >= 3) penalty += run - 1;
      run = diff === 1 || diff === -1 ? 2 : 1;
      dir = diff === 1 || diff === -1 ? diff : 0;
    }
  }

  // keyboard rows (qwe, asd, zxc, 456 ...) forward or reversed
  for (const row of KEYBOARD_ROWS) {
    const rev = [...row].reverse().join('');
    for (let i = 0; i + 3 <= lower.length; i++) {
      const chunk = lower.slice(i, i + 3);
      if (row.includes(chunk) || rev.includes(chunk)) penalty += 1;
    }
  }
  return penalty;
}

/**
 * Evaluates a password.
 * @param {string} password
 * @param {{username?: string, email?: string}} [context] personal info the password must not contain
 */
export function evaluatePassword(password, context = {}) {
  const pw = typeof password === 'string' ? password : '';

  const base = {
    hasMinLength: false,
    hasNumber: false,
    hasLowercase: false,
    hasUppercase: false,
    hasSpecial: false,
    isLong: false,
    notCommon: true,
    noPersonalInfo: true,
    meetsPolicy: false, // minimum requirements (length + number + not common)
    entropyBits: 0,
    score: -1, // -1 = nothing typed yet
    label: 'Awaiting Input',
    color: '#6C8E84',
    crackTime: '',
    suggestions: [],
  };
  if (!pw) return base;

  const hasMinLength = pw.length >= POLICY.MIN_LENGTH;
  const hasNumber = /\d/.test(pw);
  const hasLowercase = /[a-z]/.test(pw);
  const hasUppercase = /[A-Z]/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);
  const isLong = pw.length >= POLICY.STRONG_LENGTH;
  const notCommon = !isCommonPassword(pw);

  // does it contain the user's own name / email?
  const lower = pw.toLowerCase();
  const personalBits = [];
  if (context.username && context.username.trim().length >= 3) personalBits.push(context.username.trim().toLowerCase());
  if (context.email && context.email.includes('@')) {
    const local = context.email.split('@')[0].trim().toLowerCase();
    if (local.length >= 3) personalBits.push(local);
  }
  const noPersonalInfo = !personalBits.some((bit) => lower.includes(bit));

  // entropy estimate
  let pool = 0;
  if (hasLowercase) pool += 26;
  if (hasUppercase) pool += 26;
  if (hasNumber) pool += 10;
  if (hasSpecial) pool += 33;
  if (pool === 0) pool = 10;
  const effectiveLength = Math.max(0, pw.length - patternPenalty(lower));
  let bits = effectiveLength * Math.log2(pool);
  if (!notCommon) bits = Math.min(bits, 10);
  if (!noPersonalInfo) bits = Math.max(0, bits - 20);
  bits = Math.round(bits);

  let score;
  if (bits < 28) score = 0;
  else if (bits < 36) score = 1;
  else if (bits < 60) score = 2;
  else if (bits < 80) score = 3;
  else score = 4;

  // minimum requirements cap the score so the meter never flatters a policy failure
  const meetsPolicy = hasMinLength && hasNumber && notCommon;
  if (!hasMinLength || !hasNumber) score = Math.min(score, 1);
  if (!notCommon) score = 0;
  if (!noPersonalInfo) score = Math.min(score, 1);

  const suggestions = [];
  if (!hasMinLength) suggestions.push(`Use at least ${POLICY.MIN_LENGTH} characters`);
  if (!hasNumber) suggestions.push('Add at least one number');
  if (!notCommon) suggestions.push('This is a very common password, pick something unique');
  if (!noPersonalInfo) suggestions.push('Remove your username or email from the password');
  if (hasMinLength && !isLong) suggestions.push(`Make it ${POLICY.STRONG_LENGTH}+ characters for extra strength`);
  if (!hasUppercase || !hasLowercase) suggestions.push('Mix uppercase and lowercase letters');
  if (!hasSpecial) suggestions.push('Add a symbol such as ! ? # $');

  // 1e10 guesses/second = a fast offline attack against an unsalted fast hash (worst case)
  const seconds = Math.pow(2, bits) / 2 / 1e10;

  return {
    hasMinLength,
    hasNumber,
    hasLowercase,
    hasUppercase,
    hasSpecial,
    isLong,
    notCommon,
    noPersonalInfo,
    meetsPolicy,
    entropyBits: bits,
    score,
    label: STRENGTH_LEVELS[score].label,
    color: STRENGTH_LEVELS[score].color,
    crackTime: formatCrackTime(seconds),
    suggestions: suggestions.slice(0, 3),
  };
}

// ----------------------------------------------------------------------------
// Password generator
// ----------------------------------------------------------------------------
const SETS = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  digits: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.?',
};
const AMBIGUOUS = /[O0oIl1|]/g;

/** Unbiased random integer in [0, max) using crypto.getRandomValues (rejection sampling). */
function secureRandomInt(max) {
  const cryptoObj = globalThis.crypto;
  if (!cryptoObj || !cryptoObj.getRandomValues) throw new Error('Secure random number generator unavailable');
  const limit = Math.floor(0x100000000 / max) * max;
  const buf = new Uint32Array(1);
  do {
    cryptoObj.getRandomValues(buf);
  } while (buf[0] >= limit);
  return buf[0] % max;
}

/**
 * Generates a random password. Guarantees at least one character from every enabled set.
 * @param {{length?: number, lowercase?: boolean, uppercase?: boolean, numbers?: boolean, symbols?: boolean, avoidAmbiguous?: boolean}} [options]
 */
export function generatePassword(options = {}) {
  const {
    length = 16,
    lowercase = true,
    uppercase = true,
    numbers = true,
    symbols = true,
    avoidAmbiguous = true,
  } = options;

  const clean = (s) => (avoidAmbiguous ? s.replace(AMBIGUOUS, '') : s);
  const enabled = [];
  if (lowercase) enabled.push(clean(SETS.lower));
  if (uppercase) enabled.push(clean(SETS.upper));
  if (numbers) enabled.push(clean(SETS.digits));
  if (symbols) enabled.push(clean(SETS.symbols));
  if (enabled.length === 0) enabled.push(clean(SETS.lower), clean(SETS.digits)); // never return empty

  const len = Math.min(Math.max(Math.floor(length), Math.max(POLICY.MIN_LENGTH, enabled.length)), POLICY.MAX_LENGTH);
  const all = enabled.join('');

  const chars = enabled.map((set) => set[secureRandomInt(set.length)]); // one from each set
  while (chars.length < len) chars.push(all[secureRandomInt(all.length)]);

  // Fisher-Yates shuffle so the guaranteed characters aren't always first
  for (let i = chars.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}

// ----------------------------------------------------------------------------
// Breach lookup helpers (Have I Been Pwned "Pwned Passwords" k-anonymity model)
// ----------------------------------------------------------------------------

/** Uppercase hex SHA-1 of a string. Works in browsers (secure context) and Node 19+. */
export async function sha1Hex(text) {
  const data = new TextEncoder().encode(text);
  const digest = await globalThis.crypto.subtle.digest('SHA-1', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}

/**
 * Searches a range response ("SUFFIX:COUNT" per line) for our hash suffix.
 * Padding lines (count 0) are ignored. Returns how many times it was seen in breaches.
 */
export function findInRangeResponse(responseText, suffix) {
  const target = suffix.toUpperCase();
  for (const line of String(responseText).split(/\r?\n/)) {
    const [candidate, countText] = line.trim().split(':');
    if (candidate && candidate.toUpperCase() === target) {
      const count = parseInt(countText, 10);
      return Number.isFinite(count) ? count : 0;
    }
  }
  return 0;
}
