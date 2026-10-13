/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * AuraAuth - Enchanted Celestial Authentication App Component
 * 
 * Tracks mouse movement to dynamically update the CSS variables
 * --parallax-x and --parallax-y on document.documentElement, creating
 * a multi-layer 3D depth effect for the background stars, paper-cut silhouettes,
 * and glossy champagne-gold ribbons.
 */

import React, { useEffect, useState, useRef } from 'react';
import './index.css';
import {
  ICONS,
  renderLargeArchWindow,
  renderLushBotanicals,
  renderCelestialEmblem,
  renderFairyLights,
  renderCornerJewels,
  renderBottomPendant,
} from './artwork';
import {
  renderRainyForestBackground,
  initRainyGlassEffect,
} from './background';
import { api, ApiError, type ApiUser } from './lib/api';
import { checkPasswordBreach } from './lib/breach';
import { VerifyEmailForm, ForgotPasswordForm } from './EmailFlows';
import DevInbox from './DevInbox';
import { evaluatePassword, generatePassword, STRENGTH_LEVELS } from '../shared/passwordPolicy.js';
import { validateEmail } from '../shared/emailPolicy.js';

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------
interface AuthSession {
  userId: string;
  username: string;
  email: string;
  loginTime: string;
  memberSince: string;
  activeSessions?: number;
  emailVerified?: boolean;
}

/** Converts the API's user object into the shape the dashboard UI uses. */
function toSession(user: ApiUser): AuthSession {
  return {
    userId: user.id,
    username: user.username,
    email: user.email,
    loginTime: user.loginTime,
    memberSince: user.memberSince,
    activeSessions: user.activeSessions,
    emailVerified: user.emailVerified,
  };
}

const PENDING_KEY = 'aura_pending_identifier';
const loadPending = (): string => {
  try {
    return sessionStorage.getItem(PENDING_KEY) || '';
  } catch {
    return '';
  }
};
const savePending = (value: string) => {
  try {
    sessionStorage.setItem(PENDING_KEY, value);
  } catch {
    /* private mode: fine, the user can type it again */
  }
};

// (the 'inbox' route has its own full page and never uses the card headings)
/** Remember which screen the user was on, so the Dev Inbox tab can send them back to it. */
const RETURN_KEY = 'aura_return_hash';
const rememberReturnHash = () => {
  try {
    localStorage.setItem(RETURN_KEY, window.location.hash || '#/login');
  } catch {
    /* ignore */
  }
};

const HEADINGS = {
  login: { eyebrow: 'Celestial Portal', title: 'Welcome Back', sub: 'Enter your credentials to enter the sanctuary' },
  register: { eyebrow: 'Celestial Registry', title: 'Create Account', sub: 'Begin your journey with a cryptographically secured identity' },
  verify: { eyebrow: 'Celestial Seal', title: 'Verify Your Email', sub: 'Enter the 6-digit code we sent to your inbox' },
  forgot: { eyebrow: 'Lost Key', title: 'Reset Password', sub: 'We will email you a code to choose a new password' },
} as const;

const USERNAME_REGEX = /^[A-Za-z0-9_.-]{3,30}$/;

/** Darker text colours for the strength pill so it stays readable on the cream card. */
const STRENGTH_TEXT_COLORS = ['#8E2F25', '#9A4E1F', '#7A5C0E', '#2F7A5F', '#0C4E42'];

interface GeneratorOptions {
  length: number;
  lowercase: boolean;
  uppercase: boolean;
  numbers: boolean;
  symbols: boolean;
  avoidAmbiguous: boolean;
}

