import { JwtAlgorithm } from '@cornie-js/backend-jwt';

export interface Environment {
  apiBackendServiceSecret: string;
  apiBaseUrl: string;
  corsOrigins: string[];
  jwtAlgorithm: JwtAlgorithm;
  jwtAudience: string;
  jwtExpirationMs: number;
  jwtIssuer: string;
  jwtPrivateKey: string;
  jwtPublicKey: string;
  port: number;
  seedDummyData: boolean;
  typeOrmDatasourceOptions: Record<string, unknown>;
}
