import { NavLink } from 'react-router-dom';
import {cn} from "../lib/formatters.ts";

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
  return (
    <aside
      className="flex flex-col"
      style={{
        width: 232,
        minHeight: '100vh',
        background: '#FFFFFF',
        borderRight: '1px solid #E5E5EA',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-5"
        style={{ height: 64, borderBottom: '1px solid #E5E5EA' }}
      >
        <img src="/logo.png" alt="UrbanFlow" style={{ width: 32, height: 32, objectFit: 'contain' }} />
        <div>
          <p style={{ fontWeight: 700, fontSize: 15, color: '#0A0A0A', margin: 0, lineHeight: 1.2 }}>
            UrbanFlow
          </p>
          <p style={{ fontSize: 11, color: '#6E6E73', margin: 0, letterSpacing: '0.04em' }}>
            MONITORING
          </p>
        </div>
      </div>

      {/* Nav */}
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
                  : 'text-[#6E6E73] hover:bg-[#F5F5F7] hover:text-[#0A0A0A]',
              )
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div
        className="px-5 py-4"
        style={{ borderTop: '1px solid #E5E5EA' }}
      >
        <p style={{ fontSize: 11, color: '#AEAEB2', margin: 0 }}>
          v1.0 · Prometheus
        </p>
      </div>
    </aside>
  );
}
