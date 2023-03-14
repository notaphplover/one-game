import { JwtAlgorithm } from '@one-game-js/backend-jwt';

export interface EnvironmentRaw extends Record<string, unknown> {
  ONE_JS_USER_SERVICE_PORT: number;
  ONE_JS_USER_SERVICE_TYPEORM_DATASOURCE_OPTIONS: Record<string, unknown>;
  ONE_JS_USER_SERVICE_JWT_ALGORITHM: JwtAlgorithm;
  ONE_JS_USER_SERVICE_JWT_AUDIENCE: string;
  ONE_JS_USER_SERVICE_JWT_EXPIRATION_MS: number;
  ONE_JS_USER_SERVICE_JWT_ISSUER: string;
  ONE_JS_USER_SERVICE_JWT_PRIVATE_KEY: string;
  ONE_JS_USER_SERVICE_JWT_PUBLIC_KEY: string;
}
