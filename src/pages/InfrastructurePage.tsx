import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { metricsStore } from '../stores/metrics.store';
import StatCard from "../components/StatCard.tsx";
import AppShell from "../layout/AppShell.tsx";
import Topbar from "../components/Topbar.tsx";
import {formatGB, formatPercent} from "../lib/formatters.ts";
import AreaChartWidget from "../components/AreaChartWidget.tsx";
import Card from "../components/Card.tsx";
import GaugeBar from "../components/GaugeBar.tsx";

const pillActive: React.CSSProperties = {
  background: '#6912E2',
  color: '#FFFFFF',
  borderRadius: 9999,
  fontSize: 12,
  fontWeight: 500,
  padding: '4px 12px',
  border: 'none',
  cursor: 'pointer',
};

const pillInactive: React.CSSProperties = {
  background: '#FFFFFF',
  color: '#6E6E73',
  borderRadius: 9999,
  fontSize: 12,
  fontWeight: 500,
  padding: '4px 12px',
  border: '1px solid #E5E5EA',
  cursor: 'pointer',
};

function InfrastructurePage() {
  const [range, setRange] = useState<'day' | 'week'>('day');

  useEffect(() => {
    metricsStore.startPolling(15_000);
    return () => metricsStore.stopPolling();
  }, []);

  const {
    host,
    hostCpuSeries, hostMemSeries,
    hostCpuDaySeries, hostMemDaySeries,
    hostCpuWeekSeries, hostMemWeekSeries,
    isLoading,
  } = metricsStore;

  const cpuData = range === 'day' ? hostCpuDaySeries : hostCpuWeekSeries;
  const memData = range === 'day' ? hostMemDaySeries : hostMemWeekSeries;
  const cpuTitle = range === 'day' ? 'CPU hôte — dernier jour' : 'CPU hôte — dernière semaine';
  const memTitle = range === 'day' ? 'RAM hôte — dernier jour' : 'RAM hôte — dernière semaine';

  return (
    <AppShell>
      <Topbar title="Infrastructure" subtitle="Métriques serveur physique — node_exporter" />
      <div className="flex-1 p-8 flex flex-col gap-6" style={{ background: '#F5F5F7' }}>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="CPU" value={formatPercent(host.cpuPercent)} status={host.cpuPercent !== null && host.cpuPercent > 90 ? 'error' : host.cpuPercent !== null && host.cpuPercent > 70 ? 'warning' : 'success'} loading={isLoading && host.cpuPercent === null} />
          <StatCard label="RAM utilisée" value={formatPercent(host.memPercent)} subValue={host.memUsedGB !== null ? `${formatGB(host.memUsedGB)} / ${formatGB(host.memTotalGB)}` : undefined} status={host.memPercent !== null && host.memPercent > 90 ? 'error' : host.memPercent !== null && host.memPercent > 75 ? 'warning' : 'success'} loading={isLoading && host.memPercent === null} />
          <StatCard label="Disque /" value={formatPercent(host.diskPercent)} status={host.diskPercent !== null && host.diskPercent > 90 ? 'error' : host.diskPercent !== null && host.diskPercent > 75 ? 'warning' : 'success'} loading={isLoading && host.diskPercent === null} />
          <StatCard label="Réseau in" value={host.netInKBs !== null ? `${host.netInKBs.toFixed(1)} KB/s` : '—'} subValue={host.netOutKBs !== null ? `Out: ${host.netOutKBs.toFixed(1)} KB/s` : undefined} status="info" loading={isLoading && host.netInKBs === null} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AreaChartWidget data={hostCpuSeries} title="CPU hôte — dernière heure" color="#6912E2" format={v => `${v.toFixed(1)}%`} height={200} />
          <AreaChartWidget data={hostMemSeries} title="RAM hôte — dernière heure" color="#007AFF" format={v => `${v.toFixed(1)}%`} height={200} />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span style={{ fontSize: 14, fontWeight: 600, color: '#0A0A0A' }}>Historique</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button style={range === 'day' ? pillActive : pillInactive} onClick={() => setRange('day')}>Jour</button>
              <button style={range === 'week' ? pillActive : pillInactive} onClick={() => setRange('week')}>Semaine</button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AreaChartWidget data={cpuData} title={cpuTitle} color="#6912E2" format={v => `${v.toFixed(1)}%`} height={200} />
            <AreaChartWidget data={memData} title={memTitle} color="#007AFF" format={v => `${v.toFixed(1)}%`} height={200} />
          </div>
        </div>

        <Card title="Utilisation des ressources">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GaugeBar label="CPU" value={host.cpuPercent} warnAt={70} dangerAt={90} format={v => `${v.toFixed(1)}%`} />
            <GaugeBar label="Mémoire" value={host.memPercent} warnAt={75} dangerAt={90} format={v => `${v.toFixed(1)}%`} />
            <GaugeBar label="Disque /" value={host.diskPercent} warnAt={75} dangerAt={90} format={v => `${v.toFixed(1)}%`} />
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

export default observer(InfrastructurePage);
