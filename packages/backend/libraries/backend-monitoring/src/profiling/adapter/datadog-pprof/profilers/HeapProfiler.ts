import { heap, SourceMapper } from '@datadog/pprof';
import { Profile } from 'pprof-format';

import { ProfileExport } from '../modules/ProfileExporter';
import { Profiler } from '../modules/Profiler';

export interface HeapProfilerStartArgs {
  samplingIntervalBytes: number;
  stackDepth: number;
}

export class HeapProfiler implements Profiler<HeapProfilerStartArgs> {
  #lastProfiledAt: Date;
  readonly #sourceMapper: SourceMapper | undefined;

  constructor(sourceMapper: SourceMapper | undefined) {
    this.#lastProfiledAt = new Date();
    this.#sourceMapper = sourceMapper;
  }

  public profile(): ProfileExport {
    const profile: Profile = heap.profile(undefined, this.#sourceMapper);

    const lastProfileStartedAt: Date = this.#lastProfiledAt;
    this.#lastProfiledAt = new Date();

    return {
      profile,
      startedAt: lastProfileStartedAt,
      stoppedAt: this.#lastProfiledAt,
    };
  }

  public start(args: HeapProfilerStartArgs): void {
    this.#lastProfiledAt = new Date();
    heap.start(args.samplingIntervalBytes, args.stackDepth);
  }

  public stop(): null {
    heap.stop();

    return null;
  }
}
