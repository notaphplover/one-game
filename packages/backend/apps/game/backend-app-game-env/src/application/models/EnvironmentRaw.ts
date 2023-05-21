import { JwtAlgorithm } from '@cornie-js/backend-jwt';

export interface EnvironmentRaw extends Record<string, unknown> {
  ONE_JS_GAME_API_BACKEND_SERVICE_SECRET: string;
  ONE_JS_GAME_API_BASE_URL: string;
  ONE_JS_GAME_SERVICE_CORS_ORIGINS: string[];
  ONE_JS_GAME_SERVICE_PORT: number;
  ONE_JS_GAME_SERVICE_SEED_DUMMY: boolean;
  ONE_JS_GAME_SERVICE_TYPEORM_DATASOURCE_OPTIONS: Record<string, unknown>;
  ONE_JS_GAME_SERVICE_JWT_ALGORITHM: JwtAlgorithm;
  ONE_JS_GAME_SERVICE_JWT_AUDIENCE: string;
  ONE_JS_GAME_SERVICE_JWT_EXPIRATION_MS: number;
  ONE_JS_GAME_SERVICE_JWT_ISSUER: string;
  ONE_JS_GAME_SERVICE_JWT_PRIVATE_KEY: string;
  ONE_JS_GAME_SERVICE_JWT_PUBLIC_KEY: string;
}
