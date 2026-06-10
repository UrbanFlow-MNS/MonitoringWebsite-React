import {ServiceStatus} from "../stores/metrics.store.ts";
import {formatMB, formatPercent} from "../lib/formatters.ts";


interface Props {
  service: ServiceStatus;
}

export default function ServiceRow({ service }: Props) {
  const { label, isUp, cpuPercent, memMB, eventLoopMs } = service;

  return (
    <div
      className="flex items-center gap-4 px-4 py-3 rounded-[0.625rem] transition-colors duration-150 hover:bg-[#F5F5F7]"
      style={{ minHeight: 52 }}
    >
      <div className="flex-shrink-0 flex items-center justify-center" style={{ width: 32 }}>
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{
            background: isUp ? '#34C759' : '#FF3B30',
            boxShadow: isUp
              ? '0 0 0 3px rgba(52,199,89,0.15)'
              : '0 0 0 3px rgba(255,59,48,0.15)',
          }}
        />
      </div>

      <div style={{ flex: '0 0 140px' }}>
        <p style={{ fontWeight: 600, fontSize: 13, color: '#0A0A0A', margin: 0 }}>{label}</p>
        <p style={{ fontSize: 11, color: '#AEAEB2', margin: 0 }}>
          {isUp ? 'En ligne' : 'Hors ligne'}
        </p>
      </div>

      <div className="flex-1 flex items-center gap-6">
        <Metric label="CPU" value={cpuPercent !== null ? formatPercent(cpuPercent) : '—'} warn={cpuPercent !== null && cpuPercent > 70} />
        <Metric label="Mémoire" value={memMB !== null ? formatMB(memMB) : '—'} warn={memMB !== null && memMB > 400} />
        <Metric label="Event Loop" value={eventLoopMs !== null ? `${(eventLoopMs * 1000).toFixed(1)} ms` : '—'} warn={eventLoopMs !== null && eventLoopMs * 1000 > 50} />
      </div>

      <span
        className="flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-medium"
        style={{
          background: isUp ? 'rgba(52,199,89,0.1)' : 'rgba(255,59,48,0.1)',
          color: isUp ? '#34C759' : '#FF3B30',
        }}
      >
        {isUp ? '● Actif' : '● Inactif'}
      </span>
    </div>
  );
}

function Metric({ label, value, warn }: { label: string; value: string; warn: boolean }) {
  return (
    <div style={{ minWidth: 72 }}>
      <p style={{ fontSize: 10, color: '#AEAEB2', margin: 0, letterSpacing: '0.04em' }}>{label}</p>
      <p style={{ fontSize: 13, fontWeight: 600, color: warn ? '#FF9F0A' : '#0A0A0A', margin: 0 }}>
        {value}
      </p>
    </div>
  );
}
