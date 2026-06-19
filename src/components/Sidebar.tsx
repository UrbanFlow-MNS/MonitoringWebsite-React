import { NavLink } from 'react-router-dom';
import {cn} from "../lib/formatters.ts";
import { useAuth } from '../hooks/useAuth';

const NAV = [
  {
    to: '/dashboard',
    label: 'Vue d\'ensemble',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1" y="1" width="7" height="7" rx="1.5" fill="currentColor" opacity=".9"/>
        <rect x="10" y="1" width="7" height="7" rx="1.5" fill="currentColor" opacity=".4"/>
        <rect x="1" y="10" width="7" height="7" rx="1.5" fill="currentColor" opacity=".4"/>
        <rect x="10" y="10" width="7" height="7" rx="1.5" fill="currentColor" opacity=".4"/>
      </svg>
    ),
  },
  {
    to: '/services',
    label: 'Services',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="9" cy="9" r="2.5" fill="currentColor"/>
        <line x1="9" y1="1.5" x2="9" y2="4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="9" y1="13.5" x2="9" y2="16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="1.5" y1="9" x2="4.5" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="13.5" y1="9" x2="16.5" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    to: '/infrastructure',
    label: 'Infrastructure',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1" y="5" width="16" height="3" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="1" y="10" width="16" height="3" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="14" cy="6.5" r="0.75" fill="currentColor"/>
        <circle cx="14" cy="11.5" r="0.75" fill="currentColor"/>
      </svg>
    ),
  },
  {
    to: '/logs',
    label: 'Logs',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3 4h12M3 7h9M3 10h11M3 13h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function Sidebar() {
  const { logout, login } = useAuth();

  function handleLogout() {
    logout();
    login();
  }

  return (
    <aside className="flex flex-col w-[232px] min-h-screen bg-(--color-bg) border-r border-(--color-border) shrink-0">
      <div className="flex items-center gap-3 px-5 h-16 border-b border-(--color-border)">
        <img src="/logo.png" alt="UrbanFlow" className="w-8 h-8 object-cover rounded-lg" />
        <div>
          <p className="font-bold text-[15px] text-(--color-fg) m-0 leading-[1.2]">
            UrbanFlow
          </p>
          <p className="text-[11px] text-(--color-muted) m-0 tracking-[0.04em]">
            MONITORING
          </p>
        </div>
      </div>

      <nav className="flex flex-col gap-1 p-3 flex-1">
        {NAV.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-[0.625rem] text-sm font-medium transition-all duration-150 select-none',
                isActive
                  ? 'bg-[#6912E2]/10 text-[#6912E2]'
                  : 'text-(--color-muted) hover:bg-(--color-subtle) hover:text-(--color-fg)',
              )
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-(--color-border)">
        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            'flex w-full items-center gap-3 px-3 py-2.5 rounded-[0.625rem] text-sm font-medium transition-all duration-150 select-none',
            'text-(--color-muted) hover:bg-(--color-subtle) hover:text-(--color-fg)',
          )}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M7 1.5H3a1.5 1.5 0 0 0-1.5 1.5v12A1.5 1.5 0 0 0 3 16.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 12.5 16.5 9 12 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="16.5" y1="9" x2="6.5" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Se déconnecter
        </button>
        <p className="text-[11px] text-[#AEAEB2] m-0 mt-3">
          v1.0 · Prometheus
        </p>
      </div>
    </aside>
  );
}
