import { Injectable } from '@nestjs/common';
import { EnvLoader } from '@one-game-js/backend-env';
import { cleanEnv, json } from 'envalid';

import { Environment } from '../models/application/Environment';

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
    return cleanEnv(env, {
      typeOrmDatasourceOptions: json(),
    });
  }
}
