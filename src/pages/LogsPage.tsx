import AppShell from "../layout/AppShell.tsx";
import Topbar from "../components/Topbar.tsx";

export default function LogsPage() {
  return (
    <AppShell>
      <Topbar title="Logs" subtitle="DataLogs — connexions et événements" />
      <div className="flex-1 p-8 flex items-center justify-center bg-(--color-subtle)">
        <div className="text-center">
          <div className="w-16 h-16 rounded-[0.875rem] flex items-center justify-center mx-auto mb-4 bg-[rgba(105,18,226,0.08)]">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M5 7h18M5 12h14M5 17h16M5 22h10" stroke="#6912E2" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="text-[15px] font-semibold text-(--color-fg) m-0 mb-1.5">
            Logs — À venir
          </p>
          <p className="text-[13px] text-(--color-muted) max-w-[280px]">
            Cette vue affichera les <code>DataLogs</code> du backend (connexions, événements par service).
            Elle nécessite l'exposition des endpoints HTTP REST depuis le microservice monitoring.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
