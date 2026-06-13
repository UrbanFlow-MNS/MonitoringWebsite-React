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
        <span style={{ fontSize: 12, fontWeight: 500, color: '#6E6E73' }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: value !== null ? colors.text.replace('text-[', '').replace(']', '') : '#AEAEB2' }}>
          {value !== null
            ? (format ? format(value) : `${value.toFixed(1)} ${unit}`)
            : '—'}
        </span>
      </div>
      <div
        className="rounded-full overflow-hidden"
        style={{ height: 6, background: '#F5F5F7' }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: level === 'error' ? '#FF3B30' : level === 'warning' ? '#FF9F0A' : '#34C759',
          }}
        />
      </div>
    </div>
  );
}
