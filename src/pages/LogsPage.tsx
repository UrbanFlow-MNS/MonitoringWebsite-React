import AppShell from '../../components/layout/AppShell';
import Topbar from '../../components/layout/Topbar';

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
