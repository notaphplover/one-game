import { EnvLoader } from '@cornie-js/backend-env';
import { JwtAlgorithm } from '@cornie-js/backend-jwt';
import { Injectable } from '@nestjs/common';
import { cleanEnv, json, port, str, num, url, bool, host } from 'envalid';

import { Environment } from '../models/Environment';
import { EnvironmentRaw } from '../models/EnvironmentRaw';

const DOT_ENV_PATH: string =
  process.env['ONE_JS_GAME_SERVICE_DOT_ENV_PATH'] ?? '.env';

@Injectable()
export class EnvironmentLoader extends EnvLoader<Environment> {
  public static build(): EnvironmentLoader {
    const environmentLoader: EnvironmentLoader = new EnvironmentLoader(
      DOT_ENV_PATH,
    );

    return environmentLoader;
  }

  protected _parseEnv(env: Record<string, string>): Environment {
    const rawEnvironment: EnvironmentRaw = cleanEnv(env, {
      ONE_JS_GAME_API_BACKEND_SERVICE_SECRET: str(),
      ONE_JS_GAME_API_BASE_URL: url(),
      ONE_JS_GAME_SERVICE_CORS_ORIGINS: json(),
      ONE_JS_GAME_SERVICE_GRAFANA_PYROSCOPE_ENABLED: bool(),
      ONE_JS_GAME_SERVICE_GRAFANA_PYROSCOPE_URL: url(),
      ONE_JS_GAME_SERVICE_GRAFANA_TRACE_ENABLED: bool(),
      ONE_JS_GAME_SERVICE_GRAFANA_TRACE_URL: url(),
      ONE_JS_GAME_SERVICE_HOST: host(),
      ONE_JS_GAME_SERVICE_JWT_ALGORITHM: str<JwtAlgorithm>({
        choices: Object.values(JwtAlgorithm),
      }),
      ONE_JS_GAME_SERVICE_JWT_AUDIENCE: str(),
      ONE_JS_GAME_SERVICE_JWT_EXPIRATION_MS: num(),
      ONE_JS_GAME_SERVICE_JWT_ISSUER: str(),
      ONE_JS_GAME_SERVICE_JWT_PRIVATE_KEY: str(),
      ONE_JS_GAME_SERVICE_JWT_PUBLIC_KEY: str(),
      ONE_JS_GAME_SERVICE_PORT: port(),
      ONE_JS_GAME_SERVICE_PUB_SUB_REDIS_HOST: host(),
      ONE_JS_GAME_SERVICE_PUB_SUB_REDIS_PORT: port(),
      ONE_JS_GAME_SERVICE_TYPEORM_DATASOURCE_OPTIONS: json(),
    });

    return {
      apiBackendServiceSecret:
        rawEnvironment.ONE_JS_GAME_API_BACKEND_SERVICE_SECRET,
      apiBaseUrl: rawEnvironment.ONE_JS_GAME_API_BASE_URL,
      corsOrigins: rawEnvironment.ONE_JS_GAME_SERVICE_CORS_ORIGINS,
      grafanaPyroscopeEnabled:
        rawEnvironment.ONE_JS_GAME_SERVICE_GRAFANA_PYROSCOPE_ENABLED,
      grafanaPyroscopeUrl:
        rawEnvironment.ONE_JS_GAME_SERVICE_GRAFANA_PYROSCOPE_URL,
      grafanaTraceEnabled:
        rawEnvironment.ONE_JS_GAME_SERVICE_GRAFANA_TRACE_ENABLED,
      grafanaTraceUrl: rawEnvironment.ONE_JS_GAME_SERVICE_GRAFANA_TRACE_URL,
      host: rawEnvironment.ONE_JS_GAME_SERVICE_HOST,
      jwtAlgorithm: rawEnvironment.ONE_JS_GAME_SERVICE_JWT_ALGORITHM,
      jwtAudience: rawEnvironment.ONE_JS_GAME_SERVICE_JWT_AUDIENCE,
      jwtExpirationMs: rawEnvironment.ONE_JS_GAME_SERVICE_JWT_EXPIRATION_MS,
      jwtIssuer: rawEnvironment.ONE_JS_GAME_SERVICE_JWT_ISSUER,
      jwtPrivateKey: rawEnvironment.ONE_JS_GAME_SERVICE_JWT_PRIVATE_KEY,
      jwtPublicKey: rawEnvironment.ONE_JS_GAME_SERVICE_JWT_PUBLIC_KEY,
      port: rawEnvironment.ONE_JS_GAME_SERVICE_PORT,
      pubSubRedisHost: rawEnvironment.ONE_JS_GAME_SERVICE_PUB_SUB_REDIS_HOST,
      pubSubRedisPort: rawEnvironment.ONE_JS_GAME_SERVICE_PUB_SUB_REDIS_PORT,
      typeOrmDatasourceOptions:
        rawEnvironment.ONE_JS_GAME_SERVICE_TYPEORM_DATASOURCE_OPTIONS,
    };
  }

  protected override _shouldParseEnvFile(): boolean {
    return process.env['ONE_JS_GAME_SERVICE_DOT_ENV_ENABLED'] !== 'false';
  }
}
