/**
 * The two e-mail based screens that live inside the ornate card:
 *   - VerifyEmailForm    : enter the 6-digit code that was e-mailed after registering
 *   - ForgotPasswordForm : ask for a reset code, then choose a new password
 * They use the same styling classes as the sign-in / register forms in App.tsx.
 */
import React, { useEffect, useState } from 'react';
import { ICONS } from './artwork';
import { api, ApiError } from './lib/api';
import { evaluatePassword, generatePassword, STRENGTH_LEVELS } from '../shared/passwordPolicy.js';

const LABEL = 'block text-xs font-semibold uppercase tracking-wider text-[#0B3D36] mb-1.5';
const ERR = 'text-[11px] text-[#B5483C] font-medium mt-1 pl-3';
const RESEND_SECONDS = 60;

type Alert = { type: 'error' | 'success'; message: string } | null;

function AlertPill({ alert }: { alert: Alert }) {
  if (!alert) return null;
  return (
    <div
      role={alert.type === 'error' ? 'alert' : 'status'}
      className={`${alert.type === 'error' ? 'pill-error-alert' : 'pill-success-alert'} mb-4 relative z-10`}
    >
      <span dangerouslySetInnerHTML={{ __html: alert.type === 'error' ? ICONS.alert : ICONS.check }} />
      <span>{alert.message}</span>
    </div>
  );
}

/** Counts down from `start` seconds; restart() begins again. */
function useCountdown(start: number) {
  const [left, setLeft] = useState(start);
  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);
  return { left, restart: () => setLeft(RESEND_SECONDS) };
}

type MailMode = 'smtp' | 'console' | 'inbox' | 'demo' | null;

/** Demo mode: no email service is connected, so the code is shown here instead of being emailed. */
function DemoCodeBanner({ code, onUse }: { code: string | null; onUse: (code: string) => void }) {
  if (!code) return null;
  return (
    <div
      role="status"
      className="mb-4 p-3 rounded-2xl bg-[#FAF4E4] border-2 border-dashed border-[#D9B86C] text-center relative z-10"
    >
      <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8A6A1A]">Demo mode</div>
      <p className="text-[11px] text-[#315449] mt-0.5 leading-snug">
        No email service is connected on this site, so your code is shown here instead of being emailed:
      </p>
      <div className="font-mono text-2xl font-bold tracking-[0.35em] text-[#0B3D36] my-1.5 select-all">{code}</div>
      <button
        type="button"
        onClick={() => onUse(code)}
        className="px-4 py-1 rounded-full text-[11px] font-semibold bg-[#0B3D36] text-[#F3E2A9] border border-[#D9B86C]/70 hover:bg-[#1F6B5E] transition-all cursor-pointer"
      >
        Use this code
      </button>
    </div>
  );
}

function ConsoleHint({ mailMode }: { mailMode: MailMode }) {
  if (mailMode === 'inbox') {
    return (
      <div className="mb-4 p-2.5 rounded-xl bg-[#D9B86C]/20 border border-[#D9B86C]/60 text-[11px] text-[#5B4A12] leading-snug relative z-10">
        <strong>Developer mode:</strong> no real email is sent. Your code is waiting in the{' '}
        <a
          href="#/inbox"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            try {
              localStorage.setItem('aura_return_hash', window.location.hash || '#/login');
            } catch {
              /* ignore */
            }
          }}
          className="font-bold underline underline-offset-4 decoration-[#1F6B5E]"
        >
          📬 Dev Inbox (opens in a new tab)
        </a>
        .
      </div>
    );
  }
  if (mailMode !== 'console') return null;
  return (
    <div className="mb-4 p-2.5 rounded-xl bg-[#D9B86C]/20 border border-[#D9B86C]/60 text-[11px] text-[#5B4A12] leading-snug relative z-10">
      <strong>Developer mode:</strong> the code is printed in the terminal where
      the server (<code>npm run dev:all</code>) is running.
    </div>
  );
}

