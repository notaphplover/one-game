export interface PyroscopeConfig {
  applicationName: string;
  authToken?: string;
  samplingDurationMs: number;
  samplingIntervalBytes: number;
  samplingIntervalMs: number;
  serverAddress: string;
  stackDepth: number;
}
