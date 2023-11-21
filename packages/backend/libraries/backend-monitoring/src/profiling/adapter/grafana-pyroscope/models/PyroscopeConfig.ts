export interface PyroscopeConfig {
  applicationName: string;
  authToken?: string;
  flushIntervalMs?: number;
  heap?: PyroscopeHeapConfig;
  serverAddress: string;
  sourceMap?: PyroscopeSourceMapConfig;
  wall?: PyroscopeWallConfig;
}

export interface PyroscopeHeapConfig {
  enabled?: boolean;
  samplingIntervalBytes?: number;
  stackDepth?: number;
}

export interface PyroscopeSourceMapConfig {
  searchDirectories: string[];
}

export interface PyroscopeWallConfig {
  enabled?: boolean;
  samplingDurationMs?: number;
  samplingIntervalMicros?: number;
}
