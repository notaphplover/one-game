import { JwtAlgorithm } from '@cornie-js/backend-jwt';

export interface Environment {
  apiBackendServiceSecret: string;
  apiBaseUrl: string;
  jwtAlgorithm: JwtAlgorithm;
  jwtAudience: string;
  jwtExpirationMs: number;
  jwtIssuer: string;
  jwtPrivateKey: string;
  jwtPublicKey: string;
  port: number;
  typeOrmDatasourceOptions: Record<string, unknown>;
}
