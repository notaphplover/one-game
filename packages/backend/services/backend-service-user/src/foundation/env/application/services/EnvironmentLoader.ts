import { Injectable } from '@nestjs/common';
import { EnvLoader } from '@one-game-js/backend-env';
import { cleanEnv, json, port } from 'envalid';

import { Environment } from '../models/Environment';
import { EnvironmentRaw } from '../models/EnvironmentRaw';

const DOT_ENV_PATH: string = '.env';

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
      ONE_JS_USER_SERVICE_PORT: port(),
      ONE_JS_USER_SERVICE_TYPEORM_DATASOURCE_OPTIONS: json(),
    });

    return {
      port: rawEnvironment.ONE_JS_USER_SERVICE_PORT,
      typeOrmDatasourceOptions:
        rawEnvironment.ONE_JS_USER_SERVICE_TYPEORM_DATASOURCE_OPTIONS,
    };
  }
}
