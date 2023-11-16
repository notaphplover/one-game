import { ContinuousProfiler } from '../../datadog-pprof/modules/ContinuousProfiler';
import {
  HeapProfiler,
  HeapProfilerStartArgs,
} from '../../datadog-pprof/profilers/HeapProfiler';
import {
  WallProfiler,
  WallProfilerStartArgs,
} from '../../datadog-pprof/profilers/WallProfiler';
import { PyroscopeConfig } from '../models/PyroscopeConfig';
import { PyroscopeApiExporter } from './PyroscopeApiExporter';

const MICROS_PER_SECOND: number = 1e6;
const MS_PER_SECOND: number = 1e3;

const DEFAULT_FLUSH_DURATION_MS: number = 60000;

const DEFAULT_SAMPLING_DURATION_SECONDS: number = 60;
const DEFAULT_SAMPLING_DURATION_MS: number =
  MS_PER_SECOND * DEFAULT_SAMPLING_DURATION_SECONDS;

const DEFAULT_SAMPLING_HZ: number = 100;
const DEFAULT_SAMPLING_INTERVAL_MICROS: number =
  MICROS_PER_SECOND / DEFAULT_SAMPLING_HZ;

const DEFAULT_SAMPLING_INTERVAL_BYTES: number = 1048576;

const DEFAULT_STACK_DEPTH: number = 64;

export class PyroscopeProfiler {
  readonly #wallProfiler: ContinuousProfiler<WallProfilerStartArgs> | undefined;
  readonly #heapProfiler: ContinuousProfiler<HeapProfilerStartArgs> | undefined;

  constructor(config: PyroscopeConfig) {
    const exporter: PyroscopeApiExporter =
      this.#initializePyroscopeApiExporter(config);

    const wallProfilerEnabled: boolean = config.wall?.enabled ?? true;
    const heapProfilerEnabled: boolean = config.heap?.enabled ?? true;

    if (wallProfilerEnabled) {
      this.#wallProfiler = this.#initializeWallProfiler(config, exporter);
    }

    if (heapProfilerEnabled) {
      this.#heapProfiler = this.#initializeHeapProfiler(config, exporter);
    }
  }

  public start(): void {
    this.#heapProfiler?.start();
    this.#wallProfiler?.start();
  }

  public async stop(): Promise<void> {
    await Promise.all([this.#heapProfiler?.stop(), this.#wallProfiler?.stop()]);
  }

  #calculateFlushIntervalMs(config: PyroscopeConfig): number {
    return config.flushIntervalMs ?? DEFAULT_FLUSH_DURATION_MS;
  }

  #initializePyroscopeApiExporter(
    config: PyroscopeConfig,
  ): PyroscopeApiExporter {
    return new PyroscopeApiExporter(
      config.applicationName,
      config.authToken,
      config.serverAddress,
    );
  }

  #initializeHeapProfiler(
    config: PyroscopeConfig,
    exporter: PyroscopeApiExporter,
  ): ContinuousProfiler<HeapProfilerStartArgs> {
    const flushIntervalMs: number = this.#calculateFlushIntervalMs(config);

    return new ContinuousProfiler({
      exporter,
      flushIntervalMs: flushIntervalMs,
      profiler: new HeapProfiler(),
      startArgs: {
        samplingIntervalBytes:
          config.heap?.samplingIntervalBytes ?? DEFAULT_SAMPLING_INTERVAL_BYTES,
        stackDepth: config.heap?.stackDepth ?? DEFAULT_STACK_DEPTH,
      },
    });
  }

  #initializeWallProfiler(
    config: PyroscopeConfig,
    exporter: PyroscopeApiExporter,
  ): ContinuousProfiler<WallProfilerStartArgs> {
    const flushIntervalMs: number = this.#calculateFlushIntervalMs(config);

    return new ContinuousProfiler({
      exporter,
      flushIntervalMs: flushIntervalMs,
      profiler: new WallProfiler(),
      startArgs: {
        samplingDurationMs:
          config.wall?.samplingDurationMs ?? DEFAULT_SAMPLING_DURATION_MS,
        samplingIntervalMicros:
          config.wall?.samplingIntervalMicros ??
          DEFAULT_SAMPLING_INTERVAL_MICROS,
      },
    });
  }
}
