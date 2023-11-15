import { ProfileExport, ProfileExporter } from './ProfileExporter';
import { Profiler } from './Profiler';

export interface ContinuousProfilerInput<TStartArgs> {
  exporter: ProfileExporter;
  flushIntervalMs: number;
  profiler: Profiler<TStartArgs>;
  startArgs: TStartArgs;
}

export class ContinuousProfiler<TStartArgs> {
  readonly #profiler: Profiler<TStartArgs>;
  readonly #exporter: ProfileExporter;
  readonly #flushIntervalMs: number;
  #lastExport: Promise<void> | undefined;
  readonly #startArgs: TStartArgs;
  #timer: NodeJS.Timeout | undefined;

  constructor(input: ContinuousProfilerInput<TStartArgs>) {
    this.#exporter = input.exporter;
    this.#flushIntervalMs = input.flushIntervalMs;
    this.#profiler = input.profiler;
    this.#startArgs = input.startArgs;
  }

  public start(): void {
    if (this.#timer !== undefined) {
      return;
    }

    this.#profiler.start(this.#startArgs);
    this.scheduleProfilingRound();
  }

  public async stop(): Promise<void> {
    if (this.#timer === undefined) {
      return;
    }

    clearTimeout(this.#timer);
    this.#timer = undefined;

    if (this.#lastExport !== undefined) {
      await this.#lastExport;
    }

    try {
      const profileExport: ProfileExport | null = this.#profiler.stop();

      if (profileExport !== null) {
        await this.#exporter.export(profileExport);
      }
    } catch (e: unknown) {
      console.error(
        `failed to capture last profile during stop: ${e as string}`,
      );
    }
  }

  private scheduleProfilingRound() {
    this.#timer = setTimeout(() => {
      setImmediate(() => {
        void this.profilingRound();
        this.scheduleProfilingRound();
      });
    }, this.#flushIntervalMs);
  }

  private async profilingRound(): Promise<void> {
    const profileExport: ProfileExport = this.#profiler.profile();

    if (this.#lastExport === undefined) {
      this.#lastExport = this.#exporter.export(profileExport).catch();

      await this.#lastExport;
      this.#lastExport = undefined;
    }
  }
}
