import { observer } from 'mobx-react';
import {metricsStore} from "../stores/metrics.store.ts";
import {formatTime} from "../lib/formatters.ts";
import {cn} from "../lib/formatters.ts";

interface Props { title: string; subtitle?: string; }

function Topbar({ title, subtitle }: Props) {
  const { isLoading, lastUpdated, error } = metricsStore;

  return (
    <header className="flex items-center justify-between px-8 h-16 bg-(--color-bg) border-b border-(--color-border) shrink-0">
      <div>
        <h1 className="text-lg font-bold text-(--color-fg) m-0">{title}</h1>
        {subtitle && (
          <p className="text-xs text-(--color-muted) m-0">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {error && (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-(--color-error) bg-[rgba(255,59,48,0.1)]">
            <span className="w-1.5 h-1.5 rounded-full bg-(--color-error)" />
            Prometheus inaccessible
          </span>
        )}

        {lastUpdated && (
          <span className="text-xs text-[#AEAEB2]">
            Mis à jour à {formatTime(lastUpdated)}
          </span>
        )}

        <button
          onClick={() => metricsStore.fetchAll()}
          disabled={isLoading}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-[0.625rem] text-sm font-medium transition-all duration-150 border-none',
            isLoading
              ? 'bg-(--color-subtle) text-(--color-muted) cursor-not-allowed shadow-none'
              : 'bg-(--color-primary) text-white cursor-pointer shadow-[0_1px_4px_rgba(105,18,226,0.3)]',
          )}
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