function CodeField({ value, onChange, error, id }: { value: string; onChange: (v: string) => void; error?: string; id: string }) {
  return (
    <div className="input-group">
      <label htmlFor={id} className={LABEL}>
        6-digit code
      </label>
      <div className="relative flex items-center">
        <span className="absolute left-3.5 input-icon-svg pointer-events-none transition-all" dangerouslySetInnerHTML={{ __html: ICONS.mail }} />
        <input
          id={id}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          autoComplete="one-time-code"
          aria-invalid={Boolean(error)}
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="••••••"
          className={`pill-input font-mono text-lg tracking-[0.45em] ${error ? 'input-error' : ''}`}
        />
      </div>
      {error && <div className={ERR}>{error}</div>}
    </div>
  );
}

// ----------------------------------------------------------------------------
// Verify e-mail
// ----------------------------------------------------------------------------
export function VerifyEmailForm({
  identifier: initialIdentifier,
  notice,
  demoCode: initialDemoCode,
  mailMode,
  onVerified,
  onShake,
}: {
  identifier: string;
  notice: { text: string; error?: boolean } | null;
  demoCode?: string | null;
  mailMode: MailMode;
  onVerified: () => void;
  onShake: () => void;
}) {
  const [identifier, setIdentifier] = useState(initialIdentifier);
  const [code, setCode] = useState('');
  const [demoCode, setDemoCode] = useState<string | null>(initialDemoCode || null);
  const [errors, setErrors] = useState<{ identifier?: string; code?: string }>({});
  const [alert, setAlert] = useState<Alert>(notice ? { type: notice.error ? 'error' : 'success', message: notice.text } : null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const { left, restart } = useCountdown(RESEND_SECONDS);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    const next: typeof errors = {};
    if (!identifier.trim()) next.identifier = 'Enter your email or username';
    if (!/^\d{6}$/.test(code)) next.code = 'Enter the 6-digit code from the email';
    if (Object.keys(next).length) {
      setErrors(next);
      onShake();
      return;
    }
    setErrors({});
    setBusy(true);
    try {
      await api.verifyEmail(identifier.trim(), code);
      setDone(true);
      setAlert({ type: 'success', message: 'Email verified! Taking you to sign in...' });
      setTimeout(onVerified, 1300);
    } catch (err) {
      setBusy(false);
      onShake();
      setAlert({ type: 'error', message: err instanceof ApiError ? err.message : 'Something went wrong. Please try again.' });
    }
  };

  const resend = async () => {
    if (!identifier.trim()) {
      setErrors({ identifier: 'Enter your email or username first' });
      return;
    }
    setErrors({});
    try {
      const r = await api.resendVerification(identifier.trim());
      setAlert({ type: 'success', message: r.message });
      setDemoCode(r.demoCode || null);
      setCode('');
      restart();
    } catch (err) {
      setAlert({ type: 'error', message: err instanceof ApiError ? err.message : 'Could not request a new code.' });
    }
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-4 relative z-10">
      <ConsoleHint mailMode={mailMode} />
      <AlertPill alert={alert} />
      <DemoCodeBanner code={demoCode} onUse={setCode} />

      {!initialIdentifier && (
        <div className="input-group">
          <label htmlFor="verify-identifier" className={LABEL}>
            Email or username
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 input-icon-svg pointer-events-none transition-all" dangerouslySetInnerHTML={{ __html: ICONS.user }} />
            <input
              id="verify-identifier"
              type="text"
              autoComplete="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              aria-invalid={Boolean(errors.identifier)}
              className={`pill-input ${errors.identifier ? 'input-error' : ''}`}
              placeholder="you@domain.com"
            />
          </div>
          {errors.identifier && <div className={ERR}>{errors.identifier}</div>}
        </div>
      )}
      {initialIdentifier && (
        <p className="text-xs text-[#315449] text-center -mt-1">
          We sent a 6-digit code to the email for <strong className="text-[#0B3D36] break-all">{initialIdentifier}</strong>.
          It expires in 10 minutes.
        </p>
      )}

      <CodeField id="verify-code" value={code} onChange={setCode} error={errors.code} />

      <div className="pt-1">
        <button type="submit" disabled={busy || done} className="btn-primary-emerald">
          <span>{done ? 'Verified ✓' : busy ? 'Checking code...' : 'Verify Email'}</span>
        </button>
      </div>

      <div className="text-center text-xs text-[#315449]">
        Didn't get it? Check your spam folder or{' '}
        <button
          type="button"
          onClick={resend}
          disabled={left > 0 || done}
          className="font-bold text-[#0B3D36] underline underline-offset-4 decoration-[#D9B86C] disabled:opacity-50 disabled:no-underline cursor-pointer disabled:cursor-not-allowed"
        >
          {left > 0 ? `resend in ${left}s` : 'send a new code'}
        </button>
      </div>
    </form>
  );
}

