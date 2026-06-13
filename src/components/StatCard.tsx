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
  success: { accent: '#34C759', bg: 'rgba(52,199,89,0.08)'  },
  warning: { accent: '#FF9F0A', bg: 'rgba(255,159,10,0.08)' },
  error:   { accent: '#FF3B30', bg: 'rgba(255,59,48,0.08)'  },
  info:    { accent: '#007AFF', bg: 'rgba(0,122,255,0.08)'  },
  muted:   { accent: '#6E6E73', bg: 'rgba(110,110,115,0.08)'},
};

export default function StatCard({
  label, value, subValue, status = 'muted', icon, loading = false,
}: StatCardProps) {
  const s = STATUS_STYLES[status];

  if (loading) {
    return (
      <div
        className="rounded-[0.875rem] p-5"
        style={{ background: '#FFFFFF', border: '1px solid #E5E5EA', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
      >
        <div className="animate-pulse space-y-3">
          <div className="h-3 w-20 rounded-full bg-[#E5E5EA]" />
          <div className="h-7 w-28 rounded-full bg-[#E5E5EA]" />
          <div className="h-2 w-16 rounded-full bg-[#F5F5F7]" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-[0.875rem] p-5 flex flex-col gap-3"
      style={{
        background: '#FFFFFF',
        border: '1px solid #E5E5EA',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        transition: 'box-shadow 200ms',
      }}
    >
      <div className="flex items-center justify-between">
        <span style={{ fontSize: 12, fontWeight: 500, color: '#6E6E73', letterSpacing: '0.02em' }}>
          {label}
        </span>
        {icon && (
          <div
            className="flex items-center justify-center w-8 h-8 rounded-[0.625rem]"
            style={{ background: s.bg, color: s.accent }}
          >
            {icon}
          </div>
        )}
      </div>

      <div>
        <p style={{ fontSize: 28, fontWeight: 700, color: s.accent, margin: 0, lineHeight: 1 }}>
          {value}
        </p>
        {subValue && (
          <p style={{ fontSize: 12, color: '#6E6E73', margin: '4px 0 0', lineHeight: 1.4 }}>
            {subValue}
          </p>
        )}
      </div>
    </div>
  );
}
