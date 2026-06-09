export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
}

export function formatPercent(v: number | null, decimals = 1): string {
    if (v === null || isNaN(v) || !isFinite(v)) return '—';
    return `${v.toFixed(decimals)}%`;
}

export function formatMB(v: number | null): string {
    if (v === null || isNaN(v)) return '—';
    return `${v.toFixed(0)} MB`;
}

export function formatGB(v: number | null): string {
    if (v === null || isNaN(v)) return '—';
    return `${v.toFixed(1)} GB`;
}

export function formatMs(v: number | null): string {
    if (v === null || isNaN(v)) return '—';
    return `${(v * 1000).toFixed(1)} ms`;
}

export function formatTime(date: Date): string {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function formatTimeShort(ts: number): string {
    return new Date(ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}