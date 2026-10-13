/**
 * Checks that an e-mail domain can actually receive mail (it has MX records, or at least an A/AAAA
 * record, which mail servers fall back to). Catches made-up domains such as "rida@gmaill.xyz123".
 * Needs internet (DNS). If DNS is unreachable or slow it answers "unknown" and the address is
 * accepted, so a network hiccup never blocks a real person from registering.
 */
import dns from 'node:dns/promises';

export function createEmailDomainChecker({ resolver = dns, timeoutMs = 3000, cacheMs = 60 * 60 * 1000 } = {}) {
  const cache = new Map(); // domain -> { value, expires }

  const withTimeout = (promise) =>
    Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(Object.assign(new Error('DNS timeout'), { code: 'ETIMEOUT' })), timeoutMs).unref?.())]);

  const NOT_FOUND = new Set(['ENOTFOUND', 'ENODATA', 'NXDOMAIN']);

  /** @returns {Promise<boolean|null>} true = can receive mail, false = domain does not exist, null = could not tell */
  return async function check(domain) {
    const key = String(domain).toLowerCase();
    const hit = cache.get(key);
    if (hit && hit.expires > Date.now()) return hit.value;

    let value = null;
    try {
      const mx = await withTimeout(resolver.resolveMx(key));
      value = Array.isArray(mx) && mx.length > 0 ? true : null;
    } catch (err) {
      if (NOT_FOUND.has(err?.code)) {
        // no MX: a plain A/AAAA record still lets the domain receive mail
        try {
          const a = await withTimeout(resolver.resolve4(key));
          value = Array.isArray(a) && a.length > 0 ? true : false;
        } catch (err2) {
          value = NOT_FOUND.has(err2?.code) ? false : null;
        }
      } else {
        value = null; // timeout, no internet, server failure: unknown
      }
    }

    if (value !== null) cache.set(key, { value, expires: Date.now() + cacheMs });
    return value;
  };
}
