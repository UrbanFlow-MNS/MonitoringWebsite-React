
export interface ExternalApiBody {
  id?: number;
  name: string;
  url: string;
  isActive: boolean;
  version: string;
}

export interface MicroserviceBody {
  id?: number;
  name: string;
  isActive: boolean;
  filePath: string;
}

export interface ServerDatastampBody {
  id?: number;
  serverName: string;
  timestamp: string;
  cpuPercent: number;
  gpuPercent: number;
  ramUsage: number;
  internalTemp: number;
}

export interface DataLogsBody {
  id?: number;
  isApi: boolean;
  targetId: number;
  dateOfData: string;
  numberOfConnection: number;
  event: string;
}

//Prometheus

export interface PrometheusInstantResult {
  metric: Record<string, string>;
  value: [number, string];
}

export interface PrometheusRangeResult {
  metric: Record<string, string>;
  values: [number, string][];
}

export interface TimeSeriesPoint {
  timestamp: number;
  value: number;
}

// Services définis dans prometheus

export const BATO_SERVICES = [
  { job: 'bato-gateway',       label: 'Gateway',       port: 4000 },
  { job: 'bato-auth',          label: 'Auth',          port: 4001 },
  { job: 'bato-logs',          label: 'Logs',          port: 4002 },
  { job: 'bato-trips',         label: 'Trips',         port: 4003 },
  { job: 'bato-monitoring',    label: 'Monitoring',    port: 4005 },
  { job: 'bato-user',          label: 'User',          port: 4006 },
  { job: 'bato-notification',  label: 'Notification',  port: 4007 },
  { job: 'bato-trips-planner', label: 'Trips Planner', port: 4008 },
  { job: 'RabbitMQ',           label: 'RabbitMQ',      port: 15692 },
] as const;
