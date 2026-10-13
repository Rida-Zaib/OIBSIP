/**
 * Browser-side breached-password check (Have I Been Pwned, k-anonymity).
 *
 * The password is hashed (SHA-1) IN THE BROWSER and only the first 5 hex characters of the hash
 * are sent to our backend, which forwards them to the breach database. The list of matching
 * hash suffixes comes back and we search it here. The password never leaves the page.
 * (The server repeats the same check when you submit the form, so this live check is purely UX.)
 */
import { sha1Hex, findInRangeResponse } from '../../shared/passwordPolicy.js';
import { isCommonPassword } from '../../shared/commonPasswords.js';

export interface BreachResult {
  status: 'safe' | 'breached' | 'unknown';
  /** how many times the password appeared in breaches (0 when unknown / built-in list hit) */
  count: number;
}

export async function checkPasswordBreach(password: string, signal?: AbortSignal): Promise<BreachResult> {
  if (isCommonPassword(password)) return { status: 'breached', count: 0 };

  try {
    const hash = await sha1Hex(password);
    const res = await fetch(`/api/breach/range/${hash.slice(0, 5)}`, { signal, credentials: 'same-origin' });
    const isText = (res.headers.get('content-type') || '').includes('text/plain');
    if (!res.ok || !isText) return { status: 'unknown', count: 0 };

    const count = findInRangeResponse(await res.text(), hash.slice(5));
    return count > 0 ? { status: 'breached', count } : { status: 'safe', count: 0 };
  } catch (err) {
    if ((err as Error)?.name === 'AbortError') throw err;
    return { status: 'unknown', count: 0 };
  }
}
