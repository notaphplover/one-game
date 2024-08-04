import { EnvLoader } from '@cornie-js/backend-env';
import { JwtAlgorithm } from '@cornie-js/backend-jwt';
import { Injectable } from '@nestjs/common';
import {
  bool,
  cleanEnv,
  email,
  host,
  json,
  num,
  port,
  str,
  url,
} from 'envalid';

import { Environment } from '../models/Environment';
import { EnvironmentRaw } from '../models/EnvironmentRaw';

const DEFAULT_DOT_ENV_PATH: string = '.env';
const DOT_ENV_PATH_ENV_VAR: string = 'ONE_JS_USER_SERVICE_DOT_ENV_PATH';
const DOT_ENV_ENABLED_ENV_VAR: string = 'ONE_JS_USER_SERVICE_DOT_ENV_ENABLED';

@Injectable()
export class EnvironmentLoader extends EnvLoader<Environment> {
  public static build(): EnvironmentLoader {
    const dotEnvPath: string =
      process.env[DOT_ENV_PATH_ENV_VAR] ?? DEFAULT_DOT_ENV_PATH;

    const environmentLoader: EnvironmentLoader = new EnvironmentLoader(
      dotEnvPath,
    );

    return environmentLoader;
  }

  protected _parseEnv(env: Record<string, string>): Environment {
    const rawEnvironment: EnvironmentRaw = cleanEnv(env, {
      ONE_JS_USER_API_BACKEND_SERVICE_SECRET: str(),
      ONE_JS_USER_FRONTEND_BASE_URL: url(),
      ONE_JS_USER_SERVICE_CORS_ORIGINS: json(),
      ONE_JS_USER_SERVICE_GRAFANA_PYROSCOPE_ENABLED: bool(),
      ONE_JS_USER_SERVICE_GRAFANA_PYROSCOPE_URL: url(),
      ONE_JS_USER_SERVICE_GRAFANA_TRACE_ENABLED: bool(),
      ONE_JS_USER_SERVICE_GRAFANA_TRACE_URL: url(),
      ONE_JS_USER_SERVICE_HOST: host(),
      ONE_JS_USER_SERVICE_JWT_ALGORITHM: str<JwtAlgorithm>({
        choices: Object.values(JwtAlgorithm),
      }),
      ONE_JS_USER_SERVICE_JWT_AUDIENCE: str(),
      ONE_JS_USER_SERVICE_JWT_EXPIRATION_MS: num(),
      ONE_JS_USER_SERVICE_JWT_ISSUER: str(),
      ONE_JS_USER_SERVICE_JWT_PRIVATE_KEY: str(),
      ONE_JS_USER_SERVICE_JWT_PUBLIC_KEY: str(),
      ONE_JS_USER_SERVICE_MAIL_DEFAULT_ADDRESS: email(),
      ONE_JS_USER_SERVICE_MAIL_HOST: host(),
      ONE_JS_USER_SERVICE_MAIL_PASSWORD: str(),
      ONE_JS_USER_SERVICE_MAIL_PORT: port(),
      ONE_JS_USER_SERVICE_MAIL_USE_TLS: bool(),
      ONE_JS_USER_SERVICE_MAIL_USER: str(),
      ONE_JS_USER_SERVICE_PORT: port(),
      ONE_JS_USER_SERVICE_TYPEORM_DATASOURCE_OPTIONS: json(),
    });

    return {
      apiBackendServiceSecret:
        rawEnvironment.ONE_JS_USER_API_BACKEND_SERVICE_SECRET,
      corsOrigins: rawEnvironment.ONE_JS_USER_SERVICE_CORS_ORIGINS,
      frontendBaseUrl: rawEnvironment.ONE_JS_USER_FRONTEND_BASE_URL,
      grafanaPyroscopeEnabled:
        rawEnvironment.ONE_JS_USER_SERVICE_GRAFANA_PYROSCOPE_ENABLED,
      grafanaPyroscopeUrl:
        rawEnvironment.ONE_JS_USER_SERVICE_GRAFANA_PYROSCOPE_URL,
      grafanaTraceEnabled:
        rawEnvironment.ONE_JS_USER_SERVICE_GRAFANA_TRACE_ENABLED,
      grafanaTraceUrl: rawEnvironment.ONE_JS_USER_SERVICE_GRAFANA_TRACE_URL,
      host: rawEnvironment.ONE_JS_USER_SERVICE_HOST,
      jwtAlgorithm: rawEnvironment.ONE_JS_USER_SERVICE_JWT_ALGORITHM,
      jwtAudience: rawEnvironment.ONE_JS_USER_SERVICE_JWT_AUDIENCE,
      jwtExpirationMs: rawEnvironment.ONE_JS_USER_SERVICE_JWT_EXPIRATION_MS,
      jwtIssuer: rawEnvironment.ONE_JS_USER_SERVICE_JWT_ISSUER,
      jwtPrivateKey: rawEnvironment.ONE_JS_USER_SERVICE_JWT_PRIVATE_KEY,
      jwtPublicKey: rawEnvironment.ONE_JS_USER_SERVICE_JWT_PUBLIC_KEY,
      mailConfig: {
        authPassword: rawEnvironment.ONE_JS_USER_SERVICE_MAIL_PASSWORD,
        authUser: rawEnvironment.ONE_JS_USER_SERVICE_MAIL_USER,
        defaultAddress: rawEnvironment.ONE_JS_USER_SERVICE_MAIL_DEFAULT_ADDRESS,
        host: rawEnvironment.ONE_JS_USER_SERVICE_MAIL_HOST,
        port: rawEnvironment.ONE_JS_USER_SERVICE_MAIL_PORT,
        useTls: rawEnvironment.ONE_JS_USER_SERVICE_MAIL_USE_TLS,
      },
      port: rawEnvironment.ONE_JS_USER_SERVICE_PORT,
      typeOrmDatasourceOptions:
        rawEnvironment.ONE_JS_USER_SERVICE_TYPEORM_DATASOURCE_OPTIONS,
    };
  }

  protected override _shouldParseEnvFile(): boolean {
    return process.env[DOT_ENV_ENABLED_ENV_VAR] !== 'false';
  }
}
