import type { ReactNode } from 'react';
import { consumeAuthHash, getStoredToken, redirectToLogin } from '@/hooks/useAuth';

interface AuthGateProps {
  children: ReactNode;
}

export default function AuthGate({ children }: AuthGateProps) {
  consumeAuthHash();
  const token = getStoredToken();

  if (!token) {
    redirectToLogin();
    return null;
  }

  return <>{children}</>;
}
