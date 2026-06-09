import AppShell from "../layout/AppShell.tsx";
import Topbar from "../components/Topbar.tsx";

export default function InfrastructurePage() {
  return (
    <AppShell>
      <Topbar
        title="Infrastructure"
        subtitle="Métriques serveur physique — node_exporter"
      />
      <div className="flex-1 p-8" style={{ background: '#F5F5F7' }} />
    </AppShell>
  );
}
