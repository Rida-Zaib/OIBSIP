/**
 * Sends the 6-digit codes.
 *
 *   console mode (default, zero setup): prints the code in the SERVER terminal. Perfect for local
 *                                       development and for demoing without internet.
 *   smtp mode: sends a real email with nodemailer (e.g. Gmail + an App Password).
 *
 * sendCode() never throws: it returns { sent: boolean } so a mail problem can't crash a request
 * or reveal anything to the caller. Codes are never written to logs in smtp mode.
 */
import { buildCodeEmail } from './mailTemplates.js';

export function createMailer({ mode = 'console', smtp = {}, log = console, importer = () => import('nodemailer'), inboxLimit = 50 } = {}) {
  let transportPromise = null;
  let effectiveMode = mode;

  // "inbox" mode: nothing leaves this computer. Messages are kept in memory and shown on the
  // app's own "Dev Inbox" page, like a pretend mailbox. Handy for development and demos.
  const inbox = [];
  let nextId = 1;

  async function getTransport() {
    if (!transportPromise) {
      transportPromise = importer()
        .then((mod) => {
          const nodemailer = mod.default || mod;
          return nodemailer.createTransport({
            host: smtp.host,
            port: smtp.port,
            secure: Number(smtp.port) === 465,
            auth: { user: smtp.user, pass: smtp.pass },
          });
        })
        .catch((err) => {
          transportPromise = null;
          throw err;
        });
    }
    return transportPromise;
  }

  async function sendCode({ to, username, code, purpose, ttlMinutes }) {
    const message = buildCodeEmail({ purpose, username, code, ttlMinutes });

    if (effectiveMode === 'inbox') {
      inbox.unshift({
        id: nextId++,
        to,
        subject: message.subject,
        text: message.text,
        purpose,
        code,
        ttlMinutes,
        sentAt: new Date().toISOString(),
      });
      if (inbox.length > inboxLimit) inbox.length = inboxLimit;
      log.log(`  [Dev Inbox] New "${purpose}" email for ${to}. Open the app's "Dev Inbox" page to read it.`);
      return { sent: true, mode: 'inbox' };
    }

    if (effectiveMode === 'console') {
      log.log(
        [
          '',
          '  ┌─ AuraAuth (console mail mode) ───────────────────────────',
          `  │ To      : ${to}`,
          `  │ Subject : ${message.subject}`,
          `  │ CODE    : ${code}      (valid ${ttlMinutes} min)`,
          '  └──────────────────────────────────────────────────────────',
          '',
        ].join('\n'),
      );
      return { sent: true, mode: 'console' };
    }

    try {
      const transport = await getTransport();
      await transport.sendMail({ from: smtp.from, to, subject: message.subject, text: message.text, html: message.html });
      return { sent: true, mode: 'smtp' };
    } catch (err) {
      // Log the reason (never the code, never the password)
      log.error(`[mail] Could not send ${purpose} email to ${to}: ${err.message}`);
      return { sent: false, mode: 'smtp' };
    }
  }

  /** Checks the SMTP login at startup so a wrong App Password is noticed immediately. */
  async function verifyConnection() {
    if (effectiveMode !== 'smtp') return { ok: true, mode: effectiveMode };
    try {
      const transport = await getTransport();
      await transport.verify();
      return { ok: true, mode: 'smtp' };
    } catch (err) {
      return { ok: false, mode: 'smtp', error: err.message };
    }
  }

  return {
    sendCode,
    verifyConnection,
    /** Messages "sent" in inbox mode, newest first. */
    listInbox: () => inbox.map((m) => ({ ...m })),
    clearInbox: () => void (inbox.length = 0),
    get mode() {
      return effectiveMode;
    },
  };
}

/** Hides most of an address for display: ridazaibb04@gmail.com -> ri*********@gmail.com */
export function maskEmail(email) {
  const [local = '', domain = ''] = String(email).split('@');
  const keep = Math.min(2, Math.max(1, Math.floor(local.length / 3)));
  return `${local.slice(0, keep)}${'*'.repeat(Math.max(3, local.length - keep))}@${domain}`;
}
