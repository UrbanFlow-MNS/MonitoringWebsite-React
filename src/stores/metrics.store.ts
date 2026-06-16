import { makeAutoObservable, runInAction } from 'mobx';
import { queryInstant, queryRange, queryTargets, Q } from '../services/prometheus.service';
import type { TimeSeriesPoint } from '../types/monitoring.types';

export interface ServiceStatus {
  job: string;
  label: string;
  isUp: boolean;
  lastError: string;
  lastScrape: string;
  cpuPercent: number | null;
  memMB: number | null;
  heapMB: number | null;
  eventLoopMs: number | null;
}

export interface HostStats {
  cpuPercent: number | null;
  memUsedGB: number | null;
  memTotalGB: number | null;
  memPercent: number | null;
  diskPercent: number | null;
  netInKBs: number | null;
  netOutKBs: number | null;
}

export class MetricsStore {
  services: ServiceStatus[] = [];
  host: HostStats = {
    cpuPercent: null, memUsedGB: null, memTotalGB: null,
    memPercent: null, diskPercent: null, netInKBs: null, netOutKBs: null,
  };

  hostCpuSeries: TimeSeriesPoint[] = [];
  hostMemSeries: TimeSeriesPoint[] = [];
  hostCpuDaySeries: TimeSeriesPoint[] = [];
  hostMemDaySeries: TimeSeriesPoint[] = [];
  hostCpuWeekSeries: TimeSeriesPoint[] = [];
  hostMemWeekSeries: TimeSeriesPoint[] = [];

  isLoading = false;
  error: string | null = null;
  lastUpdated: Date | null = null;

  private timer: ReturnType<typeof setInterval> | null = null;

  constructor() { makeAutoObservable(this); }

  startPolling(ms = 15_000) {
    this.fetchAll();
    this.timer = setInterval(() => this.fetchAll(), ms);
  }

  stopPolling() {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
  }

  async fetchAll() {
    runInAction(() => { this.isLoading = true; this.error = null; });
    try {
      const now = Math.floor(Date.now() / 1000);
      const since = now - 3600;

      const weekStart = now - 7 * 24 * 3600;
      const dayStart = now - 24 * 3600;

      const [
        targets, allCpu, allMem,
        hostCpu, hostMemUsed, hostMemTotal, hostDisk, hostNetIn, hostNetOut,
        hostCpuRange, hostMemRange,
        hostCpuWeekRange, hostMemWeekRange,
        hostCpuDayRange, hostMemDayRange,
      ] = await Promise.allSettled([
        queryTargets(),
        queryInstant(Q.allCpu()),
        queryInstant(Q.allMem()),
        queryInstant(Q.hostCpu()),
        queryInstant(Q.hostMemUsed()),
        queryInstant(Q.hostMemTotal()),
        queryInstant(Q.hostDiskUsed()),
        queryInstant(Q.hostNetIn()),
        queryInstant(Q.hostNetOut()),
        queryRange(Q.hostCpuRange(), since, now, '60s'),
        queryRange(Q.hostMemRange(), since, now, '60s'),
        queryRange(Q.hostCpuRange(), weekStart, now, '1h'),
        queryRange(Q.hostMemRange(), weekStart, now, '1h'),
        queryRange(Q.hostCpuRange(), dayStart, now, '15m'),
        queryRange(Q.hostMemRange(), dayStart, now, '15m'),
      ]);

      runInAction(() => {
        const activeTargets = targets.status === 'fulfilled' ? targets.value.activeTargets : [];
        const cpuMap = this.buildJobMap(allCpu);
        const memMap = this.buildJobMap(allMem);

        this.services = activeTargets.map(t => {
          const job = t.labels.job ?? '';
          const rawLabel = job.replace(/^bato-/, '').replace(/-/g, ' ');
          const label = rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1);
          const cpuRaw = cpuMap[job] != null ? parseFloat(cpuMap[job]!) : null;
          const memRaw = memMap[job] != null ? parseFloat(memMap[job]!) : null;
          return {
            job, label,
            isUp: t.health === 'up',
            lastError: t.lastError,
            lastScrape: t.lastScrape,
            cpuPercent: cpuRaw !== null ? cpuRaw * 100 : null,
            memMB: memRaw !== null ? memRaw / 1_048_576 : null,
            heapMB: null,
            eventLoopMs: null,
          };
        });

        const hCpu      = this.first(hostCpu);
        const hMemUsed  = this.first(hostMemUsed);
        const hMemTotal = this.first(hostMemTotal);
        const hDisk     = this.first(hostDisk);
        const hNetIn    = this.first(hostNetIn);
        const hNetOut   = this.first(hostNetOut);

        this.host = {
          cpuPercent:  hCpu,
          memUsedGB:   hMemUsed  !== null ? hMemUsed  / 1_073_741_824 : null,
          memTotalGB:  hMemTotal !== null ? hMemTotal / 1_073_741_824 : null,
          memPercent:  (hMemUsed !== null && hMemTotal !== null && hMemTotal > 0)
                         ? (hMemUsed / hMemTotal) * 100 : null,
          diskPercent: hDisk   !== null ? hDisk * 100 : null,
          netInKBs:    hNetIn  !== null ? hNetIn  / 1024 : null,
          netOutKBs:   hNetOut !== null ? hNetOut / 1024 : null,
        };

        this.hostCpuSeries = this.toSeries(hostCpuRange);
        this.hostMemSeries = this.toSeries(hostMemRange);
        this.hostCpuDaySeries = this.toSeries(hostCpuDayRange);
        this.hostMemDaySeries = this.toSeries(hostMemDayRange);
        this.hostCpuWeekSeries = this.toSeries(hostCpuWeekRange);
        this.hostMemWeekSeries = this.toSeries(hostMemWeekRange);
        this.lastUpdated = new Date();
        this.isLoading = false;
      });
    } catch (e) {
      runInAction(() => {
        this.error = e instanceof Error ? e.message : 'Erreur inconnue';
        this.isLoading = false;
      });
    }
  }

  get upCount()   { return this.services.filter(s => s.isUp).length; }
  get downCount()  { return this.services.filter(s => !s.isUp).length; }
  get totalCount() { return this.services.length; }

  private buildJobMap(r: PromiseSettledResult<unknown>): Record<string, string | undefined> {
    if (r.status !== 'fulfilled') return {};
    const arr = r.value as { metric: Record<string, string>; value: [number, string] }[];
    return Object.fromEntries(arr.map(x => [x.metric['job'] ?? '', x.value[1]]));
  }

  private first(r: PromiseSettledResult<unknown>): number | null {
    if (r.status !== 'fulfilled') return null;
    const arr = r.value as { value: [number, string] }[];
    if (!arr?.length) return null;
    const v = parseFloat(arr[0].value[1]);
    return isFinite(v) ? v : null;
  }

  private toSeries(r: PromiseSettledResult<unknown>): TimeSeriesPoint[] {
    if (r.status !== 'fulfilled') return [];
    const arr = r.value as { values: [number, string][] }[];
    if (!arr?.length) return [];
    return arr[0].values.map(([ts, v]) => ({ timestamp: ts * 1000, value: parseFloat(v) }));
  }
}

export const metricsStore = new MetricsStore();
