export interface EnvironmentRaw extends Record<string, unknown> {
  ONE_JS_E2E_API_BACKEND_BASE_URL: string;
  ONE_JS_E2E_API_BACKEND_SERVICE_SECRET: string;
  ONE_JS_E2E_GAME_TYPEORM_DATASOURCE_OPTIONS: Record<string, unknown>;
  ONE_JS_E2E_PUB_SUB_REDIS_HOST: string;
  ONE_JS_E2E_PUB_SUB_REDIS_PORT: number;
}
