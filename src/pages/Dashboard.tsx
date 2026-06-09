import AppShell from "../layout/AppShell.tsx";
import Topbar from "../components/Topbar.tsx";


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
