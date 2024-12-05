import { JwtAlgorithm } from '@cornie-js/backend-jwt';

export interface Environment {
  apiBackendServiceSecret: string;
  apiBaseUrl: string;
  consumerHost: string;
  consumerPort: number;
  corsOrigins: string[];
  grafanaPyroscopeEnabled: boolean;
  grafanaPyroscopeUrl: string;
  grafanaTraceEnabled: boolean;
  grafanaTraceUrl: string;
  host: string;
  jwtAlgorithm: JwtAlgorithm;
  jwtAudience: string;
  jwtExpirationMs: number;
  jwtIssuer: string;
  jwtPrivateKey: string;
  jwtPublicKey: string;
  port: number;
  pubSubRedisHost: string;
  pubSubRedisPort: number;
  pulsarGameTurnSignalEnabled: boolean;
  pulsarGameTurnSignalTopicUrl: string;
  pulsarServiceUrl: string;
  typeOrmDatasourceOptions: Record<string, unknown>;
}
