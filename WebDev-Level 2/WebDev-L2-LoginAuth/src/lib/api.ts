/**
 * Thin client for the AuraAuth Express API.
 * The session lives in an httpOnly cookie that the browser sends automatically,
 * so this code never sees or stores any token.
 */
export interface ApiUser {
  id: string;
  username: string;
  email: string;
  memberSince: string;
  loginTime: string;
  /** how many devices/browsers are currently signed in as this user (only sent by /api/me) */
  activeSessions?: number;
  emailVerified?: boolean;
}

export interface InboxMessage {
  id: number;
  to: string;
  subject: string;
  text: string;
  purpose: 'verify' | 'reset';
  code: string;
  ttlMinutes: number;
  sentAt: string;
}

export class ApiError extends Error {
  status: number;
  code?: string;
  errors?: Record<string, string>;
  constructor(status: number, message: string, code?: string, errors?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.errors = errors;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api${path}`, {
      credentials: 'same-origin',
      ...init,
      headers: {
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        ...init.headers,
      },
    });
  } catch {
    throw new ApiError(
      0,
      'Cannot reach the server. Make sure the backend is running (npm run dev:all).',
      'NETWORK',
    );
  }

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    /* non-JSON body */
  }

  if (!res.ok) {
    throw new ApiError(
      res.status,
      data?.message || 'Something went wrong. Please try again.',
      data?.code,
      data?.errors,
    );
  }
  return data as T;
}

const post = <T,>(path: string, body?: unknown) =>
  request<T>(path, { method: 'POST', body: body === undefined ? undefined : JSON.stringify(body) });

export const api = {
  me: () => request<{ user: ApiUser }>('/me').then((r) => r.user),
  config: () => request<{ emailVerification: boolean; mailMode: 'smtp' | 'console' | 'inbox' | 'demo'; canEmail: boolean; demoCodes?: boolean }>('/config'),
  devInbox: () => request<{ messages: InboxMessage[] }>('/dev/inbox').then((r) => r.messages),
  clearDevInbox: () => request<{ ok: boolean }>('/dev/inbox', { method: 'DELETE' }),
  register: (username: string, email: string, password: string) =>
    post<{
      user: { username: string; email: string };
      verificationRequired: boolean;
      emailSent: boolean;
      maskedEmail: string;
      demoCode?: string;
    }>('/register', { username, email, password }),
  verifyEmail: (identifier: string, code: string) => post<{ ok: boolean }>('/verify-email', { identifier, code }),
  resendVerification: (identifier: string) => post<{ ok: boolean; message: string; demoCode?: string }>('/resend-verification', { identifier }),
  forgotPassword: (identifier: string) => post<{ ok: boolean; message: string; demoCode?: string }>('/forgot-password', { identifier }),
  resetPassword: (identifier: string, code: string, newPassword: string) =>
    post<{ ok: boolean }>('/reset-password', { identifier, code, newPassword }),
  login: (identifier: string, password: string) =>
    post<{ user: ApiUser }>('/login', { identifier, password }).then((r) => r.user),
  logout: () => post<{ ok: boolean }>('/logout'),
  logoutAll: () => post<{ ok: boolean }>('/logout-all'),
  changePassword: (currentPassword: string, newPassword: string) =>
    post<{ ok: boolean }>('/change-password', { currentPassword, newPassword }),
  seedDemo: () => post<{ created: boolean; username: string; password: string }>('/dev/seed'),
};
