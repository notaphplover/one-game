import { heap } from '@datadog/pprof';
import { Profile } from 'pprof-format';

import { Profiler } from '../modules/Profiler';

export class MemoryProfiler implements Profiler {
  readonly #samplingIntervalBytes: number;
  readonly #stackDepth: number;

  constructor(samplingIntervalBytes: number, stackDepth: number) {
    this.#samplingIntervalBytes = samplingIntervalBytes;
    this.#stackDepth = stackDepth;
  }

  public profile(): Profile {
    return heap.profile();
  }

  public start(): void {
    heap.start(this.#samplingIntervalBytes, this.#stackDepth);
  }

  public stop(): null {
    heap.stop();

    return null;
  }
}
