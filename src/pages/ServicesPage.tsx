import { useEffect } from 'react';
import { observer } from 'mobx-react';
import Topbar from "../components/Topbar.tsx";
import {metricsStore} from "../stores/metrics.store.ts";
import AppShell from "../layout/AppShell.tsx";
import {formatMB, formatPercent} from "../lib/formatters.ts";


function ServicesPage() {
  useEffect(() => {
    metricsStore.startPolling(15_000);
    return () => metricsStore.stopPolling();
  }, []);

  const { services, isLoading } = metricsStore;

  return (
    <AppShell>
      <Topbar title="Services" subtitle="État de chaque microservice BATO" />
      <div className="flex-1 p-8" style={{ background: '#F5F5F7' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {isLoading && services.length === 0
            ? [...Array(6)].map((_, i) => (
                <div key={i} className="rounded-[0.875rem] p-5 animate-pulse" style={{ background: '#fff', border: '1px solid #E5E5EA', height: 160 }}>
                  <div className="h-4 w-24 rounded bg-[#E5E5EA] mb-3" />
                  <div className="h-3 w-16 rounded bg-[#F5F5F7] mb-6" />
                  <div className="space-y-3">
                    <div className="h-2 rounded bg-[#F5F5F7]" />
                    <div className="h-2 rounded bg-[#F5F5F7]" />
                  </div>
                </div>
              ))
            : services.map(s => (
                <div
                  key={s.job}
                  className="rounded-[0.875rem] p-5 flex flex-col gap-4"
                  style={{ background: '#FFFFFF', border: '1px solid #E5E5EA', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 15, color: '#0A0A0A', margin: 0 }}>{s.label}</p>
                      <p style={{ fontSize: 11, color: '#AEAEB2', margin: '2px 0 0', fontFamily: 'monospace' }}>{s.job}</p>
                    </div>
                    <span
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: s.isUp ? 'rgba(52,199,89,0.1)' : 'rgba(255,59,48,0.1)',
                        color: s.isUp ? '#34C759' : '#FF3B30',
                        flexShrink: 0,
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: s.isUp ? '#34C759' : '#FF3B30' }}
                      />
                      {s.isUp ? 'Actif' : 'Inactif'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'CPU', value: s.cpuPercent !== null ? formatPercent(s.cpuPercent) : '—' },
                      { label: 'Mémoire RSS', value: s.memMB !== null ? formatMB(s.memMB) : '—' },
                      { label: 'Heap', value: s.heapMB !== null ? formatMB(s.heapMB) : '—' },
                      { label: 'Event Loop', value: s.eventLoopMs !== null ? `${(s.eventLoopMs * 1000).toFixed(1)} ms` : '—' },
                    ].map(m => (
                      <div
                        key={m.label}
                        className="rounded-[0.625rem] px-3 py-2"
                        style={{ background: '#F5F5F7' }}
                      >
                        <p style={{ fontSize: 10, color: '#AEAEB2', margin: 0, letterSpacing: '0.04em' }}>{m.label}</p>
                        <p style={{ fontSize: 14, fontWeight: 600, color: '#0A0A0A', margin: 0 }}>{m.value}</p>
                      </div>
                    ))}
                  </div>

                  {s.lastScrape && (
                    <p style={{ fontSize: 10, color: '#AEAEB2', margin: 0 }}>
                      Dernier scrape : {new Date(s.lastScrape).toLocaleTimeString('fr-FR')}
                      {s.lastError && (
                        <span style={{ color: '#FF3B30', marginLeft: 8 }}>⚠ {s.lastError}</span>
                      )}
                    </p>
                  )}
                </div>
              ))}
        </div>
      </div>
    </AppShell>
  );
}

export default observer(ServicesPage);
