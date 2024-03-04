export interface Environment {
  apiBackendBaseUrl: string;
  apiBackendServiceSecret: string;
  gameTypeOrmDatasourceOptions: Record<string, unknown>;
  pubSubRedisHost: string;
  pubSubRedisPort: number;
}
