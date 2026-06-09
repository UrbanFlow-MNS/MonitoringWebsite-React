import AppShell from "../layout/AppShell.tsx";
import Topbar from "../components/Topbar.tsx";

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
