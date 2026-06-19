import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { consumeAuthHash, getStoredRole, getStoredToken, redirectToLogin, useAuth } from '@/hooks/useAuth';

interface AuthGateProps {
  children: ReactNode;
}

function AccessDenied() {
  const { t } = useTranslation('auth');
  const { logout, login } = useAuth();

  function handleLogout() {
    logout();
    login();
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-(--color-bg) px-6 text-center">
      <h1 className="text-xl font-semibold text-(--color-fg)">{t('access_denied.title')}</h1>
      <p className="max-w-md text-sm text-(--color-muted)">{t('access_denied.description')}</p>
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-[0.625rem] bg-(--color-error) px-4 py-2 text-sm font-medium text-white"
      >
        {t('access_denied.logout_action')}
      </button>
    </div>
  );
}

export default function AuthGate({ children }: AuthGateProps) {
  consumeAuthHash();
  const token = getStoredToken();

  if (!token) {
    redirectToLogin();
    return null;
  }

  const role = getStoredRole();
  if (role !== 'SUPERADMIN') {
    return <AccessDenied />;
  }

  return <>{children}</>;
}
