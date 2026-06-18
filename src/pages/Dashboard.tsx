import { useEffect } from 'react';
import { observer } from 'mobx-react';
import { metricsStore } from '../stores/metrics.store';
import {statusColor} from "../lib/statusColorHelper.ts";
import {cn} from "../lib/formatters.ts";
import AppShell from "../layout/AppShell.tsx";
import Topbar from "../components/Topbar.tsx";
import StatCard from "../components/StatCard.tsx";
import {formatGB, formatPercent} from "../lib/formatters.ts";
import AreaChartWidget from "../components/AreaChartWidget.tsx";
import Card from "../components/Card.tsx";
import GaugeBar from "../components/GaugeBar.tsx";
import ServiceRow from "../components/ServiceRow.tsx";


function Dashboard() {
  useEffect(() => {
    metricsStore.fetchAll();
  }, []);

  const { host, services, hostCpuSeries, hostMemSeries, isLoading, error, upCount, downCount, totalCount } = metricsStore;

  const overallStatus = downCount > 0 ? 'error' : upCount === totalCount && totalCount > 0 ? 'success' : 'warning';

  return (
    <AppShell>
      <Topbar
        title="Vue d'ensemble"
        subtitle="Surveillance en temps réel"
      />

      <div className="flex-1 p-8 flex flex-col gap-6 bg-(--color-subtle)">

        {error && (
          <div className="flex items-center gap-3 px-5 py-4 rounded-[0.875rem] text-sm bg-[rgba(255,59,48,0.06)] border border-[rgba(255,59,48,0.2)] text-(--color-error)">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="#FF3B30" strokeWidth="1.5"/>
              <path d="M8 5v3.5M8 11h.01" stroke="#FF3B30" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>
              <strong>Impossible de contacter Prometheus :</strong> {error} —
              Vérifiez que <code className="px-1 py-0.5 rounded bg-red-50 text-xs">VITE_PROMETHEUS_URL</code> est correct et que le CORS est activé.
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Services actifs"
            value={isLoading ? '…' : `${upCount} / ${totalCount}`}
            subValue={downCount > 0 ? `${downCount} en erreur` : 'Tous opérationnels'}
            status={overallStatus}
            loading={isLoading && services.length === 0}
            icon={
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="8" cy="8" r="2" fill="currentColor"/>
              </svg>
            }
          />
          <StatCard
            label="CPU hôte"
            value={formatPercent(host.cpuPercent)}
            subValue="node_exporter"
            status={host.cpuPercent !== null ? statusColor(host.cpuPercent, 70, 90) : 'muted'}
            loading={isLoading && host.cpuPercent === null}
            icon={
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="3" y="3" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="5.5" y="5.5" width="5" height="5" rx="0.5" fill="currentColor" opacity=".5"/>
              </svg>
            }
          />
          <StatCard
            label="RAM hôte"
            value={formatPercent(host.memPercent)}
            subValue={host.memUsedGB !== null && host.memTotalGB !== null
              ? `${formatGB(host.memUsedGB)} / ${formatGB(host.memTotalGB)}` : undefined}
            status={host.memPercent !== null ? statusColor(host.memPercent, 75, 90) : 'muted'}
            loading={isLoading && host.memPercent === null}
            icon={
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="5" width="14" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="4" y1="5" x2="4" y2="11" stroke="currentColor" strokeWidth="1" opacity=".4"/>
                <line x1="8" y1="5" x2="8" y2="11" stroke="currentColor" strokeWidth="1" opacity=".4"/>
                <line x1="12" y1="5" x2="12" y2="11" stroke="currentColor" strokeWidth="1" opacity=".4"/>
              </svg>
            }
          />
          <StatCard
            label="Disque utilisé"
            value={formatPercent(host.diskPercent)}
            subValue="Partition /"
            status={host.diskPercent !== null ? statusColor(host.diskPercent, 75, 90) : 'muted'}
            loading={isLoading && host.diskPercent === null}
            icon={
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 4v4l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            }
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AreaChartWidget
            data={hostCpuSeries}
            title="CPU hôte (1h)"
            color="#6912E2"
            format={v => `${v.toFixed(1)}%`}
          />
          <AreaChartWidget
            data={hostMemSeries}
            title="RAM hôte (1h)"
            color="#007AFF"
            format={v => `${v.toFixed(1)}%`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card title="Infrastructure">
            <div className="flex flex-col gap-4">
              <GaugeBar
                label="CPU"
                value={host.cpuPercent}
                warnAt={70} dangerAt={90}
                format={v => `${v.toFixed(1)}%`}
              />
              <GaugeBar
                label="Mémoire"
                value={host.memPercent}
                warnAt={75} dangerAt={90}
                format={v => `${v.toFixed(1)}%`}
              />
              <GaugeBar
                label="Disque"
                value={host.diskPercent}
                warnAt={75} dangerAt={90}
                format={v => `${v.toFixed(1)}%`}
              />
              {host.netInKBs !== null && (
                <div className="pt-2 border-t border-(--color-border)">
                  <div className="flex justify-between text-xs text-(--color-muted)">
                    <span>Réseau ↓</span>
                    <span className="font-semibold text-(--color-fg)">
                      {host.netInKBs.toFixed(1)} KB/s
                    </span>
                  </div>
                  <div className="flex justify-between text-xs mt-1 text-(--color-muted)">
                    <span>Réseau ↑</span>
                    <span className="font-semibold text-(--color-fg)">
                      {host.netOutKBs?.toFixed(1) ?? '—'} KB/s
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <div className="lg:col-span-2">
            <Card
              title="Services BATO"
              noPadding
              action={
                <span
                  className={cn(
                    'px-2.5 py-1 rounded-full text-xs font-medium',
                    overallStatus === 'success'
                      ? 'bg-[rgba(52,199,89,0.1)] text-[#34C759]'
                      : 'bg-[rgba(255,59,48,0.1)] text-[#FF3B30]',
                  )}
                >
                  {upCount}/{totalCount} actifs
                </span>
              }
            >
              {isLoading && services.length === 0 ? (
                <div className="px-4 py-8 flex flex-col gap-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-(--color-subtle)" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-32 rounded bg-(--color-border)" />
                        <div className="h-2 w-20 rounded bg-(--color-subtle)" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : services.length === 0 ? (
                <div className="px-4 py-12 flex flex-col items-center gap-2">
                  <p className="text-[13px] text-(--color-muted)">Aucun service détecté</p>
                  <p className="text-xs text-[#AEAEB2]">Vérifiez la connexion Prometheus</p>
                </div>
              ) : (
                <div className="divide-y divide-(--color-border)">
                  {services.map(s => (
                    <ServiceRow key={s.job} service={s} />
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default observer(Dashboard);
