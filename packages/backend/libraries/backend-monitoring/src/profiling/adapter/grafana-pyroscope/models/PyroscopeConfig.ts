export interface PyroscopeConfig {
  applicationName: string;
  authToken?: string;
  flushIntervalMs?: number;
  heap?: PyroscopeHeapConfig;
  serverAddress: string;
  wall?: PyroscopeWallConfig;
}

export interface PyroscopeWallConfig {
  enabled?: boolean;
  samplingDurationMs?: number;
  samplingIntervalMicros?: number;
}

export interface PyroscopeHeapConfig {
  enabled?: boolean;
  samplingIntervalBytes?: number;
  stackDepth?: number;
}
