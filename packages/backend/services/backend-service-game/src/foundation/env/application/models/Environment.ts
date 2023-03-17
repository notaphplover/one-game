import { JwtAlgorithm } from '@one-game-js/backend-jwt';

export interface Environment {
  jwtAlgorithm: JwtAlgorithm;
  jwtAudience: string;
  jwtExpirationMs: number;
  jwtIssuer: string;
  jwtPrivateKey: string;
  jwtPublicKey: string;
  port: number;
  typeOrmDatasourceOptions: Record<string, unknown>;
}
