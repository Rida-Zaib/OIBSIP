/**
 * Strict e-mail address validation, shared by the browser and the server.
 *
 * What it CAN do: reject malformed addresses, impossible Gmail names, typos like "gmial.com",
 * disposable/throw-away services and made-up role names such as "admin@gmail.com".
 * What it can NOT do: prove that a mailbox exists or belongs to the person typing it. Only sending
 * a code to the address and having the user type it back proves that (needs a real mail sender).
 */

const LOCAL_RE = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+$/;
const LABEL_RE = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/;

const GMAIL_DOMAINS = new Set(['gmail.com', 'googlemail.com']);

/** Common mistyped domains -> the domain people meant. */
const TYPO_DOMAINS = {
  'gmial.com': 'gmail.com', 'gmal.com': 'gmail.com', 'gamil.com': 'gmail.com', 'gnail.com': 'gmail.com',
  'gmail.con': 'gmail.com', 'gmail.cm': 'gmail.com', 'gmail.co': 'gmail.com', 'gmail.om': 'gmail.com',
  'gmail.comm': 'gmail.com', 'gmail.vom': 'gmail.com', 'gmaill.com': 'gmail.com', 'gmaii.com': 'gmail.com',
  'gmil.com': 'gmail.com', 'gmeil.com': 'gmail.com', 'gogglemail.com': 'gmail.com', 'gmail.cim': 'gmail.com',
  'yaho.com': 'yahoo.com', 'yahooo.com': 'yahoo.com', 'yahoo.con': 'yahoo.com', 'yahoo.cm': 'yahoo.com',
  'hotmial.com': 'hotmail.com', 'hotmal.com': 'hotmail.com', 'hotmail.con': 'hotmail.com', 'hotnail.com': 'hotmail.com',
  'outlok.com': 'outlook.com', 'outlook.con': 'outlook.com', 'outloook.com': 'outlook.com',
  'icloud.con': 'icloud.com', 'iclod.com': 'icloud.com',
};

/** Throw-away mailbox services (a small, well-known list). */
const DISPOSABLE = new Set([
  'mailinator.com', 'guerrillamail.com', 'guerrillamail.net', 'sharklasers.com', '10minutemail.com',
  'tempmail.com', 'temp-mail.org', 'temp-mail.io', 'yopmail.com', 'trashmail.com', 'getnada.com',
  'dispostable.com', 'maildrop.cc', 'throwawaymail.com', 'fakeinbox.com', 'mailnesia.com', 'tempinbox.com',
  'mintemail.com', 'spamgourmet.com', 'moakt.com', 'emailondeck.com', 'mohmal.com', 'burnermail.io',
]);

/** Names nobody registers as a personal address; on a free provider they are almost always fake. */
const ROLE_NAMES = new Set([
  'admin', 'administrator', 'root', 'test', 'tester', 'testing', 'user', 'username', 'email', 'mail',
  'info', 'support', 'noreply', 'no-reply', 'postmaster', 'webmaster', 'hostmaster', 'abuse', 'null', 'none',
  'example', 'sample', 'demo', 'abc', 'abcd', 'xyz', 'asdf', 'qwerty',
]);
const FREE_PROVIDERS = new Set(['gmail.com', 'googlemail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'live.com', 'aol.com']);

/** The part after the last "@", lower-cased ('' if there is none). */
export function emailDomain(email) {
  const at = String(email).lastIndexOf('@');
  return at < 0 ? '' : String(email).slice(at + 1).trim().toLowerCase();
}

/**
 * @param {string} input
 * @returns {{ok: true, email: string} | {ok: false, message: string, suggestion?: string}}
 */
export function validateEmail(input) {
  const email = typeof input === 'string' ? input.trim() : '';
  if (!email) return { ok: false, message: 'Email address is required' };
  if (email.length > 254) return { ok: false, message: 'That email address is too long' };
  if (/\s/.test(email)) return { ok: false, message: 'An email address cannot contain spaces' };

  const parts = email.split('@');
  if (parts.length !== 2) return { ok: false, message: 'Please enter a valid email address, like name@gmail.com' };
  const [local, domainRaw] = parts;
  const domain = domainRaw.toLowerCase();

  if (!local || local.length > 64 || !LOCAL_RE.test(local) || local.startsWith('.') || local.endsWith('.') || local.includes('..')) {
    return { ok: false, message: 'The part before the @ is not a valid email name' };
  }

  const labels = domain.split('.');
  if (labels.length < 2 || !labels.every((l) => LABEL_RE.test(l))) {
    return { ok: false, message: 'The part after the @ is not a valid email domain' };
  }
  const tld = labels[labels.length - 1];
  if (!/^[a-z]{2,24}$/.test(tld)) return { ok: false, message: 'The email ending (like .com) is not valid' };

  // Addresses are written in lowercase: mail providers treat "Rida@Gmail.com" and "rida@gmail.com" as the
  // same mailbox, so allowing capitals only creates look-alike duplicates and typos.
  if (email !== email.toLowerCase()) {
    const lower = email.toLowerCase();
    return { ok: false, message: `Email addresses are written in lowercase letters. Did you mean ${lower}?`, suggestion: lower };
  }

  // typos of well-known providers
  if (TYPO_DOMAINS[domain]) {
    const suggestion = `${local}@${TYPO_DOMAINS[domain]}`;
    return { ok: false, message: `Did you mean ${suggestion}? "${domain}" looks like a typo.`, suggestion };
  }

  if (DISPOSABLE.has(domain)) {
    return { ok: false, message: 'Temporary / disposable email addresses are not allowed. Please use your real email.' };
  }

  // Gmail's own username rules: 6-30 letters, digits or dots; no leading, trailing or double dots
  if (GMAIL_DOMAINS.has(domain)) {
    const name = local.split('+')[0]; // "name+anything@gmail.com" is the same mailbox as "name@gmail.com"
    if (!/^[A-Za-z0-9.]+$/.test(name)) {
      return { ok: false, message: 'Gmail addresses can only contain letters, numbers and dots before the @' };
    }
    if (!/^[A-Za-z0-9]/.test(name)) return { ok: false, message: 'A Gmail address must start with a letter or number' };
    const bare = name.replace(/\./g, '');
    if (bare.length < 6 || bare.length > 30) {
      return { ok: false, message: 'Gmail usernames are 6 to 30 characters long, so this address cannot exist' };
    }
  }

  if (FREE_PROVIDERS.has(domain) && ROLE_NAMES.has(local.toLowerCase().split('+')[0])) {
    return { ok: false, message: 'Please enter your own personal email address, not a generic one like admin@ or test@' };
  }

  return { ok: true, email };
}
