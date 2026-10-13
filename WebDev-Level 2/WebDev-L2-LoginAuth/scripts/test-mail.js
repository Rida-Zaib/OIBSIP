/**
 * Sends ONE test email using the SMTP settings in your .env, so you can check the Gmail setup
 * before trying the real register flow.
 *
 *   npm run test:mail -- someone@example.com
 *
 * (If you leave the address out, the mail is sent to SMTP_USER itself.)
 */
import 'dotenv/config';
import { loadConfig } from '../server/config.js';
import { createMailer } from '../server/mailer.js';

const config = loadConfig({ ...process.env, MAIL_MODE: 'smtp', NODE_ENV: process.env.NODE_ENV });

if (!config.smtp.user || !config.smtp.pass) {
  console.error('\n  SMTP_USER and SMTP_PASS are not set in your .env file.');
  console.error('  Copy .env.example to .env and fill them in (see README, "Real email with Gmail").\n');
  process.exit(1);
}

const to = process.argv[2] || config.smtp.user;
const mailer = createMailer({ mode: 'smtp', smtp: config.smtp });

console.log(`\n  Connecting to ${config.smtp.host}:${config.smtp.port} as ${config.smtp.user} ...`);
const check = await mailer.verifyConnection();
if (!check.ok) {
  console.error(`  LOGIN FAILED: ${check.error}\n`);
  if (/Invalid login|535|Username and Password not accepted|BadCredentials/i.test(check.error)) {
    console.error('  -> Use a Google "App Password" (16 letters), NOT your normal Gmail password.');
    console.error('  -> App Passwords need 2-Step Verification turned on: https://myaccount.google.com/apppasswords\n');
  } else if (/ENOTFOUND|ETIMEDOUT|ECONNREFUSED|EAI_AGAIN/i.test(check.error)) {
    console.error('  -> Cannot reach the mail server: check your internet / firewall / SMTP_HOST / SMTP_PORT.\n');
  }
  process.exit(1);
}
console.log('  Login OK. Sending a test email to ' + to + ' ...');

const result = await mailer.sendCode({ to, username: 'tester', code: '123456', purpose: 'verify', ttlMinutes: 10 });
if (result.sent) {
  console.log('  Sent! Check that inbox (and the spam folder). It contains the dummy code 123456.\n');
} else {
  console.error('  Sending failed (see the message above).\n');
  process.exit(1);
}
