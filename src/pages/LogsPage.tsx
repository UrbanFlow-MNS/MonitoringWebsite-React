import AppShell from "../layout/AppShell.tsx";
import Topbar from "../components/Topbar.tsx";

export default function LogsPage() {
  return (
    <AppShell>
      <Topbar
        title="Logs"
        subtitle="DataLogs — connexions et événements"
      />
      <div className="flex-1 p-8" style={{ background: '#F5F5F7' }} />
    </AppShell>
  );
}
