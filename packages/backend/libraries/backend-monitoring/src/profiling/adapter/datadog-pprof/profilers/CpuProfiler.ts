import { time } from '@datadog/pprof';
import { Profile } from 'pprof-format';

import { Profiler } from '../modules/Profiler';

export class CpuProfiler implements Profiler {
  readonly #samplingDurationMs: number;
  readonly #samplingIntervalMs: number;

  constructor(samplingDurationMs: number, samplingIntervalMs: number) {
    this.#samplingDurationMs = samplingDurationMs;
    this.#samplingIntervalMs = samplingIntervalMs;
  }

  public profile(): Profile {
    return time.stop(true);
  }

  public start(): void {
    if (!time.isStarted()) {
      time.start({
        durationMillis: this.#samplingDurationMs,
        intervalMicros: this.#samplingIntervalMs,
        withContexts: false,
        workaroundV8Bug: true,
      });
    }
  }

  public stop(): Profile {
    return time.stop();
  }
}
