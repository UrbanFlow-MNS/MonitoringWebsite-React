import AppShell from '../../components/layout/AppShell';
import Topbar from '../../components/layout/Topbar';

export default function Dashboard() {
  return (
    <AppShell>
      <Topbar
        title="Vue d'ensemble"
        subtitle="Surveillance en temps réel — rafraîchissement toutes les 15s"
      />
      <div className="flex-1 p-8" style={{ background: '#F5F5F7' }} />
    </AppShell>
  );
}
