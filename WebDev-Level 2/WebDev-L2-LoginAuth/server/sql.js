/**
 * Prepared-statement helper for node:sqlite.
 *
 * Statements are prepared lazily and, if Node ever reports that one has been finalized
 * (ERR_INVALID_STATE: "statement has been finalized"), it is simply prepared again and the call
 * is retried once. That keeps the server working instead of answering every request with
 * "Something went wrong". (If the whole database was closed, preparing fails with a clear error.)
 */
export function prepared(db, sql) {
  let stmt = null;

  const call = (method, args) => {
    try {
      stmt ??= db.prepare(sql);
      return stmt[method](...args);
    } catch (err) {
      if (err?.code !== 'ERR_INVALID_STATE' || !/finalized/i.test(String(err.message))) throw err;
      stmt = db.prepare(sql); // recover: prepare a fresh statement and retry once
      return stmt[method](...args);
    }
  };

  return {
    get: (...args) => call('get', args),
    all: (...args) => call('all', args),
    run: (...args) => call('run', args),
  };
}
