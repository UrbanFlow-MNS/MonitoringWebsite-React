import { useEffect } from 'react';
import { observer } from 'mobx-react';
import { metricsStore } from '../stores/metrics.store.ts';
import {formatMB, formatPercent} from "../lib/formatters.ts";
import {cn} from "../lib/formatters.ts";
import AppShell from "../layout/AppShell.tsx";
import Topbar from "../components/Topbar.tsx";


function ServicesPage() {
  useEffect(() => {
    metricsStore.fetchAll();
  }, []);

  const { services, isLoading } = metricsStore;

  return (
    <AppShell>
      <Topbar title="Services" subtitle="État de chaque microservice BATO" />
      <div className="flex-1 p-8 bg-(--color-subtle)">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {isLoading && services.length === 0
            ? [...Array(6)].map((_, i) => (
                <div key={i} className="rounded-[0.875rem] p-5 animate-pulse bg-white border border-(--color-border) h-40">
                  <div className="h-4 w-24 rounded bg-(--color-border) mb-3" />
                  <div className="h-3 w-16 rounded bg-(--color-subtle) mb-6" />
                  <div className="space-y-3">
                    <div className="h-2 rounded bg-(--color-subtle)" />
                    <div className="h-2 rounded bg-(--color-subtle)" />
                  </div>
                </div>
              ))
            : services.map(s => (
                <div
                  key={s.job}
                  className="rounded-[0.875rem] p-5 flex flex-col gap-4 bg-(--color-bg) border border-(--color-border) shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[15px] font-bold text-(--color-fg) m-0">{s.label}</p>
                      <p className="text-[11px] text-[#AEAEB2] mt-0.5 m-0 font-mono">{s.job}</p>
                    </div>
                    <span
                      className={cn(
                        'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0',
                        s.isUp
                          ? 'bg-[rgba(52,199,89,0.1)] text-[#34C759]'
                          : 'bg-[rgba(255,59,48,0.1)] text-[#FF3B30]',
                      )}
                    >
                      <span
                        className={cn(
                          'w-1.5 h-1.5 rounded-full',
                          s.isUp ? 'bg-[#34C759]' : 'bg-[#FF3B30]',
                        )}
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
                        className="rounded-[0.625rem] px-3 py-2 bg-(--color-subtle)"
                      >
                        <p className="text-[10px] text-[#AEAEB2] m-0 tracking-[0.04em]">{m.label}</p>
                        <p className="text-sm font-semibold text-(--color-fg) m-0">{m.value}</p>
                      </div>
                    ))}
                  </div>

                  {s.lastScrape && (
                    <p className="text-[10px] text-[#AEAEB2] m-0">
                      Dernier scrape : {new Date(s.lastScrape).toLocaleTimeString('fr-FR')}
                      {s.lastError && (
                        <span className="text-(--color-error) ml-2">⚠ {s.lastError}</span>
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
