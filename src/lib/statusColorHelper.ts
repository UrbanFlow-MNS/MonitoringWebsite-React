

export function statusColor(value: number, warn: number, danger: number): 'success' | 'warning' | 'error' {
  if (value >= danger) return 'error';
  if (value >= warn) return 'warning';
  return 'success';
}

export const STATUS_COLORS = {
  success: { text: 'text-[#34C759]', bg: 'bg-[#34C759]/10', dot: 'bg-[#34C759]', border: 'border-[#34C759]/20' },
  warning: { text: 'text-[#FF9F0A]', bg: 'bg-[#FF9F0A]/10', dot: 'bg-[#FF9F0A]', border: 'border-[#FF9F0A]/20' },
  error:   { text: 'text-[#FF3B30]', bg: 'bg-[#FF3B30]/10', dot: 'bg-[#FF3B30]', border: 'border-[#FF3B30]/20' },
  info:    { text: 'text-[#007AFF]', bg: 'bg-[#007AFF]/10', dot: 'bg-[#007AFF]', border: 'border-[#007AFF]/20' },
  muted:   { text: 'text-[#6E6E73]', bg: 'bg-[#6E6E73]/10', dot: 'bg-[#6E6E73]', border: 'border-[#6E6E73]/20' },
  primary: { text: 'text-[#6912E2]', bg: 'bg-[#6912E2]/10', dot: 'bg-[#6912E2]', border: 'border-[#6912E2]/20' },
} as const;
