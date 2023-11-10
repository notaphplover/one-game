import { ContinuousProfiler } from '../../datadog-pprof/modules/ContinuousProfiler';
import { CpuProfiler } from '../../datadog-pprof/profilers/CpuProfiler';
import { MemoryProfiler } from '../../datadog-pprof/profilers/MemoryProfiler';
import { PyroscopeConfig } from '../models/PyroscopeConfig';
import { PyroscopeApiExporter } from './PyroscopeApiExporter';

export class PyroscopeProfiler {
  readonly #cpuProfiler: ContinuousProfiler;
  readonly #memoryProfiler: ContinuousProfiler;

  constructor(config: PyroscopeConfig) {
    this.#cpuProfiler = new ContinuousProfiler({
      duration: config.samplingDurationMs,
      exporter: new PyroscopeApiExporter(config),
      name: config.applicationName,
      profiler: new CpuProfiler(
        config.samplingDurationMs,
        config.samplingIntervalMicros,
      ),
    });

    this.#memoryProfiler = new ContinuousProfiler({
      duration: config.samplingDurationMs,
      exporter: new PyroscopeApiExporter(config),
      name: config.applicationName,
      profiler: new MemoryProfiler(
        config.samplingIntervalBytes,
        config.stackDepth,
      ),
    });
  }

  public start(): void {
    this.#cpuProfiler.start();
    this.#memoryProfiler.start();
  }

  public async stop(): Promise<void> {
    await Promise.all([this.#cpuProfiler.stop(), this.#memoryProfiler]);
  }
}
