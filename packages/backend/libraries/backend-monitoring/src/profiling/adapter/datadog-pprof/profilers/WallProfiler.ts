import { time } from '@datadog/pprof';
import { Profile } from 'pprof-format';

import { ProfileExport } from '../modules/ProfileExporter';
import { Profiler } from '../modules/Profiler';

const MICROS_PER_SECOND: number = 1e6;

export interface WallProfilerStartArgs {
  samplingDurationMs: number;
  samplingIntervalMicros: number;
}

export class WallProfiler implements Profiler<WallProfilerStartArgs> {
  #lastProfiledAt: Date;
  #lastSamplingIntervalMicros: number;

  constructor() {
    this.#lastProfiledAt = new Date();
    this.#lastSamplingIntervalMicros = Number.NaN;
  }

  public profile(): ProfileExport {
    return this.#profile(true);
  }

  public start(args: WallProfilerStartArgs): void {
    if (!time.isStarted()) {
      this.#lastProfiledAt = new Date();
      this.#lastSamplingIntervalMicros = args.samplingDurationMs;

      time.start({
        durationMillis: args.samplingDurationMs,
        intervalMicros: args.samplingIntervalMicros,
        withContexts: false,
        workaroundV8Bug: true,
      });
    }
  }

  public stop(): ProfileExport {
    return this.#profile(false);
  }

  #profile(restart: boolean): ProfileExport {
    const profile: Profile = time.stop(restart);

    const lastProfileStartedAt: Date = this.#lastProfiledAt;
    this.#lastProfiledAt = new Date();

    return {
      profile,
      sampleRate: Math.ceil(
        MICROS_PER_SECOND / this.#lastSamplingIntervalMicros,
      ),
      startedAt: lastProfileStartedAt,
      stoppedAt: this.#lastProfiledAt,
    };
  }
}
