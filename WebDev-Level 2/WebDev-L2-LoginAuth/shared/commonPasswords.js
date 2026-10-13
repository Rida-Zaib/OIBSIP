/**
 * A small built-in blocklist of the most frequently used passwords.
 *
 * It is the OFFLINE safety net: it works instantly in the browser and keeps
 * working on the server even if the online breach database (Have I Been Pwned)
 * cannot be reached. The online check covers the hundreds of millions of other
 * leaked passwords.
 *
 * Everything here is lowercase; callers compare against the lowercased password.
 */
export const COMMON_PASSWORDS = new Set([
  '123456', '123456789', '12345678', '1234567', '12345', '1234567890', '123123', '111111', '000000',
  '654321', '666666', '121212', '112233', '123321', '987654321', '987654', '7777777', '555555',
  'password', 'password1', 'password12', 'password123', 'password1234', 'passw0rd', 'p@ssw0rd', 'p@ssword',
  'pa55word', 'pass1234', 'pass123', 'passpass', 'admin', 'admin123', 'admin1234', 'administrator',
  'root', 'toor', 'letmein', 'letmein1', 'welcome', 'welcome1', 'welcome123', 'login', 'login123',
  'qwerty', 'qwerty1', 'qwerty123', 'qwertyuiop', 'qwerty12345', 'qazwsx', 'qazwsxedc', '1qaz2wsx',
  '1q2w3e4r', '1q2w3e4r5t', '1q2w3e', 'asdfgh', 'asdfghjkl', 'zxcvbnm', 'zaq12wsx', 'azerty', 'azerty123',
  'abc123', 'abc12345', 'abcd1234', 'abcdef', 'abcdefg', 'abcdefgh', 'abcd123', 'a1b2c3d4', 'aa123456',
  'iloveyou', 'iloveyou1', 'iloveu', 'princess', 'sunshine', 'monkey', 'dragon', 'football', 'baseball',
  'superman', 'batman', 'master', 'shadow', 'michael', 'jennifer', 'jordan', 'hunter', 'ranger', 'buster',
  'trustno1', 'starwars', 'whatever', 'freedom', 'secret', 'secret123', 'mustang', 'access', 'flower',
  'hello', 'hello123', 'hottie', 'lovely', 'charlie', 'donald', 'cheese', 'computer', 'internet', 'killer',
  'liverpool', 'chocolate', 'summer', 'winter', 'spring', 'autumn', 'soccer', 'hockey', 'ginger', 'cookie',
  'default', 'guest', 'test', 'test123', 'test1234', 'testing', 'testing123', 'user', 'user123', 'demo',
  'changeme', 'change_me', 'temp123', 'temp1234', 'letmein123', 'google', 'google123', 'facebook',
  'pakistan', 'pakistan123', 'allahuakbar', 'bismillah', 'muhammad', 'ali12345', 'khan123',
  'university', 'student', 'student123', 'gujrat', 'gujrat123', 'rida123', 'ridazaib',
  'aaaaaa', 'aaaaaaaa', 'aaa111', 'zzzzzz', 'qqqqqq', 'q1w2e3r4', 'q1w2e3r4t5', 'qwe123', 'qweasd',
  'qweasdzxc', 'asd123', 'asdasd', 'asdf1234', 'zxc123', 'zxcvbn', 'zxcvbnm123', 'mynoob', 'nothing',
  'iloveyou123', 'princess1', 'sunshine1', 'monkey123', 'dragon123', 'football1', 'baseball1',
  'superman1', 'batman123', 'shadow123', 'master123', 'michael1', 'jordan23', 'lovely123', 'angel123',
  'angel', 'angels', 'blessed', 'forever', 'friends', 'family', 'mother', 'father', 'brother', 'sister',
  'password!', 'password@123', 'password#1', 'welcome@123', 'admin@123', 'admin@1234', 'qwerty@123',
  'india123', 'india@123', 'pass@123', 'pass@1234', 'abc@123', 'abcd@1234', 'test@123', 'user@123',
]);

/**
 * Returns true if the password (compared case-insensitively) is on the list,
 * or is a list entry with only a few trailing digits/symbols added
 * (e.g. "Password99!" is just "password" in a costume).
 */
export function isCommonPassword(password) {
  if (typeof password !== 'string' || password.length === 0) return false;
  const lower = password.toLowerCase();
  if (COMMON_PASSWORDS.has(lower)) return true;

  const stripped = lower.replace(/[0-9!@#$%^&*._-]{1,4}$/, '');
  if (stripped.length >= 4 && stripped !== lower && COMMON_PASSWORDS.has(stripped)) return true;

  // Simple "leetspeak" reversal: p@ssw0rd -> password
  const deLeet = lower
    .replace(/@/g, 'a')
    .replace(/0/g, 'o')
    .replace(/1/g, 'i')
    .replace(/\$/g, 's')
    .replace(/3/g, 'e')
    .replace(/5/g, 's')
    .replace(/7/g, 't');
  if (deLeet !== lower && deLeet.length >= 6 && COMMON_PASSWORDS.has(deLeet)) return true;

  return false;
}
