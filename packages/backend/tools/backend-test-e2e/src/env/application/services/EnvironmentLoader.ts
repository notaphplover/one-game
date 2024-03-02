import { EnvLoader } from '@cornie-js/backend-env';
import { Injectable } from '@nestjs/common';
import { cleanEnv, host, json, port, str, url } from 'envalid';

import { Environment } from '../models/Environment';
import { EnvironmentRaw } from '../models/EnvironmentRaw';

const DOT_ENV_PATH: string =
  process.env['ONE_JS_TEST_E2E_DOT_ENV_PATH'] ?? '.env';

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
      ONE_JS_E2E_API_BACKEND_BASE_URL: url(),
      ONE_JS_E2E_API_BACKEND_SERVICE_SECRET: str(),
      ONE_JS_E2E_GAME_TYPEORM_DATASOURCE_OPTIONS: json(),
      ONE_JS_E2E_PUB_SUB_REDIS_HOST: host(),
      ONE_JS_E2E_PUB_SUB_REDIS_PORT: port(),
    });

    return {
      apiBackendBaseUrl: rawEnvironment.ONE_JS_E2E_API_BACKEND_BASE_URL,
      apiBackendServiceSecret:
        rawEnvironment.ONE_JS_E2E_API_BACKEND_SERVICE_SECRET,
      gameTypeOrmDatasourceOptions:
        rawEnvironment.ONE_JS_E2E_GAME_TYPEORM_DATASOURCE_OPTIONS,
      pubSubRedisHost: rawEnvironment.ONE_JS_E2E_PUB_SUB_REDIS_HOST,
      pubSubRedisPort: rawEnvironment.ONE_JS_E2E_PUB_SUB_REDIS_PORT,
    };
  }

  protected override _shouldParseEnvFile(): boolean {
    return true;
  }
}
