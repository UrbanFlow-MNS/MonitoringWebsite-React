import Sidebar from "../components/Sidebar.tsx";

interface Props {
  children: React.ReactNode;
}

export default function AppShell({ children }: Props) {
  return (
    <div className="flex min-h-screen bg-(--color-subtle)">
      <Sidebar />
      <main className="flex flex-1 min-w-0 flex-col">
        {children}
      </main>
    </div>
  );
}
