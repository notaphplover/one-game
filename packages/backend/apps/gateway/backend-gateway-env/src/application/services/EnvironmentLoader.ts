import { EnvLoader } from '@cornie-js/backend-env';
import { Injectable } from '@nestjs/common';
import { cleanEnv, json, port, str } from 'envalid';

import { Environment } from '../models/Environment';
import { EnvironmentRaw } from '../models/EnvironmentRaw';

const DOT_ENV_PATH: string =
  process.env['ONE_JS_USER_SERVICE_DOT_ENV_PATH'] ?? '.env';

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
      ONE_JS_GRAPHQL_API_GATEWAY_SERVICE_API_BASE_URL: str(),
      ONE_JS_GRAPHQL_GATEWAY_CORS_ORIGINS: json(),
      ONE_JS_GRAPHQL_GATEWAY_PORT: port(),
    });

    return {
      apiBaseUrl:
        rawEnvironment.ONE_JS_GRAPHQL_API_GATEWAY_SERVICE_API_BASE_URL,
      corsOrigins: rawEnvironment.ONE_JS_GRAPHQL_GATEWAY_CORS_ORIGINS,
      port: rawEnvironment.ONE_JS_GRAPHQL_GATEWAY_PORT,
    };
  }
}