// ----------------------------------------------------------------------------
// Forgot password (step 1: ask for a code, step 2: code + new password)
// ----------------------------------------------------------------------------
export function ForgotPasswordForm({
  mailMode,
  onReset,
  onShake,
}: {
  mailMode: MailMode;
  onReset: () => void;
  onShake: () => void;
}) {
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [identifier, setIdentifier] = useState('');
  const [code, setCode] = useState('');
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string; code?: string; password?: string }>({});
  const [alert, setAlert] = useState<Alert>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const { left, restart } = useCountdown(0);

  const ev = evaluatePassword(password, { username: identifier.includes('@') ? '' : identifier, email: identifier.includes('@') ? identifier : '' });

  const requestCode = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setAlert(null);
    if (!identifier.trim()) {
      setErrors({ identifier: 'Enter your email or username' });
      onShake();
      return;
    }
    setErrors({});
    setBusy(true);
    try {
      const r = await api.forgotPassword(identifier.trim());
      setStep('reset');
      setDemoCode(r.demoCode || null);
      setCode('');
      restart();
      setAlert({ type: 'success', message: r.message });
    } catch (err) {
      onShake();
      setAlert({ type: 'error', message: err instanceof ApiError ? err.message : 'Something went wrong. Please try again.' });
    } finally {
      setBusy(false);
    }
  };

  const submitReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    const next: typeof errors = {};
    if (!/^\d{6}$/.test(code)) next.code = 'Enter the 6-digit code from the email';
    if (!password) next.password = 'Choose a new password';
    else if (!ev.hasMinLength || !ev.hasNumber) next.password = 'Password must be at least 8 characters and include at least 1 number';
    if (Object.keys(next).length) {
      setErrors(next);
      onShake();
      return;
    }
    setErrors({});
    setBusy(true);
    try {
      await api.resetPassword(identifier.trim(), code, password);
      setDone(true);
      setAlert({ type: 'success', message: 'Password updated! Sign in with your new password.' });
      setTimeout(onReset, 1500);
    } catch (err) {
      setBusy(false);
      onShake();
      if (err instanceof ApiError && err.errors && (err.errors.newPassword || err.errors.password)) {
        setErrors({ password: err.errors.newPassword || err.errors.password });
      } else {
        setAlert({ type: 'error', message: err instanceof ApiError ? err.message : 'Something went wrong. Please try again.' });
      }
    }
  };

  if (step === 'request') {
    return (
      <form onSubmit={requestCode} noValidate className="space-y-4 relative z-10">
        <AlertPill alert={alert} />
        <div className="input-group">
          <label htmlFor="forgot-identifier" className={LABEL}>
            Email or username
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 input-icon-svg pointer-events-none transition-all" dangerouslySetInnerHTML={{ __html: ICONS.mail }} />
            <input
              id="forgot-identifier"
              type="text"
              autoComplete="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              aria-invalid={Boolean(errors.identifier)}
              className={`pill-input ${errors.identifier ? 'input-error' : ''}`}
              placeholder="you@domain.com"
            />
          </div>
          {errors.identifier && <div className={ERR}>{errors.identifier}</div>}
        </div>
        <ConsoleHint mailMode={mailMode} />
        <div className="pt-1">
          <button type="submit" disabled={busy} className="btn-primary-emerald">
            <span>{busy ? 'Sending...' : 'Send Reset Code'}</span>
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={submitReset} noValidate className="space-y-4 relative z-10">
      <ConsoleHint mailMode={mailMode} />
      <AlertPill alert={alert} />
      <DemoCodeBanner code={demoCode} onUse={setCode} />
      <p className="text-xs text-[#315449] text-center -mt-1">
        If an account matches <strong className="text-[#0B3D36] break-all">{identifier}</strong>, a code is on its way.
        Enter it below with your new password.
      </p>

      <CodeField id="reset-code" value={code} onChange={setCode} error={errors.code} />

      <div className="input-group">
        <label htmlFor="reset-password" className={LABEL}>
          New password
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-3.5 input-icon-svg pointer-events-none transition-all" dangerouslySetInnerHTML={{ __html: ICONS.lock }} />
          <input
            id="reset-password"
            type={show ? 'text' : 'password'}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={Boolean(errors.password)}
            placeholder="Choose a strong password"
            className={`pill-input pr-12 ${errors.password ? 'input-error' : ''}`}
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            aria-label={show ? 'Hide password' : 'Show password'}
            className="ornate-eye-toggle"
            dangerouslySetInnerHTML={{ __html: show ? ICONS.eyeOffOrnate : ICONS.eyeOrnate }}
          />
        </div>
        {errors.password && <div className={ERR}>{errors.password}</div>}

        <div className="mt-2.5 px-1" aria-live="polite">
          <div className="grid grid-cols-5 gap-1.5 h-2" role="meter" aria-label="Password strength" aria-valuemin={0} aria-valuemax={4} aria-valuenow={Math.max(ev.score, 0)}>
            {STRENGTH_LEVELS.map((lvl, i) => (
              <div
                key={lvl.label}
                className="h-full rounded-full transition-all duration-300"
                style={{
                  backgroundColor: i <= ev.score ? ev.color : 'rgba(31,107,94,0.12)',
                  boxShadow: i <= ev.score ? `0 0 8px ${ev.color}80` : 'none',
                }}
              />
            ))}
          </div>
          <div className="flex items-center justify-between text-[10.5px] text-[#315449] mt-1">
            <span>{ev.score < 0 ? 'Min 8 characters & 1 number' : `${ev.label} · cracked in ${ev.crackTime}`}</span>
            <button
              type="button"
              onClick={() => {
                setPassword(generatePassword({ length: 16 }));
                setShow(true);
              }}
              className="font-bold text-[#0B3D36] underline underline-offset-4 decoration-[#D9B86C] cursor-pointer"
            >
              ✦ Generate one
            </button>
          </div>
        </div>
      </div>

      <div className="pt-1">
        <button type="submit" disabled={busy || done} className="btn-primary-emerald">
          <span>{done ? 'Password updated ✓' : busy ? 'Updating...' : 'Set New Password'}</span>
        </button>
      </div>

      <div className="text-center text-xs text-[#315449]">
        No code yet?{' '}
        <button
          type="button"
          onClick={() => requestCode()}
          disabled={left > 0 || done || busy}
          className="font-bold text-[#0B3D36] underline underline-offset-4 decoration-[#D9B86C] disabled:opacity-50 disabled:no-underline cursor-pointer disabled:cursor-not-allowed"
        >
          {left > 0 ? `resend in ${left}s` : 'send a new code'}
        </button>
      </div>
    </form>
  );
}
