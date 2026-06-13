import AppShell from "../layout/AppShell.tsx";
import Topbar from "../components/Topbar.tsx";

export default function LogsPage() {
  return (
    <AppShell>
      <Topbar title="Logs" subtitle="DataLogs — connexions et événements" />
      <div className="flex-1 p-8 flex items-center justify-center" style={{ background: '#F5F5F7' }}>
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-[0.875rem] flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(105,18,226,0.08)' }}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M5 7h18M5 12h14M5 17h16M5 22h10" stroke="#6912E2" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <p style={{ fontWeight: 600, fontSize: 15, color: '#0A0A0A', margin: '0 0 6px' }}>
            Logs — À venir
          </p>
          <p style={{ fontSize: 13, color: '#6E6E73', maxWidth: 280 }}>
            Cette vue affichera les <code>DataLogs</code> du backend (connexions, événements par service).
            Elle nécessite l'exposition des endpoints HTTP REST depuis le microservice monitoring.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
