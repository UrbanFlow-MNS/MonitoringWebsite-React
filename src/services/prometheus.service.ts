import axios from 'axios';
import type { PrometheusInstantResult, PrometheusRangeResult } from '../types/monitoring.types';

const PROMETHEUS_BASE_URL = import.meta.env.PROMETHEUS_URL ?? 'http://localhost:9090';

const api = axios.create({ baseURL: PROMETHEUS_BASE_URL });

export async function queryInstant(promql: string): Promise<PrometheusInstantResult[]> {
  const { data } = await api.get('/api/v1/query', { params: { query: promql } });
  if (data.status !== 'success') throw new Error(data.error ?? 'Prometheus error');
  return data.data.result as PrometheusInstantResult[];
}

export async function queryRange(
  promql: string,
  start: number,
  end: number,
  step = '60s',
): Promise<PrometheusRangeResult[]> {
  const { data } = await api.get('/api/v1/query_range', {
    params: { query: promql, start, end, step },
  });
  if (data.status !== 'success') throw new Error(data.error ?? 'Prometheus error');
  return data.data.result as PrometheusRangeResult[];
}

export async function queryTargets(): Promise<{
  activeTargets: {
    labels: Record<string, string>;
    health: 'up' | 'down' | 'unknown';
    lastError: string;
    lastScrape: string;
    scrapeUrl: string;
  }[];
}> {
  const { data } = await api.get('/api/v1/targets');
  if (data.status !== 'success') throw new Error(data.error ?? 'Prometheus error');
  return data.data;
}

export const Q = {
  allUp:          () => `up`,
  serviceUp:      (job: string) => `up{job="${job}"}`,

  memRSS:         (job: string) => `process_resident_memory_bytes{job="${job}"}`,
  cpuRate:        (job: string) => `rate(process_cpu_seconds_total{job="${job}"}[1m])`,
  heapUsed:       (job: string) => `nodejs_heap_size_used_bytes{job="${job}"}`,
  heapTotal:      (job: string) => `nodejs_heap_size_total_bytes{job="${job}"}`,
  eventLoop:      (job: string) => `nodejs_eventloop_lag_seconds{job="${job}"}`,
  activeHandles:  (job: string) => `nodejs_active_handles_total{job="${job}"}`,

  allMem:         () => `process_resident_memory_bytes`,
  allCpu:         () => `rate(process_cpu_seconds_total[1m])`,

  // Host machine
  hostCpu:        () => `100 - (avg by(instance)(rate(node_cpu_seconds_total{mode="idle"}[1m])) * 100)`,
  hostMemUsed:    () => `node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes`,
  hostMemTotal:   () => `node_memory_MemTotal_bytes`,
  hostDiskUsed:   () => `1 - (node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"})`,
  hostNetIn:      () => `sum(rate(node_network_receive_bytes_total{device!="lo"}[1m]))`,
  hostNetOut:     () => `sum(rate(node_network_transmit_bytes_total{device!="lo"}[1m]))`,

  // Ranges
  hostCpuRange:   () => `100 - (avg by(instance)(rate(node_cpu_seconds_total{mode="idle"}[1m])) * 100)`,
  hostMemRange:   () => `(node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes * 100`,
  heapRange:      (job: string) => `nodejs_heap_size_used_bytes{job="${job}"}`,
  cpuRange:       (job: string) => `rate(process_cpu_seconds_total{job="${job}"}[1m]) * 100`,
};
