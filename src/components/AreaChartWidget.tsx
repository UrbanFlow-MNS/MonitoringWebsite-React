import { useEffect, useRef } from 'react';
import uPlot from 'uplot';
import 'uplot/dist/uPlot.min.css';
import { formatTimeShort } from '../lib/formatters';
import { TimeSeriesPoint } from '../types/monitoring.types';

interface Props {
  data: TimeSeriesPoint[];
  title: string;
  unit?: string;
  color?: string;
  format?: (v: number) => string;
  height?: number;
}

function hexToRgb(hex: string): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

function buildAreaFill(color: string): (self: uPlot) => CanvasGradient {
  return (self: uPlot) => {
    const gradient = self.ctx.createLinearGradient(0, 0, 0, self.height);
    const rgb = hexToRgb(color);
    gradient.addColorStop(0, `rgba(${rgb}, 0.15)`);
    gradient.addColorStop(1, `rgba(${rgb}, 0.01)`);
    return gradient;
  };
}

export default function AreaChartWidget({
  data,
  title,
  unit = '',
  color = '#6912E2',
  format,
  height = 160,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const plotRef = useRef<uPlot | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || data.length === 0) return;

    plotRef.current?.destroy();

    const timestamps = data.map((d) => d.timestamp / 1000);
    const values = data.map((d) => d.value);

    const opts: uPlot.Options = {
      width: el.clientWidth || 300,
      height,
      ms: 1e-3,
      legend: { show: false },
      cursor: {
        x: true,
        y: false,
        points: {
          size: 8,
          fill: color,
          stroke: color,
          width: 0,
        },
      },
      scales: {
        x: { time: true },
        y: { auto: true },
      },
      axes: [
        {
          stroke: '#AEAEB2',
          ticks: { show: false },
          grid: { show: false },
          border: { show: false },
          size: 30,
          font: '10px Outfit, sans-serif',
          values: (_self, ticks) => ticks.map((t) => formatTimeShort(t * 1000)),
        },
        {
          stroke: '#AEAEB2',
          ticks: { show: false },
          grid: {
            stroke: '#E5E5EA',
            width: 1,
            dash: [4, 4],
          },
          border: { show: false },
          size: 40,
          font: '10px Outfit, sans-serif',
          values: (_self, ticks) =>
            ticks.map((t) => (format ? format(t) : `${Number(t).toFixed(0)}`)),
        },
      ],
      series: [
        {},
        {
          stroke: color,
          width: 2,
          fill: buildAreaFill(color),
          points: { show: false },
          paths: uPlot.paths.spline?.() ?? uPlot.paths.linear?.(),
        },
      ],
      hooks: {
        setLegend: [
          (self) => {
            const idx = self.legend.idx;
            if (idx == null) return;
            const ts = self.data[0][idx];
            const v = self.data[1][idx];
            if (ts == null || v == null) return;
            const tooltip = el.querySelector<HTMLElement>('.u-tooltip');
            if (!tooltip) return;
            const formatted = format ? format(v) : `${Number(v).toFixed(1)}${unit ? ` ${unit}` : ''}`;
            tooltip.innerHTML = `
              <p style="color:#6E6E73;margin:0 0 2px;font-size:12px">${formatTimeShort(ts * 1000)}</p>
              <p style="color:#0A0A0A;font-weight:600;margin:0;font-size:12px">${formatted}</p>
            `;
            const cursorLeft = self.cursor.left ?? -1;
            const cursorTop = self.cursor.top ?? -1;
            if (cursorLeft < 0 || cursorTop < 0) {
              tooltip.style.display = 'none';
            } else {
              tooltip.style.display = 'block';
              tooltip.style.left = `${cursorLeft + 12}px`;
              tooltip.style.top = `${cursorTop + 12}px`;
            }
          },
        ],
        setCursor: [
          (self) => {
            const tooltip = el.querySelector<HTMLElement>('.u-tooltip');
            if (!tooltip) return;
            const left = self.cursor.left ?? -1;
            if (left < 0) tooltip.style.display = 'none';
          },
        ],
      },
    };

    const plot = new uPlot(opts, [timestamps, values], el);
    plotRef.current = plot;

    const tooltip = document.createElement('div');
    tooltip.className = 'u-tooltip';
    Object.assign(tooltip.style, {
      position: 'absolute',
      display: 'none',
      background: '#FFFFFF',
      border: '1px solid #E5E5EA',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      borderRadius: '0.625rem',
      padding: '8px 12px',
      fontFamily: 'Outfit, sans-serif',
      pointerEvents: 'none',
      zIndex: '10',
    });
    el.style.position = 'relative';
    el.appendChild(tooltip);

    const resizeObserver = new ResizeObserver(() => {
      plot.setSize({ width: el.clientWidth || 300, height });
    });
    resizeObserver.observe(el);

    return () => {
      resizeObserver.disconnect();
      plot.destroy();
      plotRef.current = null;
    };
  }, [data, color, format, unit, height]);

  const lastValue =
    data.length > 0
      ? format
        ? format(data[data.length - 1].value)
        : `${data[data.length - 1].value.toFixed(1)} ${unit}`
      : null;

  return (
    <div className="rounded-[0.875rem] p-5 bg-(--color-bg) border border-(--color-border) shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
      <div className="flex items-baseline justify-between mb-4">
        <p className="text-[13px] font-semibold text-(--color-fg) m-0">{title}</p>
        {lastValue !== null && (
          <p className="text-xs text-(--color-muted) m-0">{lastValue}</p>
        )}
      </div>

      {data.length === 0 ? (
        <div
          className="flex items-center justify-center rounded-[0.625rem] bg-(--color-subtle)"
          style={{ height }}
        >
          <p className="text-xs text-[#AEAEB2]">Aucune donnée disponible</p>
        </div>
      ) : (
        <div ref={containerRef} className="w-full" />
      )}
    </div>
  );
}
