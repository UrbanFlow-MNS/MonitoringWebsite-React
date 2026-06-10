import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import {formatTimeShort} from "../lib/formatters.ts";
import {TimeSeriesPoint} from "../types/monitoring.types.ts";


interface Props {
  data: TimeSeriesPoint[];
  title: string;
  unit?: string;
  color?: string;
  format?: (v: number) => string;
  height?: number;
}

interface TooltipPayload {
  value: number;
}

function CustomTooltip({
  active, payload, label, unit, format,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: number;
  unit?: string;
  format?: (v: number) => string;
}) {
  if (!active || !payload?.length) return null;
  const v = payload[0].value;
  return (
    <div
      className="rounded-[0.625rem] px-3 py-2"
      style={{
        background: '#FFFFFF',
        border: '1px solid #E5E5EA',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        fontSize: 12,
        fontFamily: 'Outfit, sans-serif',
      }}
    >
      <p style={{ color: '#6E6E73', margin: '0 0 2px' }}>{label ? formatTimeShort(label) : ''}</p>
      <p style={{ color: '#0A0A0A', fontWeight: 600, margin: 0 }}>
        {format ? format(v) : `${v.toFixed(1)}${unit ? ` ${unit}` : ''}`}
      </p>
    </div>
  );
}

export default function AreaChartWidget({
  data, title, unit = '', color = '#6912E2', format, height = 160,
}: Props) {
  const chartData = data.map(d => ({ ts: d.timestamp, v: d.value }));

  return (
    <div
      className="rounded-[0.875rem] p-5"
      style={{ background: '#FFFFFF', border: '1px solid #E5E5EA', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
    >
      <div className="flex items-baseline justify-between mb-4">
        <p style={{ fontWeight: 600, fontSize: 13, color: '#0A0A0A', margin: 0 }}>{title}</p>
        {data.length > 0 && (
          <p style={{ fontSize: 12, color: '#6E6E73', margin: 0 }}>
            {format
              ? format(data[data.length - 1].value)
              : `${data[data.length - 1].value.toFixed(1)} ${unit}`}
          </p>
        )}
      </div>

      {data.length === 0 ? (
        <div
          className="flex items-center justify-center rounded-[0.625rem]"
          style={{ height, background: '#F5F5F7' }}
        >
          <p style={{ fontSize: 12, color: '#AEAEB2' }}>Aucune donnée disponible</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.15} />
                <stop offset="100%" stopColor={color} stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#E5E5EA" strokeDasharray="4 4" vertical={false} />
            <XAxis
              dataKey="ts"
              tickFormatter={formatTimeShort}
              tick={{ fontSize: 10, fill: '#AEAEB2', fontFamily: 'Outfit, sans-serif' }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#AEAEB2', fontFamily: 'Outfit, sans-serif' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => format ? format(v) : `${v.toFixed(0)}`}
            />
            <Tooltip
              content={<CustomTooltip unit={unit} format={format} />}
              cursor={{ stroke: '#E5E5EA', strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="v"
              stroke={color}
              strokeWidth={2}
              fill={`url(#grad-${title})`}
              dot={false}
              activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
