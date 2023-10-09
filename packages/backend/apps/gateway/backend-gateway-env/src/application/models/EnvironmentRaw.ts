export interface EnvironmentRaw extends Record<string, unknown> {
  ONE_JS_GATEWAY_SERVICE_API_BASE_URL: string;
  ONE_JS_GATEWAY_SERVICE_CORS_ORIGINS: string[];
  ONE_JS_GATEWAY_SERVICE_PORT: number;
}
