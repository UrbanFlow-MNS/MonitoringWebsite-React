import AppShell from '../../components/layout/AppShell';
import Topbar from '../../components/layout/Topbar';

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
