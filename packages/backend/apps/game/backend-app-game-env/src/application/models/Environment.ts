import { JwtAlgorithm } from '@cornie-js/backend-jwt';

export interface Environment {
  apiBackendServiceSecret: string;
  apiBaseUrl: string;
  corsOrigins: string[];
  grafanaTraceUrl: string;
  jwtAlgorithm: JwtAlgorithm;
  jwtAudience: string;
  jwtExpirationMs: number;
  jwtIssuer: string;
  jwtPrivateKey: string;
  jwtPublicKey: string;
  port: number;
  pubSubRedisHost: string;
  pubSubRedisPort: number;
  seedDummyData: boolean;
  typeOrmDatasourceOptions: Record<string, unknown>;
}
