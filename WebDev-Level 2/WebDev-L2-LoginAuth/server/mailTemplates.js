/**
 * Email content for the two kinds of codes. Plain text + a small HTML version in the app's
 * emerald & gold colours. Everything user-supplied is HTML-escaped.
 */
export const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const COPY = {
  verify: {
    subject: 'Your AuraAuth verification code',
    heading: 'Verify your email',
    intro: 'Welcome to AuraAuth! Enter this code to confirm your email address and activate your account.',
    ignore: "If you didn't create an AuraAuth account, you can safely ignore this email.",
  },
  reset: {
    subject: 'Your AuraAuth password reset code',
    heading: 'Reset your password',
    intro: 'We received a request to reset your AuraAuth password. Enter this code to choose a new one.',
    ignore: "If you didn't ask for this, ignore this email: your password has not been changed. Never share this code with anyone.",
  },
};

export function buildCodeEmail({ purpose, username, code, ttlMinutes }) {
  const c = COPY[purpose];
  if (!c) throw new Error(`Unknown email purpose: ${purpose}`);
  const spaced = `${code.slice(0, 3)} ${code.slice(3)}`;

  const text = [
    `Hi ${username},`,
    '',
    c.intro,
    '',
    `Your code: ${code}`,
    `It expires in ${ttlMinutes} minutes.`,
    '',
    c.ignore,
    '',
    '- AuraAuth',
  ].join('\n');

  const html = `<!doctype html>
<html><body style="margin:0;padding:24px;background:#04201C;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
    <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;background:#FAF4E4;border:2px solid #D9B86C;border-radius:18px;">
      <tr><td style="padding:28px 32px;text-align:center;color:#031512;">
        <div style="font-size:12px;letter-spacing:3px;color:#1F6B5E;font-weight:bold;">AURAAUTH</div>
        <h1 style="margin:8px 0 14px;font-family:Georgia,serif;font-size:24px;color:#031512;">${escapeHtml(c.heading)}</h1>
        <p style="margin:0 0 6px;font-size:14px;line-height:1.5;color:#315449;">Hi ${escapeHtml(username)},</p>
        <p style="margin:0 0 20px;font-size:14px;line-height:1.5;color:#315449;">${escapeHtml(c.intro)}</p>
        <div style="display:inline-block;padding:14px 28px;background:#0B3D36;border:1px solid #D9B86C;border-radius:14px;font-family:'Courier New',monospace;font-size:32px;letter-spacing:6px;color:#F3E2A9;font-weight:bold;">${escapeHtml(spaced)}</div>
        <p style="margin:18px 0 0;font-size:13px;color:#315449;">This code expires in <strong>${ttlMinutes} minutes</strong>.</p>
        <p style="margin:18px 0 0;font-size:12px;line-height:1.5;color:#6C8E84;">${escapeHtml(c.ignore)}</p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;

  return { subject: c.subject, text, html };
}
