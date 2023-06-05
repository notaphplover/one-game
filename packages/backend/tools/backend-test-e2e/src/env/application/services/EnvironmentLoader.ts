import { EnvLoader } from '@cornie-js/backend-env';
import { Injectable } from '@nestjs/common';
import { cleanEnv, str, url } from 'envalid';

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
    });

    return {
      apiBackendBaseUrl: rawEnvironment.ONE_JS_E2E_API_BACKEND_BASE_URL,
      apiBackendServiceSecret:
        rawEnvironment.ONE_JS_E2E_API_BACKEND_SERVICE_SECRET,
    };
  }
}
