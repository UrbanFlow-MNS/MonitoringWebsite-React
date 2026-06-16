import { cn, formatMB, formatPercent } from "../lib/formatters";
import { ServiceStatus } from "../stores/metrics.store";

interface Props {
  service: ServiceStatus;
}

export default function ServiceRow({ service }: Props) {
  const { label, isUp, cpuPercent, memMB, eventLoopMs } = service;

  return (
    <div className="flex min-h-13 items-center gap-4 rounded-[0.625rem] px-4 py-3 transition-colors duration-150 hover:bg-(--color-subtle)">
      <div className="flex w-8 shrink-0 items-center justify-center">
        <span
          className={cn(
            "h-2.5 w-2.5 rounded-full",
            isUp
              ? "bg-(--color-success) shadow-[0_0_0_3px_rgba(52,199,89,0.15)]"
              : "bg-(--color-error) shadow-[0_0_0_3px_rgba(255,59,48,0.15)]"
          )}
        />
      </div>

      <div className="w-35 shrink-0">
        <p className="m-0 text-[13px] font-semibold text-(--color-fg)">{label}</p>
        <p className="m-0 text-[11px] text-[#AEAEB2]">
          {isUp ? "En ligne" : "Hors ligne"}
        </p>
      </div>

      <div className="flex flex-1 items-center gap-6">
        <Metric
          label="CPU"
          value={cpuPercent !== null ? formatPercent(cpuPercent) : "—"}
          warn={cpuPercent !== null && cpuPercent > 70}
        />
        <Metric
          label="Mémoire"
          value={memMB !== null ? formatMB(memMB) : "—"}
          warn={memMB !== null && memMB > 400}
        />
        <Metric
          label="Event Loop"
          value={eventLoopMs !== null ? `${(eventLoopMs * 1000).toFixed(1)} ms` : "—"}
          warn={eventLoopMs !== null && eventLoopMs * 1000 > 50}
        />
      </div>

      <span
        className={cn(
          "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
          isUp
            ? "bg-[rgba(52,199,89,0.1)] text-(--color-success)"
            : "bg-[rgba(255,59,48,0.1)] text-(--color-error)"
        )}
      >
        {isUp ? "● Actif" : "● Inactif"}
      </span>
    </div>
  );
}

interface MetricProps {
  label: string;
  value: string;
  warn: boolean;
}

function Metric({ label, value, warn }: MetricProps) {
  return (
    <div className="min-w-18">
      <p className="m-0 text-[10px] tracking-[0.04em] text-[#AEAEB2]">{label}</p>
      <p
        className={cn(
          "m-0 text-[13px] font-semibold",
          warn ? "text-(--color-warning)" : "text-(--color-fg)"
        )}
      >
        {value}
      </p>
    </div>
  );
}
