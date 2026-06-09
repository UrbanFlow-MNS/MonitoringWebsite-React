import { observer } from 'mobx-react';
import { metricsStore } from '../../stores/metrics.store';
import { formatTime } from '../../lib/utils';

interface Props { title: string; subtitle?: string; }

function Topbar({ title, subtitle }: Props) {
  const { isLoading, lastUpdated, error } = metricsStore;

  return (
    <header
      className="flex items-center justify-between px-8"
      style={{
        height: 64,
        background: '#FFFFFF',
        borderBottom: '1px solid #E5E5EA',
        flexShrink: 0,
      }}
    >
      <div>
        <h1 style={{ fontWeight: 700, fontSize: 18, color: '#0A0A0A', margin: 0 }}>{title}</h1>
        {subtitle && (
          <p style={{ fontSize: 12, color: '#6E6E73', margin: 0 }}>{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {error && (
          <span
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
            style={{ background: '#FF3B30/10', color: '#FF3B30', background: 'rgba(255,59,48,0.1)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30]" />
            Prometheus inaccessible
          </span>
        )}

        {lastUpdated && (
          <span style={{ fontSize: 12, color: '#AEAEB2' }}>
            Mis à jour à {formatTime(lastUpdated)}
          </span>
        )}

        <button
          onClick={() => metricsStore.fetchAll()}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-[0.625rem] text-sm font-medium transition-all duration-150"
          style={{
            background: isLoading ? '#F5F5F7' : '#6912E2',
            color: isLoading ? '#6E6E73' : '#FFFFFF',
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            boxShadow: isLoading ? 'none' : '0 1px 4px rgba(105,18,226,0.3)',
          }}
        >
          <svg
            width="14" height="14" viewBox="0 0 14 14" fill="none"
            className={isLoading ? 'animate-spin' : ''}
          >
            <path
              d="M12 7A5 5 0 1 1 7 2v2M7 2l2-2M7 2 5 0"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
          {isLoading ? 'Chargement…' : 'Actualiser'}
        </button>
      </div>
    </header>
  );
}

export default observer(Topbar);
