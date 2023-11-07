import { Profile } from 'pprof-format';

import { ProfileExporter } from './ProfileExporter';
import { Profiler } from './Profiler';

export interface ContinuousProfilerInput {
  profiler: Profiler;
  exporter: ProfileExporter;
  name: string;
  duration: number;
}

export class ContinuousProfiler {
  private readonly profiler: Profiler;
  private readonly exporter: ProfileExporter;
  private readonly duration: number;
  private timer: NodeJS.Timeout | undefined;
  private lastExport: Promise<void> | undefined;

  constructor(input: ContinuousProfilerInput) {
    this.profiler = input.profiler;
    this.exporter = input.exporter;
    this.duration = input.duration;
  }

  public start(): void {
    if (this.timer !== undefined) {
      return;
    }

    this.profiler.start();
    this.scheduleProfilingRound();
  }

  public async stop(): Promise<void> {
    if (this.timer === undefined) {
      return;
    }

    clearTimeout(this.timer);
    this.timer = undefined;

    if (this.lastExport !== undefined) {
      await this.lastExport;
    }

    try {
      const profile: Profile | null = this.profiler.stop();

      if (profile !== null) {
        await this.exporter.export(profile);
      }
    } catch (e: unknown) {
      console.error(
        `failed to capture last profile during stop: ${e as string}`,
      );
    }
  }

  private scheduleProfilingRound() {
    this.timer = setTimeout(() => {
      setImmediate(() => {
        void this.profilingRound();
        this.scheduleProfilingRound();
      });
    }, this.duration);
  }

  private async profilingRound(): Promise<void> {
    const profile: Profile = this.profiler.profile();

    if (this.lastExport === undefined) {
      this.lastExport = this.exporter.export(profile).catch();

      await this.lastExport;
      this.lastExport = undefined;
    }
  }
}
