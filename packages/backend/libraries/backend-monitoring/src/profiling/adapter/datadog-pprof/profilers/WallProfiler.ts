import { SourceMapper, time } from '@datadog/pprof';
import { TimeProfilerOptions } from '@datadog/pprof/out/src/time-profiler';
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
  readonly #sourceMapper: SourceMapper | undefined;

  constructor(sourceMapper: SourceMapper | undefined) {
    this.#lastProfiledAt = new Date();
    this.#lastSamplingIntervalMicros = Number.NaN;
    this.#sourceMapper = sourceMapper;
  }

  public profile(): ProfileExport {
    return this.#profile(true);
  }

  public start(args: WallProfilerStartArgs): void {
    if (!time.isStarted()) {
      this.#lastProfiledAt = new Date();
      this.#lastSamplingIntervalMicros = args.samplingDurationMs;

      const options: TimeProfilerOptions = {
        durationMillis: args.samplingDurationMs,
        intervalMicros: args.samplingIntervalMicros,
        withContexts: false,
        workaroundV8Bug: true,
      };

      if (this.#sourceMapper !== undefined) {
        options.sourceMapper = this.#sourceMapper;
      }

      time.start(options);
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
