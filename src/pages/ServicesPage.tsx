import AppShell from '../../components/layout/AppShell';
import Topbar from '../../components/layout/Topbar';

export default function ServicesPage() {
  return (
    <AppShell>
      <Topbar
        title="Services"
        subtitle="État de chaque microservice BATO"
      />
      <div className="flex-1 p-8" style={{ background: '#F5F5F7' }} />
    </AppShell>
  );
}
