export interface PyroscopeConfig {
  applicationName: string;
  authToken?: string;
  samplingDurationMs: number;
  samplingIntervalBytes: number;
  samplingIntervalMicros: number;
  serverAddress: string;
  stackDepth: number;
}
