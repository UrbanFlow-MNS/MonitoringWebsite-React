import {cn} from "../lib/formatters.ts";

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  status?: 'success' | 'warning' | 'error' | 'info' | 'muted';
  icon?: React.ReactNode;
  loading?: boolean;
}

const STATUS_STYLES = {
  success: { iconBg: 'bg-[rgba(52,199,89,0.08)]',   iconColor: 'text-[#34C759]', valueColor: 'text-[#34C759]' },
  warning: { iconBg: 'bg-[rgba(255,159,10,0.08)]',  iconColor: 'text-[#FF9F0A]', valueColor: 'text-[#FF9F0A]' },
  error:   { iconBg: 'bg-[rgba(255,59,48,0.08)]',   iconColor: 'text-[#FF3B30]', valueColor: 'text-[#FF3B30]' },
  info:    { iconBg: 'bg-[rgba(0,122,255,0.08)]',   iconColor: 'text-[#007AFF]', valueColor: 'text-[#007AFF]' },
  muted:   { iconBg: 'bg-[rgba(110,110,115,0.08)]', iconColor: 'text-[#6E6E73]', valueColor: 'text-[#6E6E73]' },
};

export default function StatCard({
  label, value, subValue, status = 'muted', icon, loading = false,
}: StatCardProps) {
  const s = STATUS_STYLES[status];

  if (loading) {
    return (
      <div className="rounded-[0.875rem] p-5 bg-(--color-bg) border border-(--color-border) shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
        <div className="animate-pulse space-y-3">
          <div className="h-3 w-20 rounded-full bg-(--color-border)" />
          <div className="h-7 w-28 rounded-full bg-(--color-border)" />
          <div className="h-2 w-16 rounded-full bg-(--color-subtle)" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[0.875rem] p-5 flex flex-col gap-3 bg-(--color-bg) border border-(--color-border) shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-(--color-muted) tracking-[0.02em]">
          {label}
        </span>
        {icon && (
          <div className={cn('flex items-center justify-center w-8 h-8 rounded-[0.625rem]', s.iconBg, s.iconColor)}>
            {icon}
          </div>
        )}
      </div>

      <div>
        <p className={cn('text-[28px] font-bold m-0 leading-none', s.valueColor)}>
          {value}
        </p>
        {subValue && (
          <p className="text-xs text-(--color-muted) mt-1 leading-[1.4] m-0">
            {subValue}
          </p>
        )}
      </div>
    </div>
  );
}
