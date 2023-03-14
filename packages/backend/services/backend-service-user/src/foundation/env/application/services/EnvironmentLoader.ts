import { Injectable } from '@nestjs/common';
import { EnvLoader } from '@one-game-js/backend-env';
import { JwtAlgorithm } from '@one-game-js/backend-jwt';
import { cleanEnv, json, port, str, num } from 'envalid';

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
      ONE_JS_USER_SERVICE_JWT_ALGORITHM: str<JwtAlgorithm>({
        choices: Object.values(JwtAlgorithm),
      }),
      ONE_JS_USER_SERVICE_JWT_AUDIENCE: str(),
      ONE_JS_USER_SERVICE_JWT_EXPIRATION_MS: num(),
      ONE_JS_USER_SERVICE_JWT_ISSUER: str(),
      ONE_JS_USER_SERVICE_JWT_PRIVATE_KEY: str(),
      ONE_JS_USER_SERVICE_JWT_PUBLIC_KEY: str(),
      ONE_JS_USER_SERVICE_PORT: port(),
      ONE_JS_USER_SERVICE_TYPEORM_DATASOURCE_OPTIONS: json(),
    });

    return {
      jwtAlgorithm: rawEnvironment.ONE_JS_USER_SERVICE_JWT_ALGORITHM,
      jwtAudience: rawEnvironment.ONE_JS_USER_SERVICE_JWT_AUDIENCE,
      jwtExpirationMs: rawEnvironment.ONE_JS_USER_SERVICE_JWT_EXPIRATION_MS,
      jwtIssuer: rawEnvironment.ONE_JS_USER_SERVICE_JWT_ISSUER,
      jwtPrivateKey: rawEnvironment.ONE_JS_USER_SERVICE_JWT_PRIVATE_KEY,
      jwtPublicKey: rawEnvironment.ONE_JS_USER_SERVICE_JWT_PUBLIC_KEY,
      port: rawEnvironment.ONE_JS_USER_SERVICE_PORT,
      typeOrmDatasourceOptions:
        rawEnvironment.ONE_JS_USER_SERVICE_TYPEORM_DATASOURCE_OPTIONS,
    };
  }
}
