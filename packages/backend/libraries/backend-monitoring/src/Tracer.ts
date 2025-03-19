import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { containerDetector } from '@opentelemetry/resource-detector-container';
import { gcpDetector } from '@opentelemetry/resource-detector-gcp';
import {
  envDetector,
  hostDetector,
  osDetector,
  processDetector,
  resourceFromAttributes,
} from '@opentelemetry/resources';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

export interface TraceOptions {
  serviceName: string;
  tracerUrl: string;
}

export class Tracer {
  readonly #sdk: NodeSDK;

  constructor(options: TraceOptions) {
    this.#sdk = new NodeSDK({
      instrumentations: [
        getNodeAutoInstrumentations({
          // only instrument fs if it is part of another trace
          '@opentelemetry/instrumentation-fs': {
            requireParentSpan: true,
          },
        }),
      ],
      metricReader: new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter(),
      }),
      resource: resourceFromAttributes({
        [ATTR_SERVICE_NAME]: options.serviceName,
      }),
      resourceDetectors: [
        containerDetector,
        envDetector,
        hostDetector,
        osDetector,
        processDetector,
        gcpDetector,
      ],
      traceExporter: new OTLPTraceExporter({
        url: options.tracerUrl,
      }),
    });
  }

  public start(): void {
    this.#sdk.start();
  }

  public async stop(): Promise<void> {
    await this.#sdk.shutdown();
  }
}
