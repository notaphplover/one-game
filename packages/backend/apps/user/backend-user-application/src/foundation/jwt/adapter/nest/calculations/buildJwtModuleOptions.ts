import {
  JwtModuleOptions,
  JwtServiceOptions,
} from '@cornie-js/backend-app-jwt';
import {
  Environment,
  EnvironmentService,
  EnvModule,
} from '@cornie-js/backend-app-user-env';

export function buildJwtModuleOptions(): JwtModuleOptions {
  return {
    imports: [EnvModule],
    inject: [EnvironmentService],
    useFactory: (environmentService: EnvironmentService): JwtServiceOptions => {
      const env: Environment = environmentService.getEnvironment();

      return {
        algorithm: env.jwtAlgorithm,
        audience: env.jwtAudience,
        expirationMs: env.jwtExpirationMs,
        issuer: env.jwtIssuer,
        privateKey: env.jwtPrivateKey,
        publicKey: env.jwtPublicKey,
      };
    },
  };
}
