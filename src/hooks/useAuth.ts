const AUTH_FRONTEND_URL = import.meta.env.VITE_AUTH_URL ?? 'https://auth.urbanflow.lazyy.fr';

export type UserRole =
  | 'SUPERADMIN'
  | 'CLASSIC_USER'
  | 'TECHNICIAN'
  | 'ADMIN_TECHNICIAN'
  | 'USER_CITY'
  | 'ADMIN_USER_CITY';

interface JwtPayload {
  sub: string;
  role: UserRole;
}

function decodeJwtPayload(token: string): JwtPayload | null {
  const segments = token.split('.');
  if (segments.length !== 3) return null;

  try {
    const base64 = segments[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const json = atob(padded);
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

export function consumeAuthHash(): void {
  if (!window.location.hash) return;

  const params = new URLSearchParams(window.location.hash.slice(1));
  const token = params.get('token');
  const refresh = params.get('refresh');

  if (!token) return;

  localStorage.setItem('uf_token', token);
  if (refresh) localStorage.setItem('uf_refresh', refresh);

  window.history.replaceState(null, '', window.location.pathname + window.location.search);
}

export function getStoredToken(): string | null {
  return localStorage.getItem('uf_token');
}

export function getStoredRole(): UserRole | null {
  const token = getStoredToken();
  if (!token) return null;

  const payload = decodeJwtPayload(token);
  return payload?.role ?? null;
}

export function redirectToLogin(): void {
  const redirect = encodeURIComponent(window.location.href);
  window.location.href = `${AUTH_FRONTEND_URL}/login?app=monitoring&redirect=${redirect}`;
}

export function useAuth() {
  return {
    token: getStoredToken(),
    role: getStoredRole(),
    login: redirectToLogin,
    logout: () => {
      localStorage.removeItem('uf_token');
      localStorage.removeItem('uf_refresh');
    },
  };
}
