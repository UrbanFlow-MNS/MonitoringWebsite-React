const AUTH_FRONTEND_URL = import.meta.env.VITE_AUTH_URL ?? 'https://auth.urbanflow.lazyy.fr';

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

export function redirectToLogin(): void {
  const redirect = encodeURIComponent(window.location.href);
  window.location.href = `${AUTH_FRONTEND_URL}/login?app=monitoring&redirect=${redirect}`;
}

export function useAuth() {
  return {
    token: getStoredToken(),
    login: redirectToLogin,
    logout: () => {
      localStorage.removeItem('uf_token');
      localStorage.removeItem('uf_refresh');
    },
  };
}
