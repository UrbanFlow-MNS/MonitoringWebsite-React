import {cn} from "../lib/formatters.ts";
import {STATUS_COLORS, statusColor} from "../lib/statusColorHelper.ts";

interface Props {
  label: string;
  value: number | null;
  max?: number;
  unit?: string;
  warnAt?: number;
  dangerAt?: number;
  format?: (v: number) => string;
}

export default function GaugeBar({
  label, value, max = 100, unit = '%',
  warnAt = 70, dangerAt = 90, format,
}: Props) {
  const pct = value !== null ? Math.min((value / max) * 100, 100) : 0;
  const level = value !== null ? statusColor((value / max) * 100, warnAt, dangerAt) : 'muted';
  const colors = STATUS_COLORS[level];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-(--color-muted)">{label}</span>
        <span className={cn('text-[13px] font-bold', value !== null ? colors.text : 'text-[#AEAEB2]')}>
          {value !== null
            ? (format ? format(value) : `${value.toFixed(1)} ${unit}`)
            : '—'}
        </span>
      </div>
      <div className="rounded-full overflow-hidden h-1.5 bg-(--color-subtle)">
        <div
          className={cn('h-full rounded-full transition-all duration-500', colors.dot)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
