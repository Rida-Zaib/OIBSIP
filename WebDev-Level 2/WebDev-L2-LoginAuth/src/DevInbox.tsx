/**
 * "Dev Inbox": a pretend mailbox that lives inside the app.
 * In development the server doesn't send real emails; it keeps them in memory and this page shows them,
 * so the 6-digit verification / reset codes can be read and copied without any email account.
 * (The server only exposes this when MAIL_MODE is "inbox", never in production.)
 */
import React, { useCallback, useEffect, useState } from 'react';
import { api, ApiError, type InboxMessage } from './lib/api';

function timeAgo(iso: string): string {
  const seconds = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 10) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  return `${Math.round(minutes / 60)} h ago`;
}

function MailCard({ mail, now }: { mail: InboxMessage; now: number }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const expired = now - new Date(mail.sentAt).getTime() > mail.ttlMinutes * 60 * 1000;
  const spaced = `${mail.code.slice(0, 3)} ${mail.code.slice(3)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(mail.code);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = mail.code;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <article className="rounded-2xl bg-[#FAF4E4] border-2 border-[#D9B86C]/70 text-[#031512] p-4 shadow-lg">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#1F6B5E]">
            {mail.purpose === 'verify' ? 'Email verification' : 'Password reset'}
          </div>
          <h3 className="font-serif-title text-base font-bold leading-tight">{mail.subject}</h3>
          <div className="text-[11px] text-[#315449] mt-0.5 break-all">
            To: <strong>{mail.to}</strong> · {timeAgo(mail.sentAt)}
          </div>
        </div>
        {expired && (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#B5483C]/15 border border-[#B5483C]/50 text-[#8E2F25]">
            Expired
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <div
          className={`px-5 py-2 rounded-xl bg-[#0B3D36] border border-[#D9B86C] font-mono text-2xl font-bold tracking-[0.25em] text-[#F3E2A9] ${
            expired ? 'opacity-50 line-through' : ''
          }`}
          aria-label={`Code ${mail.code.split('').join(' ')}`}
        >
          {spaced}
        </div>
        <button
          type="button"
          onClick={copy}
          className="px-4 py-1.5 rounded-full text-xs font-semibold border border-[#1F6B5E]/60 text-[#0B3D36] hover:bg-[#1F6B5E]/10 transition-all cursor-pointer"
        >
          {copied ? '✓ Copied' : 'Copy code'}
        </button>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="text-xs font-semibold text-[#0B3D36] underline underline-offset-4 decoration-[#D9B86C] cursor-pointer"
        >
          {open ? 'Hide full email' : 'Show full email'}
        </button>
      </div>

      {open && (
        <pre className="mt-3 p-3 rounded-xl bg-white/70 border border-[#1F6B5E]/20 text-[11.5px] leading-relaxed whitespace-pre-wrap font-sans text-[#315449]">
          {mail.text}
        </pre>
      )}
    </article>
  );
}

export default function DevInbox() {
  const [mails, setMails] = useState<InboxMessage[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  const load = useCallback(async () => {
    try {
      setMails(await api.devInbox());
      setError(null);
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 404
          ? 'The Dev Inbox is turned off. It only exists when the server runs in "inbox" mail mode (the default while developing).'
          : err instanceof ApiError
            ? err.message
            : 'Could not load the inbox.',
      );
    }
  }, []);

  useEffect(() => {
    load();
    const poll = setInterval(() => {
      load();
      setNow(Date.now());
    }, 3000);
    return () => clearInterval(poll);
  }, [load]);

  const clear = async () => {
    try {
      await api.clearDevInbox();
      setMails([]);
    } catch {
      /* ignore */
    }
  };

  return (
    <section className="relative z-10 w-full max-w-2xl mx-auto px-4 py-8" aria-label="Dev Inbox">
      <div className="dashboard-glass-panel p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
          <div>
            <div className="text-[11px] tracking-[0.25em] uppercase text-[#D9B86C] font-semibold">Pretend mailbox</div>
            <h1 className="font-serif-title text-2xl text-[#F3E2A9] font-bold">📬 Dev Inbox</h1>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={load}
              className="px-4 py-1.5 rounded-full text-xs font-semibold border border-[#D9B86C]/60 text-[#F3E2A9] hover:bg-[#D9B86C]/15 transition-all cursor-pointer"
            >
              ↻ Refresh
            </button>
            <button
              type="button"
              onClick={clear}
              disabled={!mails || mails.length === 0}
              className="px-4 py-1.5 rounded-full text-xs font-semibold border border-[#B5483C]/70 text-[#F2B8B0] hover:bg-[#B5483C]/20 disabled:opacity-40 transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              Clear all
            </button>
          </div>
        </div>
        <p className="text-xs text-[#A9C9B8] leading-relaxed">
          In development, AuraAuth doesn't send real emails. Every email it would send lands here instead. Copy the code
          and type it into the verification or reset screen. This page updates by itself.
        </p>
      </div>

      <div className="mt-4 space-y-3" aria-live="polite">
        {error && (
          <div role="alert" className="pill-error-alert">
            <span>{error}</span>
          </div>
        )}
        {!error && mails === null && <div className="text-sm text-[#A9C9B8] text-center py-8">Opening the mailbox...</div>}
        {!error && mails && mails.length === 0 && (
          <div className="text-center py-10 text-sm text-[#A9C9B8]">
            <div className="text-3xl mb-2">✉️</div>
            No emails yet. Register an account or use "Forgot password?" and the code will appear here.
          </div>
        )}
        {mails?.map((m) => <MailCard key={m.id} mail={m} now={now} />)}
      </div>

      <div className="text-center mt-5">
        <a
          href="#/login"
          onClick={(e) => {
            // The inbox opens in its own tab. Closing it leaves the other tab (with your half-finished
            // verification form) exactly as it was. If the browser won't let us close it, go back to
            // the screen the user came from instead of always landing on Sign In.
            e.preventDefault();
            let back = '#/login';
            try {
              back = localStorage.getItem('aura_return_hash') || '#/login';
            } catch {
              /* ignore */
            }
            window.close();
            setTimeout(() => {
              window.location.hash = back.startsWith('#/inbox') ? '#/login' : back;
            }, 150);
          }}
          className="text-xs font-semibold text-[#F3E2A9] underline underline-offset-4 decoration-[#D9B86C] hover:text-white"
        >
          ← Close inbox and go back
        </a>
      </div>
    </section>
  );
}