// ----------------------------------------------------------------------------
// Main App Component
// ----------------------------------------------------------------------------
export default function App() {
  const [route, setRoute] = useState<'login' | 'register' | 'verify' | 'forgot' | 'inbox' | 'dashboard'>('login');
  const [session, setSession] = useState<AuthSession | null>(null);
  // The session lives on the server (httpOnly cookie). This ref mirrors what /api/me last told us,
  // so the synchronous route guard below can use it. authReady = first /api/me check finished.
  const sessionRef = useRef<AuthSession | null>(null);
  const [authReady, setAuthReady] = useState(false);

  // Email verification: who we are verifying, an optional notice, and how mail is delivered
  const [pendingIdentifier, setPendingIdentifier] = useState<string>(loadPending);
  const [verifyNotice, setVerifyNotice] = useState<{ text: string; error?: boolean } | null>(null);
  const [mailMode, setMailMode] = useState<'smtp' | 'console' | 'inbox' | 'demo' | null>(null);
  const [pendingDemoCode, setPendingDemoCode] = useState<string | null>(null); // demo mode only
  const [canEmail, setCanEmail] = useState(true); // false on a public site with no real email service

  // Parallax coordinates state (also synced directly to CSS variables)
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  // Modal & form states
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [formAlert, setFormAlert] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  // Register form fields
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regErrors, setRegErrors] = useState<{ username?: string; email?: string; password?: string }>({});
  const [isRegistering, setIsRegistering] = useState(false);
  const [emailSuggestion, setEmailSuggestion] = useState<string | null>(null); // "Did you mean ...?" fix for the email field

  // Breach check + password generator state
  const [breach, setBreach] = useState<{
    status: 'idle' | 'checking' | 'safe' | 'breached' | 'unknown';
    count: number;
  }>({ status: 'idle', count: 0 });
  const [showGenerator, setShowGenerator] = useState(false);
  const [genOptions, setGenOptions] = useState<GeneratorOptions>({
    length: 16,
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true,
    avoidAmbiguous: true,
  });
  const [copied, setCopied] = useState(false);

  // Dashboard: change password + logout everywhere
  const [showChangePw, setShowChangePw] = useState(false);
  const [cpCurrent, setCpCurrent] = useState('');
  const [cpNew, setCpNew] = useState('');
  const [cpShow, setCpShow] = useState(false);
  const [cpErrors, setCpErrors] = useState<{ currentPassword?: string; newPassword?: string }>({});
  const [cpAlert, setCpAlert] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const [cpBusy, setCpBusy] = useState(false);

  // Login form fields
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginErrors, setLoginErrors] = useState<{ identifier?: string; password?: string }>({});
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // --------------------------------------------------------------------------
  // MOUSE MOVEMENT TRACKING & PARALLAX CSS VARIABLE UPDATES
  // --------------------------------------------------------------------------
  const updateParallaxVariables = (clientX: number, clientY: number) => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.style.setProperty('--parallax-x', '0px');
      document.documentElement.style.setProperty('--parallax-y', '0px');
      return;
    }

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Calculate normalized offset from viewport center
    const deltaX = (clientX - centerX) / 22;
    const deltaY = (clientY - centerY) / 22;

    // Update CSS variables --parallax-x and --parallax-y on document.documentElement
    document.documentElement.style.setProperty('--parallax-x', `${deltaX.toFixed(2)}px`);
    document.documentElement.style.setProperty('--parallax-y', `${deltaY.toFixed(2)}px`);

    setParallax({ x: deltaX, y: deltaY });
  };

  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      updateParallaxVariables(e.clientX, e.clientY);
    };

    const handleMouseLeave = () => {
      document.documentElement.style.setProperty('--parallax-x', '0px');
      document.documentElement.style.setProperty('--parallax-y', '0px');
      setParallax({ x: 0, y: 0 });
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Initialize rainy misty forest with water droplets on frosted glass
    const cleanupRain = initRainyGlassEffect();

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cleanupRain();
    };
  }, []);

  const handleContainerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    updateParallaxVariables(e.clientX, e.clientY);
  };

  // --------------------------------------------------------------------------
  // HASH-BASED ROUTING & PROTECTED ROUTE CHECK
  // --------------------------------------------------------------------------
  const syncRouteFromHash = () => {
    const currentSession = sessionRef.current;
    setSession(currentSession);

    const hash = window.location.hash.toLowerCase();

    if (hash.startsWith('#/inbox')) {
      setRoute('inbox'); // the pretend mailbox is reachable signed in or out
    } else if (hash.startsWith('#/register')) {
      if (currentSession) {
        window.location.hash = '#/dashboard';
        setRoute('dashboard');
      } else {
        setRoute('register');
      }
    } else if (hash.startsWith('#/verify') || hash.startsWith('#/forgot')) {
      if (currentSession) {
        window.location.hash = '#/dashboard';
        setRoute('dashboard');
      } else {
        setRoute(hash.startsWith('#/verify') ? 'verify' : 'forgot');
      }
    } else if (hash.startsWith('#/dashboard')) {
      if (!currentSession) {
        window.location.hash = '#/login';
        setRoute('login');
      } else {
        setRoute('dashboard');
      }
    } else {
      if (currentSession) {
        window.location.hash = '#/dashboard';
        setRoute('dashboard');
      } else {
        if (!hash || hash === '#' || hash === '#/') {
          window.location.hash = '#/login';
        }
        setRoute('login');
      }
    }
  };

  useEffect(() => {
    let cancelled = false;

    // Ask the server who is logged in BEFORE deciding which page to show (protected-route check).
    api
      .me()
      .then((user) => {
        sessionRef.current = toSession(user);
      })
      .catch(() => {
        sessionRef.current = null;
      })
      .finally(() => {
        if (cancelled) return;
        setAuthReady(true);
        syncRouteFromHash();
        window.addEventListener('hashchange', syncRouteFromHash);
      });

    // If the session expired while the tab was in the background, notice when the user returns.
    const recheck = () => {
      if (document.visibilityState !== 'visible' || !sessionRef.current) return;
      api.me().catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          sessionRef.current = null;
          setSession(null);
          window.location.hash = '#/login';
          syncRouteFromHash();
        }
      });
    };
    document.addEventListener('visibilitychange', recheck);

    return () => {
      cancelled = true;
      window.removeEventListener('hashchange', syncRouteFromHash);
      document.removeEventListener('visibilitychange', recheck);
    };
  }, []);

  // --------------------------------------------------------------------------
  // LIVE BREACH CHECK (debounced). Only a 5-character hash prefix leaves the browser.
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (route !== 'register') return;
    if (regPassword.length < 8) {
      setBreach({ status: 'idle', count: 0 });
      return;
    }
    setBreach({ status: 'checking', count: 0 });
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const result = await checkPasswordBreach(regPassword, controller.signal);
        if (!controller.signal.aborted) setBreach(result);
      } catch {
        /* aborted because the password changed again */
      }
    }, 500);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [regPassword, route]);

  useEffect(() => {
    const titleMap = {
      login: 'Sign In | AuraAuth',
      register: 'Create Account | AuraAuth',
      verify: 'Verify Email | AuraAuth',
      inbox: 'Dev Inbox | AuraAuth',
      forgot: 'Reset Password | AuraAuth',
      dashboard: 'Sanctuary Dashboard | AuraAuth',
    };
    document.title = titleMap[route] || 'AuraAuth - Secure Authentication';
  }, [route]);

  // Clear any message left over from the previous screen, and learn how mail is delivered
  useEffect(() => {
    setFormAlert(null);
  }, [route]);

  useEffect(() => {
    api
      .config()
      .then((c) => {
        setMailMode(c.mailMode);
        setCanEmail(c.canEmail !== false);
      })
      .catch(() => {});
  }, []);

  const triggerCardShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 550);
  };

  // --------------------------------------------------------------------------
  // FORM HANDLERS
  // --------------------------------------------------------------------------
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormAlert(null);
    const errors: { username?: string; email?: string; password?: string } = {};

    const username = regUsername.trim();
    const email = regEmail.trim();
    const password = regPassword;

    if (!username) {
      errors.username = 'Username is required';
    } else if (!USERNAME_REGEX.test(username)) {
      errors.username = 'Username must be 3-30 characters: letters, numbers, dot, dash or underscore';
    }

    const emailCheck = validateEmail(email); // same strict rules as the server
    if (!emailCheck.ok) {
      errors.email = emailCheck.message;
    }
    setEmailSuggestion(!emailCheck.ok && emailCheck.suggestion ? emailCheck.suggestion : null);

    const check = evaluatePassword(password, { username, email });
    if (!password) {
      errors.password = 'Password is required';
    } else if (!check.hasMinLength || !check.hasNumber) {
      errors.password = 'Password must be at least 8 characters and include at least 1 number';
    } else if (!check.notCommon || breach.status === 'breached') {
      errors.password =
        breach.count > 0
          ? `This password has appeared ${breach.count.toLocaleString()} times in known data breaches. Please choose a different one.`
          : 'This password is far too common or has been exposed in a data breach. Please choose a different one.';
    }

    if (Object.keys(errors).length > 0) {
      setRegErrors(errors);
      triggerCardShake();
      return;
    }
    setRegErrors({});
    setIsRegistering(true);

    try {
      // The server hashes with bcrypt, re-checks the breach database, and rejects duplicates.
      const result = await api.register(username, email, password);

      setIsRegistering(false);
      setRegUsername('');
      setRegEmail('');
      setRegPassword('');
      setShowGenerator(false);

      if (result.verificationRequired) {
        // Next step: type the 6-digit code that was just e-mailed
        savePending(email);
        setPendingIdentifier(email);
        setPendingDemoCode(result.demoCode || null);
        setVerifyNotice(
          result.demoCode
            ? { text: 'Account created! Your verification code is shown below.' }
            : result.emailSent
            ? { text: `Account created! We emailed a code to ${result.maskedEmail}.` }
            : { text: 'Account created, but the email could not be sent. Press "send a new code" in a minute.', error: true },
        );
        window.location.hash = '#/verify';
        return;
      }

      setFormAlert({
        type: 'success',
        message: 'Account created successfully! Redirecting to login portal...',
      });
      setTimeout(() => {
        window.location.hash = '#/login';
      }, 1500);
    } catch (err) {
      setIsRegistering(false);
      triggerCardShake();
      if (err instanceof ApiError && err.errors && Object.keys(err.errors).length > 0) {
        setRegErrors(err.errors);
        if (err.code === 'PASSWORD_BREACHED') setBreach({ status: 'breached', count: breach.count });
      } else {
        setFormAlert({
          type: 'error',
          message: err instanceof ApiError ? err.message : 'An unexpected error occurred. Please try again.',
        });
      }
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormAlert(null);
    const errors: { identifier?: string; password?: string } = {};

    const identifier = loginIdentifier.trim();
    const password = loginPassword;

    if (!identifier) {
      errors.identifier = 'Username or email is required';
    }
    if (!password) {
      errors.password = 'Password is required';
    }

    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors);
      triggerCardShake();
      return;
    }
    setLoginErrors({});
    setIsLoggingIn(true);

    try {
      const user = await api.login(identifier, password);
      const newSession = toSession(user);
      sessionRef.current = newSession;
      setSession(newSession);
      setLoginPassword('');
      setIsLoggingIn(false);
      window.location.hash = '#/dashboard';
    } catch (err) {
      setIsLoggingIn(false);
      if (err instanceof ApiError && err.code === 'EMAIL_NOT_VERIFIED') {
        // Right password, but the email was never confirmed: send them to the code screen
        savePending(identifier);
        setPendingIdentifier(identifier);
        setPendingDemoCode(err.errors?.demoCode || null);
        setVerifyNotice({
          text: err.errors?.demoCode
            ? 'Your email is not verified yet. Your code is shown below.'
            : 'Your email is not verified yet. Enter the code we emailed you (a fresh one is on its way).',
        });
        window.location.hash = '#/verify';
        return;
      }
      triggerCardShake();
      // ONE generic message for wrong user / wrong password; never reveal which one.
      const message =
        err instanceof ApiError && (err.status === 429 || err.status === 0 || err.status >= 500)
          ? err.message
          : 'Invalid username/email or password.';
      setFormAlert({ type: 'error', message });
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout(); // server destroys the session and clears the cookie
    } catch {
      /* even if the request failed, drop the local view of the session */
    }
    sessionRef.current = null;
    setSession(null);
    window.location.hash = '#/login';
  };

  const refreshSession = async () => {
    try {
      const user = await api.me();
      const fresh = toSession(user);
      sessionRef.current = fresh;
      setSession(fresh);
    } catch {
      /* ignore: the visibilitychange check handles expired sessions */
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setCpAlert(null);
    const errors: { currentPassword?: string; newPassword?: string } = {};
    if (!cpCurrent) errors.currentPassword = 'Current password is required';
    const check = evaluatePassword(cpNew, { username: session?.username, email: session?.email });
    if (!cpNew) errors.newPassword = 'New password is required';
    else if (!check.hasMinLength || !check.hasNumber) {
      errors.newPassword = 'Password must be at least 8 characters and include at least 1 number';
    } else if (!check.notCommon) {
      errors.newPassword = 'This password is far too common. Please choose a different one.';
    }
    if (Object.keys(errors).length > 0) {
      setCpErrors(errors);
      return;
    }
    setCpErrors({});
    setCpBusy(true);
    try {
      await api.changePassword(cpCurrent, cpNew);
      setCpCurrent('');
      setCpNew('');
      setCpShow(false);
      setCpAlert({ type: 'success', message: 'Password updated. All your other devices were signed out.' });
      refreshSession();
    } catch (err) {
      if (err instanceof ApiError && err.errors && Object.keys(err.errors).length > 0) {
        setCpErrors(err.errors);
      } else {
        setCpAlert({ type: 'error', message: err instanceof ApiError ? err.message : 'Could not change the password.' });
      }
    } finally {
      setCpBusy(false);
    }
  };

  const handleLogoutAll = async () => {
    if (!window.confirm('Sign out of ALL devices, including this one?')) return;
    try {
      await api.logoutAll();
    } catch {
      /* fall through: we still clear the local view */
    }
    sessionRef.current = null;
    setSession(null);
    window.location.hash = '#/login';
  };

  const seedDemoUser = async () => {
    try {
      const result = await api.seedDemo();
      alert(
        result.created
          ? `Created demo user!\n\nUsername: ${result.username}\nPassword: ${result.password}\n\nYou can now log in!`
          : `Demo account "${result.username}" already exists! Log in with username "${result.username}" and password "${result.password}".`,
      );
      setIsTestModalOpen(false);
      window.location.hash = '#/login';
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Could not create the demo user.');
    }
  };

  // --------------------------------------------------------------------------
  // PASSWORD GENERATOR
  // --------------------------------------------------------------------------
  const applyGenerated = (opts: GeneratorOptions) => {
    const pw = generatePassword(opts);
    setRegPassword(pw);
    setShowRegPassword(true); // so the user can actually see (and copy) what was generated
    setRegErrors((prev) => ({ ...prev, password: undefined }));
    setCopied(false);
  };

  const updateGenOptions = (patch: Partial<GeneratorOptions>) => {
    const next = { ...genOptions, ...patch };
    // never allow every character set to be switched off
    if (!next.lowercase && !next.uppercase && !next.numbers && !next.symbols) return;
    setGenOptions(next);
    applyGenerated(next);
  };

  const toggleGenerator = () => {
    const opening = !showGenerator;
    setShowGenerator(opening);
    if (opening) applyGenerated(genOptions);
  };

  const copyPassword = async () => {
    if (!regPassword) return;
    try {
      await navigator.clipboard.writeText(regPassword);
    } catch {
      // fallback for browsers/contexts without the async clipboard API
      const ta = document.createElement('textarea');
      ta.value = regPassword;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const passwordEval = evaluatePassword(regPassword, { username: regUsername, email: regEmail });

  // Which heading the card shows. Computed HERE (where `route` still has its full type) instead of inside the
  // JSX, because by the time the card is drawn TypeScript has already ruled out 'inbox' and complains (TS2367).
  const headingKey: keyof typeof HEADINGS = route === 'dashboard' || route === 'inbox' ? 'login' : route;

  const renderCheck = (ok: boolean, text: string, tag?: string) => (
    <div className={`checklist-item ${ok ? 'valid' : ''}`}>
      <div className="checklist-icon">{ok && <span dangerouslySetInnerHTML={{ __html: ICONS.check }} />}</div>
      <span>{text}</span>
      {tag && <span className="ml-auto text-[9px] uppercase tracking-wider text-[#8A6A1A] font-bold">{tag}</span>}
    </div>
  );

  const renderBreachCheck = () => {
    switch (breach.status) {
      case 'checking':
        return (
          <div className="checklist-item pending">
            <div className="checklist-icon checklist-spinner" />
            <span>Checking known data breaches...</span>
          </div>
        );
      case 'safe':
        return renderCheck(true, 'Not found in any known data breach', 'required');
      case 'breached':
        return (
          <div className="checklist-item invalid">
            <div className="checklist-icon">&times;</div>
            <span>Found in a data breach</span>
            <span className="ml-auto text-[9px] uppercase tracking-wider font-bold">required</span>
          </div>
        );
      case 'unknown':
        return (
          <div className="checklist-item pending">
            <div className="checklist-icon text-[10px] font-bold">?</div>
            <span>Breach database offline, server will re-check</span>
          </div>
        );
      default:
        return renderCheck(false, 'Not found in a known data breach', 'required');
    }
  };


  return (
    <div
      className="relative min-h-screen flex flex-col justify-between overflow-x-hidden"
      onMouseMove={handleContainerMouseMove}
    >
      {/* Background Rainy Misty Forest with Frosted Glass Window & Water Droplets */}
      <div dangerouslySetInnerHTML={{ __html: renderRainyForestBackground() }} />

      {/* Header */}
      <header className="relative z-30 w-full max-w-5xl mx-auto px-4 pt-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href={session ? '#/dashboard' : '#/login'} className="flex items-center gap-2 group text-decoration-none">
            <div className="w-10 h-10 rounded-full bg-[#0B3D36] border border-[#D9B86C]/70 flex items-center justify-center text-[#F3E2A9] shadow-[0_0_15px_rgba(217,184,108,0.35)] group-hover:border-[#F3E2A9] transition-all">
              <span className="text-lg font-serif">✧</span>
            </div>
            <div>
              <span className="font-serif-title text-xl font-bold tracking-wider text-[#FAF4E4] block leading-tight">
                AURA<span className="text-[#D9B86C]">AUTH</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#A9C9B8] block font-semibold">
                Enchanted Celestial Vault
              </span>
            </div>
          </a>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {mailMode === 'inbox' && (
            <a
              href="#/inbox"
              target="_blank"
              rel="noopener"
              title="Opens the pretend mailbox in a new tab, so this page stays exactly as it is"
              onClick={rememberReturnHash}
              className={`text-xs font-medium px-3.5 py-1.5 rounded-full border flex items-center gap-1.5 transition-all ${
                route === 'inbox'
                  ? 'bg-[#D9B86C]/25 border-[#D9B86C] text-[#F3E2A9]'
                  : 'bg-[#0B3D36]/90 hover:bg-[#1F6B5E] border-[#D9B86C]/60 text-[#F3E2A9]'
              }`}
            >
              <span className="text-sm">📬</span>
              <span className="hidden sm:inline">Dev Inbox</span>
            </a>
          )}
          <button
            onClick={() => setIsTestModalOpen(true)}
            className="text-xs font-medium px-3.5 py-1.5 rounded-full bg-[#0B3D36]/90 hover:bg-[#1F6B5E] border border-[#D9B86C]/60 text-[#F3E2A9] flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(217,184,108,0.2)] cursor-pointer"
          >
            <span className="text-sm">⚡</span>
            <span className="hidden sm:inline">Verification Checklist</span>
            <span className="sm:hidden">Checklist</span>
          </button>

          {session ? (
            <div className="flex items-center gap-3">
              <span className="hidden md:inline-block text-xs text-[#A9C9B8]">
                Welcome: <strong className="text-[#FAF4E4] font-medium">{session.username}</strong>
              </span>
              <button onClick={handleLogout} className="btn-gold-pill-logout text-xs !py-1.5 !px-3.5">
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-[#0B3D36]/80 p-1 rounded-full border border-[#D9B86C]/40 shadow-inner">
              <a
                href="#/login"
                className={`text-xs font-medium px-3.5 py-1 rounded-full transition-all ${
                  route === 'login'
                    ? 'bg-gradient-to-r from-[#0B3D36] to-[#1F6B5E] text-[#F3E2A9] border border-[#D9B86C]/60 shadow-sm font-semibold'
                    : 'text-[#A9C9B8] hover:text-[#FAF4E4]'
                }`}
              >
                Sign In
              </a>
              <a
                href="#/register"
                className={`text-xs font-medium px-3.5 py-1 rounded-full transition-all ${
                  route === 'register'
                    ? 'bg-gradient-to-r from-[#0B3D36] to-[#1F6B5E] text-[#F3E2A9] border border-[#D9B86C]/60 shadow-sm font-semibold'
                    : 'text-[#A9C9B8] hover:text-[#FAF4E4]'
                }`}
              >
                Register
              </a>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center py-6">
        {!authReady ? (
          <div className="relative z-10 text-sm text-[#A9C9B8] tracking-wide">Consulting the sanctuary...</div>
        ) : route === 'inbox' ? (
          <DevInbox />
        ) : route === 'dashboard' && session ? (
          /* Dashboard View */
          <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-6">
            <div className="dashboard-glass-panel p-6 sm:p-8 text-center mb-8 relative overflow-hidden">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#031512] border border-[#D9B86C]/70 text-[#F3E2A9] text-xs font-semibold mb-3 shadow-[0_0_15px_rgba(217,184,108,0.25)]">
                <span>✧</span>
                <span>Protected Sanctuary Active</span>
                <span>✧</span>
              </div>
              <h1 className="font-serif-title text-3xl sm:text-4xl text-[#FAF4E4] font-bold">
                Welcome, <span className="text-[#F3E2A9]">{session.username}</span>
              </h1>
              <div dangerouslySetInnerHTML={{ __html: ICONS.flourishUnderline }} />
              <p className="text-sm text-[#A9C9B8] mt-2 max-w-md mx-auto">
                Your credentials were verified by the server against a salted bcrypt hash.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              <div className="dashboard-glass-panel p-6 relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div
                    className="w-10 h-10 rounded-full bg-[#D9B86C]/20 border border-[#D9B86C] flex items-center justify-center text-[#F3E2A9] mb-4 shadow-[0_0_12px_rgba(217,184,108,0.25)]"
                    dangerouslySetInnerHTML={{ __html: ICONS.user }}
                  />
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-[#A9C9B8] block">
                    Account Profile
                  </span>
                  <h2 className="text-xl font-serif text-[#FAF4E4] font-bold mt-1">{session.username}</h2>
                </div>
                <div className="mt-4 pt-3 border-t border-[#D9B86C]/25 flex items-center justify-between text-xs">
                  <span className="text-[#A9C9B8]">Status:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#1F6B5E]/50 text-[#F3E2A9] border border-[#D9B86C]/40 font-medium">
                    Verified Active
                  </span>
                </div>
              </div>

              <div className="dashboard-glass-panel p-6 relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div
                    className="w-10 h-10 rounded-full bg-[#D9B86C]/20 border border-[#D9B86C] flex items-center justify-center text-[#F3E2A9] mb-4 shadow-[0_0_12px_rgba(217,184,108,0.25)]"
                    dangerouslySetInnerHTML={{ __html: ICONS.mail }}
                  />
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-[#A9C9B8] block">
                    Registered Email
                  </span>
                  <h2 className="text-base sm:text-lg font-mono text-[#FAF4E4] font-semibold mt-1 break-all">
                    {session.email}
                  </h2>
                </div>
                <div className="mt-4 pt-3 border-t border-[#D9B86C]/25 flex items-center justify-between text-xs">
                  <span className="text-[#A9C9B8]">Integrity:</span>
                  <span className="text-[#F3E2A9]">Identity Matched</span>
                </div>
              </div>

              <div className="dashboard-glass-panel p-6 relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-full bg-[#D9B86C]/20 border border-[#D9B86C] flex items-center justify-center text-[#F3E2A9] mb-4 shadow-[0_0_12px_rgba(217,184,108,0.25)]">
                    <span className="text-lg">✦</span>
                  </div>
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-[#A9C9B8] block">
                    Member Since
                  </span>
                  <h2 className="text-lg font-serif text-[#FAF4E4] font-semibold mt-1">
                    {session.memberSince ? new Date(session.memberSince).toLocaleDateString() : 'Recently'}
                  </h2>
                </div>
                <div className="mt-4 pt-3 border-t border-[#D9B86C]/25 flex items-center justify-between text-xs">
                  <span className="text-[#A9C9B8]">Vault Record:</span>
                  <span className="font-mono text-[#A9C9B8]">#{session.userId.slice(0, 8)}</span>
                </div>
              </div>

              <div className="dashboard-glass-panel p-6 relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-full bg-[#D9B86C]/20 border border-[#D9B86C] flex items-center justify-center text-[#F3E2A9] mb-4 shadow-[0_0_12px_rgba(217,184,108,0.25)]">
                    <span className="text-lg">🕒</span>
                  </div>
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-[#A9C9B8] block">
                    Last Login Time
                  </span>
                  <h2 className="text-base sm:text-lg font-mono text-[#FAF4E4] font-semibold mt-1">
                    {session.loginTime ? new Date(session.loginTime).toLocaleTimeString() : 'Active Now'}
                  </h2>
                </div>
                <div className="mt-4 pt-3 border-t border-[#D9B86C]/25 flex items-center justify-between text-xs">
                  <span className="text-[#A9C9B8]">Session Key:</span>
                  <span className="font-mono text-[#F3E2A9]">authSession</span>
                </div>
              </div>

              <div className="dashboard-glass-panel p-6 md:col-span-2 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-full bg-[#D9B86C]/20 border border-[#D9B86C] flex items-center justify-center text-[#F3E2A9]"
                    dangerouslySetInnerHTML={{ __html: ICONS.shield }}
                  />
                  <div>
                    <h2 className="font-serif text-lg text-[#F3E2A9] font-bold">Server Security Inspector</h2>
                    <p className="text-xs text-[#A9C9B8]">
                      Passwords are NEVER stored in plaintext. Hashed with bcrypt on the server.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-[#031512]/80 border border-[#D9B86C]/30">
                    <span className="text-[10px] uppercase font-bold text-[#F3E2A9] block font-sans">
                      Per-User Random Salt:
                    </span>
                    <span className="text-[#FAF4E4] break-all block mt-1">Unique random salt built into every bcrypt hash</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#031512]/80 border border-[#D9B86C]/30">
                    <span className="text-[10px] uppercase font-bold text-[#F3E2A9] block font-sans">
                      Stored bcrypt Hash:
                    </span>
                    <span className="text-[#A9C9B8] break-all block mt-1">60-character hash (cost 12). The password itself is never saved</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-glass-panel p-6 mb-8 relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
                <div>
                  <h2 className="font-serif text-lg text-[#F3E2A9] font-bold">Account Security</h2>
                  <p className="text-xs text-[#A9C9B8]">
                    Signed in on{' '}
                    <strong className="text-[#FAF4E4]">{session.activeSessions ?? 1}</strong>{' '}
                    device{(session.activeSessions ?? 1) === 1 ? '' : 's'} right now.
                    {session.emailVerified && (
                      <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1F6B5E]/30 border border-[#4F9A7E]/60 text-[10px] font-semibold text-[#CFE8DC]">
                        ✓ Email verified
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowChangePw(!showChangePw);
                      setCpAlert(null);
                      setCpErrors({});
                    }}
                    aria-expanded={showChangePw}
                    className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#D9B86C]/20 hover:bg-[#D9B86C]/30 border border-[#D9B86C]/60 text-[#F3E2A9] transition-all cursor-pointer"
                  >
                    {showChangePw ? 'Close' : 'Change password'}
                  </button>
                  <button
                    type="button"
                    onClick={handleLogoutAll}
                    className="px-4 py-1.5 rounded-full text-xs font-semibold border border-[#B5483C]/70 text-[#F2B8B0] hover:bg-[#B5483C]/20 transition-all cursor-pointer"
                  >
                    Sign out all devices
                  </button>
                </div>
              </div>

              {cpAlert && (
                <div
                  role={cpAlert.type === 'error' ? 'alert' : 'status'}
                  className={`mt-3 text-xs px-3 py-2 rounded-xl border ${
                    cpAlert.type === 'error'
                      ? 'bg-[#B5483C]/15 border-[#B5483C]/60 text-[#F2B8B0]'
                      : 'bg-[#1F6B5E]/25 border-[#4F9A7E]/60 text-[#CFE8DC]'
                  }`}
                >
                  {cpAlert.message}
                </div>
              )}

              {showChangePw && (
                <form onSubmit={handleChangePassword} noValidate className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="cp-current" className="block text-[11px] font-semibold uppercase tracking-wider text-[#A9C9B8] mb-1">
                      Current password
                    </label>
                    <input
                      id="cp-current"
                      type={cpShow ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={cpCurrent}
                      onChange={(e) => setCpCurrent(e.target.value)}
                      aria-invalid={Boolean(cpErrors.currentPassword)}
                      className="w-full px-4 py-2 rounded-full bg-[#031512]/80 border border-[#D9B86C]/40 text-sm text-[#FAF4E4] focus:outline-none focus:border-[#F3E2A9] focus:shadow-[0_0_10px_rgba(217,184,108,0.4)]"
                    />
                    {cpErrors.currentPassword && (
                      <div className="text-[11px] text-[#F2B8B0] mt-1 pl-3">{cpErrors.currentPassword}</div>
                    )}
                  </div>
                  <div>
                    <label htmlFor="cp-new" className="block text-[11px] font-semibold uppercase tracking-wider text-[#A9C9B8] mb-1">
                      New password
                    </label>
                    <input
                      id="cp-new"
                      type={cpShow ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={cpNew}
                      onChange={(e) => setCpNew(e.target.value)}
                      aria-invalid={Boolean(cpErrors.newPassword)}
                      className="w-full px-4 py-2 rounded-full bg-[#031512]/80 border border-[#D9B86C]/40 text-sm text-[#FAF4E4] focus:outline-none focus:border-[#F3E2A9] focus:shadow-[0_0_10px_rgba(217,184,108,0.4)]"
                    />
                    {cpErrors.newPassword && (
                      <div className="text-[11px] text-[#F2B8B0] mt-1 pl-3">{cpErrors.newPassword}</div>
                    )}
                    {(() => {
                      const ev = evaluatePassword(cpNew, { username: session.username, email: session.email });
                      return (
                        <div className="mt-2 px-1" aria-live="polite">
                          <div className="grid grid-cols-5 gap-1 h-1.5">
                            {STRENGTH_LEVELS.map((lvl, i) => (
                              <div
                                key={lvl.label}
                                className="rounded-full transition-all duration-300"
                                style={{ backgroundColor: i <= ev.score ? ev.color : 'rgba(169,201,184,0.18)' }}
                              />
                            ))}
                          </div>
                          <div className="text-[10.5px] text-[#A9C9B8] mt-1">
                            {ev.score < 0 ? 'Min 8 characters & 1 number' : `${ev.label} · cracked in ${ev.crackTime}`}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                  <div className="sm:col-span-2 flex flex-wrap items-center gap-2">
                    <button
                      type="submit"
                      disabled={cpBusy}
                      className="px-5 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-[#0B3D36] to-[#1F6B5E] border border-[#D9B86C] text-[#F3E2A9] hover:shadow-[0_0_14px_rgba(217,184,108,0.45)] disabled:opacity-60 transition-all cursor-pointer"
                    >
                      {cpBusy ? 'Saving...' : 'Update password'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCpNew(generatePassword({ length: 18 }));
                        setCpShow(true);
                      }}
                      className="px-4 py-1.5 rounded-full text-xs font-semibold border border-[#D9B86C]/60 text-[#F3E2A9] hover:bg-[#D9B86C]/15 transition-all cursor-pointer"
                    >
                      ✦ Generate one
                    </button>
                    <label className="flex items-center gap-1.5 text-[11px] text-[#A9C9B8] cursor-pointer">
                      <input type="checkbox" checked={cpShow} onChange={(e) => setCpShow(e.target.checked)} className="accent-[#D9B86C]" />
                      Show passwords
                    </label>
                    <span className="text-[10.5px] text-[#A9C9B8]/80 ml-auto">
                      The new password is also checked against known data breaches.
                    </span>
                  </div>
                </form>
              )}
            </div>

            <div className="dashboard-glass-panel p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-[#A9C9B8]">
                <span className="text-base text-[#F3E2A9]">✦</span>
                <span>Protected route validated by the server &bull; httpOnly session cookie</span>
              </div>
              <button onClick={handleLogout} className="btn-gold-pill-logout w-full sm:w-auto text-sm">
                <span dangerouslySetInnerHTML={{ __html: ICONS.logout }} />
                <span>Log Out Session</span>
              </button>
            </div>
          </div>
        ) : (
          /* Card Container for Register or Login */
          <div className="relative z-10 w-full max-w-[500px] mx-auto px-4 py-6 sm:py-8">
            <div className="relative flex flex-col items-center">
              {/* Large Arched Window */}
              <div dangerouslySetInnerHTML={{ __html: renderLargeArchWindow() }} />

              {/* Main Enchanted Celestial Card Surface */}
              <div
                id="authCard"
                className={`enchanted-card-surface enchanted-card-halo enchanted-card-entrance w-full p-6 sm:p-9 pt-14 text-[#031512] shadow-2xl ${
                  isShaking ? 'card-shake' : ''
                }`}
              >
                {/* Symmetrical Lush Botanicals */}
                <div dangerouslySetInnerHTML={{ __html: renderLushBotanicals('left') }} />
                <div dangerouslySetInnerHTML={{ __html: renderLushBotanicals('right') }} />

                {/* Glowing Circular Top Emblem */}
                <div dangerouslySetInnerHTML={{ __html: renderCelestialEmblem() }} />

                {/* Fairy Lights Draping */}
                <div dangerouslySetInnerHTML={{ __html: renderFairyLights() }} />

                {/* Corner Jewels & Bottom Pendant */}
                <div dangerouslySetInnerHTML={{ __html: renderCornerJewels() }} />
                <div dangerouslySetInnerHTML={{ __html: renderBottomPendant() }} />

                {/* Header */}
                <div className="text-center mt-3 mb-6 relative z-10">
                  <span className="text-[11px] tracking-[0.25em] uppercase text-[#1F6B5E] font-semibold block mb-1">
                    {HEADINGS[headingKey].eyebrow}
                  </span>
                  <h1 className="font-serif-title text-2xl sm:text-3xl text-[#031512] font-bold">
                    {HEADINGS[headingKey].title}
                  </h1>
                  <div dangerouslySetInnerHTML={{ __html: ICONS.flourishUnderline }} />
                  <p className="text-xs text-[#315449] mt-1.5 font-normal">
                    {HEADINGS[headingKey].sub}
                  </p>
                </div>

                {/* Form Alert Pill */}
                {formAlert && (route === 'login' || route === 'register') && (
                  <div
                    className={`${
                      formAlert.type === 'error' ? 'pill-error-alert' : 'pill-success-alert'
                    } mb-4 relative z-10`}
                  >
                    <span dangerouslySetInnerHTML={{ __html: formAlert.type === 'error' ? ICONS.alert : ICONS.check }} />
                    <span>{formAlert.message}</span>
                  </div>
                )}

                {route === 'verify' ? (
                  <VerifyEmailForm
                    key={`verify-${pendingIdentifier}-${pendingDemoCode ?? ''}`}
                    identifier={pendingIdentifier}
                    notice={verifyNotice}
                    demoCode={pendingDemoCode}
                    mailMode={mailMode}
                    onShake={triggerCardShake}
                    onVerified={() => {
                      savePending('');
                      setPendingIdentifier('');
                      setPendingDemoCode(null);
                      setVerifyNotice(null);
                      window.location.hash = '#/login';
                    }}
                  />
                ) : route === 'forgot' ? (
                  <ForgotPasswordForm
                    mailMode={mailMode}
                    onShake={triggerCardShake}
                    onReset={() => {
                      window.location.hash = '#/login';
                    }}
                  />
                ) : route === 'register' ? (
                  /* Register Form */
                  <form onSubmit={handleRegisterSubmit} noValidate className="space-y-4 relative z-10">
                    <div className="input-group">
                      <label htmlFor="reg-username" className="block text-xs font-semibold uppercase tracking-wider text-[#0B3D36] mb-1.5">
                        Username
                      </label>
                      <div className="relative flex items-center">
                        <span
                          className="absolute left-3.5 input-icon-svg pointer-events-none transition-all"
                          dangerouslySetInnerHTML={{ __html: ICONS.user }}
                        />
                        <input
                          id="reg-username"
                          autoComplete="username"
                          aria-invalid={Boolean(regErrors.username)}
                          type="text"
                          value={regUsername}
                          onChange={(e) => setRegUsername(e.target.value)}
                          placeholder="e.g. starlight_wanderer"
                          className={`pill-input ${regErrors.username ? 'input-error' : ''}`}
                          required
                        />
                      </div>
                      {regErrors.username && (
                        <div className="text-[11px] text-[#B5483C] font-medium mt-1 pl-3">{regErrors.username}</div>
                      )}
                    </div>

                    <div className="input-group">
                      <label htmlFor="reg-email" className="block text-xs font-semibold uppercase tracking-wider text-[#0B3D36] mb-1.5">
                        Email Address
                      </label>
                      <div className="relative flex items-center">
                        <span
                          className="absolute left-3.5 input-icon-svg pointer-events-none transition-all"
                          dangerouslySetInnerHTML={{ __html: ICONS.mail }}
                        />
                        <input
                          id="reg-email"
                          autoComplete="email"
                          aria-invalid={Boolean(regErrors.email)}
                          type="email"
                          value={regEmail}
                          onChange={(e) => {
                            setRegEmail(e.target.value);
                            setEmailSuggestion(null);
                          }}
                          onBlur={() => {
                            // tell the user about a wrong or fake-looking address as soon as they leave the field
                            if (!regEmail.trim()) return;
                            const check = validateEmail(regEmail);
                            setRegErrors((prev) => ({ ...prev, email: check.ok ? undefined : check.message }));
                            setEmailSuggestion(!check.ok && check.suggestion ? check.suggestion : null);
                          }}
                          placeholder="you@domain.com"
                          className={`pill-input ${regErrors.email ? 'input-error' : ''}`}
                          required
                        />
                      </div>
                      {regErrors.email && (
                        <div className="text-[11px] text-[#B5483C] font-medium mt-1 pl-3">
                          {regErrors.email}
                          {emailSuggestion && (
                            <>
                              {' '}
                              <button
                                type="button"
                                onClick={() => {
                                  setRegEmail(emailSuggestion);
                                  setRegErrors((prev) => ({ ...prev, email: undefined }));
                                  setEmailSuggestion(null);
                                }}
                                className="font-bold text-[#0B3D36] underline underline-offset-2 decoration-[#D9B86C] cursor-pointer"
                              >
                                Use {emailSuggestion}
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="input-group">
                      <label htmlFor="reg-password" className="block text-xs font-semibold uppercase tracking-wider text-[#0B3D36] mb-1.5">
                        Password
                      </label>
                      <div className="relative flex items-center">
                        <span
                          className="absolute left-3.5 input-icon-svg pointer-events-none transition-all"
                          dangerouslySetInnerHTML={{ __html: ICONS.lock }}
                        />
                        <input
                          id="reg-password"
                          autoComplete="new-password"
                          aria-invalid={Boolean(regErrors.password)}
                          type={showRegPassword ? 'text' : 'password'}
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Enter a strong password"
                          className={`pill-input pr-12 ${regErrors.password ? 'input-error' : ''}`}
                          required
                        />
                        {/* Show/Hide password toggle with ornate eye SVG */}
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          aria-label={showRegPassword ? 'Hide password' : 'Show password'}
                          className="ornate-eye-toggle"
                          dangerouslySetInnerHTML={{ __html: showRegPassword ? ICONS.eyeOffOrnate : ICONS.eyeOrnate }}
                        />
                      </div>
                      {regErrors.password && (
                        <div className="text-[11px] text-[#B5483C] font-medium mt-1 pl-3">{regErrors.password}</div>
                      )}

                      {/* Password tools: generator, strength meter, live checklist & breach check */}
                      <div className="mt-3 space-y-2.5">
                        <button
                          type="button"
                          onClick={toggleGenerator}
                          aria-expanded={showGenerator}
                          className="w-full flex items-center justify-between gap-2 px-4 py-2 rounded-full border border-[#D9B86C] bg-gradient-to-r from-[#FAF4E4] to-[#F3E2A9]/60 text-[#0B3D36] text-xs font-semibold hover:shadow-[0_0_14px_rgba(217,184,108,0.45)] transition-all cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-sm">✦</span>
                            {showGenerator ? 'Hide password generator' : 'Generate a strong password for me'}
                          </span>
                          <span className="text-[10px] text-[#1F6B5E]">{showGenerator ? '▲' : '▼'}</span>
                        </button>

                        {showGenerator && (
                          <div className="p-3.5 rounded-2xl bg-[#FAF4E4] border border-[#D9B86C]/60 space-y-3 shadow-sm">
                            <div className="flex items-center justify-between text-[11px] font-semibold text-[#0B3D36]">
                              <label htmlFor="gen-length">Length</label>
                              <span className="px-2 py-0.5 rounded-full bg-[#0B3D36] text-[#F3E2A9] text-[10px] font-bold">
                                {genOptions.length}
                              </span>
                            </div>
                            <input
                              id="gen-length"
                              type="range"
                              min={12}
                              max={32}
                              value={genOptions.length}
                              onChange={(e) => updateGenOptions({ length: Number(e.target.value) })}
                              className="w-full accent-[#1F6B5E] cursor-pointer"
                            />
                            <div className="flex flex-wrap gap-1.5">
                              {(
                                [
                                  ['lowercase', 'a-z'],
                                  ['uppercase', 'A-Z'],
                                  ['numbers', '0-9'],
                                  ['symbols', '!@#'],
                                  ['avoidAmbiguous', 'No look-alikes'],
                                ] as const
                              ).map(([key, label]) => (
                                <button
                                  key={key}
                                  type="button"
                                  role="switch"
                                  aria-checked={genOptions[key]}
                                  onClick={() =>
                                    updateGenOptions({ [key]: !genOptions[key] } as Partial<GeneratorOptions>)
                                  }
                                  className={`px-3 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
                                    genOptions[key]
                                      ? 'bg-[#0B3D36] text-[#F3E2A9] border-[#D9B86C]'
                                      : 'bg-transparent text-[#315449] border-[#1F6B5E]/40 hover:border-[#1F6B5E]'
                                  }`}
                                >
                                  {label}
                                </button>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => applyGenerated(genOptions)}
                                className="flex-1 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-[#0B3D36] text-[#F3E2A9] border border-[#D9B86C]/70 hover:bg-[#1F6B5E] transition-all cursor-pointer"
                              >
                                ↻ Regenerate
                              </button>
                              <button
                                type="button"
                                onClick={copyPassword}
                                className="flex-1 px-3 py-1.5 rounded-full text-[11px] font-semibold border border-[#1F6B5E]/60 text-[#0B3D36] hover:bg-[#1F6B5E]/10 transition-all cursor-pointer"
                              >
                                {copied ? '✓ Copied' : 'Copy'}
                              </button>
                            </div>
                            <p className="text-[10px] text-[#315449] leading-snug">
                              Made in your browser with a cryptographically secure random generator. It is filled
                              into the field above and goes nowhere until you create the account. Save it in a
                              password manager.
                            </p>
                          </div>
                        )}

                        {breach.status === 'breached' && (
                          <div
                            role="alert"
                            className="flex items-start gap-2 p-2.5 rounded-xl bg-[#B5483C]/10 border border-[#B5483C]/50 text-[11px] text-[#8E2F25] font-medium"
                          >
                            <span>⚠</span>
                            <span>
                              {breach.count > 0
                                ? `This password has appeared ${breach.count.toLocaleString()} times in known data breaches, so it can't be used.`
                                : "This is a very common password, so it can't be used."}{' '}
                              Pick another or use the generator.
                            </span>
                          </div>
                        )}

                        <div
                          className="p-3.5 rounded-2xl bg-[#FAF4E4] border border-[#1F6B5E]/30 space-y-3 shadow-sm"
                          aria-live="polite"
                        >
                          <div className="flex items-center justify-between text-[11px] font-semibold text-[#0B3D36]">
                            <div className="flex items-center gap-1.5">
                              <span>Password Strength:</span>
                              <span
                                className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300"
                                style={{
                                  backgroundColor: passwordEval.score < 0 ? 'rgba(49, 84, 73, 0.1)' : `${passwordEval.color}2B`,
                                  color: passwordEval.score < 0 ? '#315449' : STRENGTH_TEXT_COLORS[passwordEval.score],
                                  border: `1px solid ${passwordEval.score < 0 ? 'rgba(49, 84, 73, 0.2)' : passwordEval.color}`,
                                }}
                              >
                                {passwordEval.label}
                              </span>
                            </div>
                            {passwordEval.score >= 0 && (
                              <span className="text-[10px] text-[#315449] font-normal">
                                ≈ <strong className="text-[#0B3D36]">{passwordEval.entropyBits} bits</strong>
                              </span>
                            )}
                          </div>

                          {/* 5-segment glowing strength bar */}
                          <div
                            className="grid grid-cols-5 gap-1.5 h-2.5 w-full"
                            role="meter"
                            aria-label="Password strength"
                            aria-valuemin={0}
                            aria-valuemax={4}
                            aria-valuenow={Math.max(passwordEval.score, 0)}
                          >
                            {STRENGTH_LEVELS.map((level, i) => (
                              <div
                                key={level.label}
                                className="h-full rounded-full transition-all duration-300"
                                style={{
                                  backgroundColor: i <= passwordEval.score ? passwordEval.color : 'rgba(31, 107, 94, 0.12)',
                                  boxShadow: i <= passwordEval.score ? `0 0 8px ${passwordEval.color}80` : 'none',
                                }}
                              />
                            ))}
                          </div>

                          <div
                            className="text-[10.5px] text-[#315449]"
                            title="Worst-case estimate: an offline attacker trying 10 billion guesses per second"
                          >
                            {passwordEval.score < 0 ? (
                              'Min 8 characters & 1 number. Or let the generator make one for you.'
                            ) : (
                              <>
                                Estimated time to crack:{' '}
                                <strong className="text-[#0B3D36]">{passwordEval.crackTime}</strong>
                              </>
                            )}
                          </div>

                          <div className="space-y-1.5 pt-0.5">
                            {renderCheck(passwordEval.hasMinLength, 'Minimum 8 characters', 'required')}
                            {renderCheck(passwordEval.hasNumber, 'At least 1 number', 'required')}
                            {renderCheck(passwordEval.score >= 0 && passwordEval.notCommon, 'Not a commonly used password', 'required')}
                            {renderBreachCheck()}
                            {renderCheck(passwordEval.hasUppercase && passwordEval.hasLowercase, 'Upper & lowercase letters')}
                            {renderCheck(passwordEval.hasSpecial, 'A symbol (! ? # $ ...)')}
                            {renderCheck(passwordEval.isLong, '12 characters or more')}
                          </div>

                          {passwordEval.score >= 0 && passwordEval.suggestions.length > 0 && (
                            <div className="text-[10.5px] text-[#315449] pt-0.5 border-t border-[#1F6B5E]/15">
                              <span className="font-bold text-[#0B3D36]">Tips: </span>
                              {passwordEval.suggestions.join(' · ')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button type="submit" disabled={isRegistering} className="btn-primary-emerald">
                        <span>{isRegistering ? 'Securing your identity...' : 'Create Account'}</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Login Form */
                  <form onSubmit={handleLoginSubmit} noValidate className="space-y-4 relative z-10">
                    <div className="input-group">
                      <label htmlFor="login-identifier" className="block text-xs font-semibold uppercase tracking-wider text-[#0B3D36] mb-1.5">
                        Username or Email
                      </label>
                      <div className="relative flex items-center">
                        <span
                          className="absolute left-3.5 input-icon-svg pointer-events-none transition-all"
                          dangerouslySetInnerHTML={{ __html: ICONS.user }}
                        />
                        <input
                          id="login-identifier"
                          autoComplete="username"
                          aria-invalid={Boolean(loginErrors.identifier)}
                          type="text"
                          value={loginIdentifier}
                          onChange={(e) => setLoginIdentifier(e.target.value)}
                          placeholder="Enter username or email"
                          className={`pill-input ${loginErrors.identifier ? 'input-error' : ''}`}
                          required
                        />
                      </div>
                      {loginErrors.identifier && (
                        <div className="text-[11px] text-[#B5483C] font-medium mt-1 pl-3">
                          {loginErrors.identifier}
                        </div>
                      )}
                    </div>

                    <div className="input-group">
                      <label htmlFor="login-password" className="block text-xs font-semibold uppercase tracking-wider text-[#0B3D36] mb-1.5">
                        Password
                      </label>
                      <div className="relative flex items-center">
                        <span
                          className="absolute left-3.5 input-icon-svg pointer-events-none transition-all"
                          dangerouslySetInnerHTML={{ __html: ICONS.lock }}
                        />
                        <input
                          id="login-password"
                          autoComplete="current-password"
                          aria-invalid={Boolean(loginErrors.password)}
                          type={showLoginPassword ? 'text' : 'password'}
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="Enter your password"
                          className={`pill-input pr-12 ${loginErrors.password ? 'input-error' : ''}`}
                          required
                        />
                        {/* Show/Hide password toggle with ornate eye SVG */}
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                          className="ornate-eye-toggle"
                          dangerouslySetInnerHTML={{ __html: showLoginPassword ? ICONS.eyeOffOrnate : ICONS.eyeOrnate }}
                        />
                      </div>
                      {loginErrors.password && (
                        <div className="text-[11px] text-[#B5483C] font-medium mt-1 pl-3">{loginErrors.password}</div>
                      )}
                      {canEmail && (
                      <div className="text-right mt-1.5 pr-3">
                        <a
                          href="#/forgot"
                          className="text-[11px] font-semibold text-[#0B3D36] hover:text-[#1F6B5E] underline underline-offset-4 decoration-[#D9B86C]"
                        >
                          Forgot password?
                        </a>
                      </div>
                      )}
                    </div>

                    <div className="pt-2">
                      <button type="submit" disabled={isLoggingIn} className="btn-primary-emerald">
                        <span>{isLoggingIn ? 'Verifying Salt & Hash...' : 'Sign In'}</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Switch link */}
                <div className="text-center mt-5 pt-4 border-t border-[#1F6B5E]/20 relative z-10">
                  <p className="text-xs text-[#315449]">
                    {route === 'verify' || route === 'forgot' ? (
                      <>
                        <a
                          href="#/login"
                          className="font-bold text-[#0B3D36] hover:text-[#1F6B5E] underline underline-offset-4 decoration-[#D9B86C] transition-colors"
                        >
                          ← Back to Sign In
                        </a>
                      </>
                    ) : route === 'register' ? (
                      <>
                        Already hold a celestial identity?{' '}
                        <a
                          href="#/login"
                          className="font-bold text-[#0B3D36] hover:text-[#1F6B5E] underline underline-offset-4 decoration-[#D9B86C] transition-colors ml-1"
                        >
                          Sign In Here
                        </a>
                      </>
                    ) : (
                      <>
                        New to the Celestial Sanctuary?{' '}
                        <a
                          href="#/register"
                          className="font-bold text-[#0B3D36] hover:text-[#1F6B5E] underline underline-offset-4 decoration-[#D9B86C] transition-colors ml-1"
                        >
                          Create an Account
                        </a>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-30 text-center py-4 text-[11px] text-[#A9C9B8]/70">
        AuraAuth &bull; Enchanted Emerald & Champagne Gold Celestial Vault &bull; Express + bcrypt backend
      </footer>

      {/* Test Guide Modal */}
      {isTestModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setIsTestModalOpen(false)}
        >
          <div
            className="relative w-full max-w-xl dashboard-glass-panel p-6 sm:p-7 text-[#FAF4E4] border-2 border-[#D9B86C]/70 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsTestModalOpen(false)}
              className="absolute top-4 right-4 text-[#A9C9B8] hover:text-[#F3E2A9] text-xl font-bold cursor-pointer"
            >
              &times;
            </button>

            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#D9B86C]/20 border border-[#D9B86C] flex items-center justify-center text-[#F3E2A9]">
                ✓
              </div>
              <div>
                <h3 className="font-serif-title text-xl text-[#F3E2A9] font-bold">System Verification Checklist</h3>
                <span className="text-[11px] text-[#A9C9B8]">All 9 security requirements are live</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs mt-4">
              <div className="p-3 rounded-xl bg-[#031512]/85 border border-[#D9B86C]/30 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#1F6B5E] text-[#F3E2A9] font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <strong className="text-[#F3E2A9] block">Weak Password Rejected:</strong>
                  <span className="text-[#A9C9B8]">
                    Register with &lt; 8 characters or no digits. Live checklist ticks off only when both are satisfied.
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#031512]/85 border border-[#D9B86C]/30 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#1F6B5E] text-[#F3E2A9] font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <strong className="text-[#F3E2A9] block">Duplicate User Rejected:</strong>
                  <span className="text-[#A9C9B8]">
                    Existing username or email shows: <em>"An account with this username or email already exists."</em>
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#031512]/85 border border-[#D9B86C]/30 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#1F6B5E] text-[#F3E2A9] font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <strong className="text-[#F3E2A9] block">Wrong Login Error:</strong>
                  <span className="text-[#A9C9B8]">
                    Invalid credentials trigger a gentle card shake and ONE generic error: <em>"Invalid username/email or password."</em>
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#031512]/85 border border-[#D9B86C]/30 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#1F6B5E] text-[#F3E2A9] font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  4
                </span>
                <div>
                  <strong className="text-[#F3E2A9] block">Direct Dashboard Access Redirects:</strong>
                  <span className="text-[#A9C9B8]">
                    Directly opening <code>#/dashboard</code> when logged out asks the server first, then redirects to <code>#/login</code>.
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#031512]/85 border border-[#D9B86C]/30 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#1F6B5E] text-[#F3E2A9] font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  5
                </span>
                <div>
                  <strong className="text-[#F3E2A9] block">Logout Works:</strong>
                  <span className="text-[#A9C9B8]">
                    Clicking "Log Out" destroys the server session, clears the cookie and returns to <code>#/login</code>.
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#031512]/85 border border-[#D9B86C]/30 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#1F6B5E] text-[#F3E2A9] font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  6
                </span>
                <div>
                  <strong className="text-[#F3E2A9] block">Breached Password Blocked:</strong>
                  <span className="text-[#A9C9B8]">
                    Type a leaked password such as <code>Password123</code> or <code>Welcome@2020</code> on the register page. The checklist turns red and the server refuses it too. Only a 5-character hash prefix is ever sent out.
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#031512]/85 border border-[#D9B86C]/30 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#1F6B5E] text-[#F3E2A9] font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  7
                </span>
                <div>
                  <strong className="text-[#F3E2A9] block">Password Generator:</strong>
                  <span className="text-[#A9C9B8]">
                    On the register page press <em>"Generate a strong password for me"</em>: pick length and character sets, then copy it. The 5-level strength meter updates live.
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#031512]/85 border border-[#D9B86C]/30 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#1F6B5E] text-[#F3E2A9] font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  8
                </span>
                <div>
                  <strong className="text-[#F3E2A9] block">Email Verification:</strong>
                  <span className="text-[#A9C9B8]">
                    After registering you must enter a 6-digit code sent by email (10 min expiry, 5 tries, 60 s resend). Until then, sign-in is refused.
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#031512]/85 border border-[#D9B86C]/30 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#1F6B5E] text-[#F3E2A9] font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  9
                </span>
                <div>
                  <strong className="text-[#F3E2A9] block">Forgot Password:</strong>
                  <span className="text-[#A9C9B8]">
                    Use <em>"Forgot password?"</em> on the sign-in page: code by email, then a new password that also passes the breach check. All devices are signed out.
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#D9B86C]/25 flex items-center justify-between text-[11px] text-[#A9C9B8]">
              <span>bcrypt (salted) + server sessions</span>
              <button
                onClick={seedDemoUser}
                className="px-3.5 py-1 rounded-full bg-[#D9B86C]/20 hover:bg-[#D9B86C]/30 border border-[#D9B86C]/50 text-[#F3E2A9] transition-all cursor-pointer font-medium"
              >
                Seed Demo User (alice / Secret123)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { App };
