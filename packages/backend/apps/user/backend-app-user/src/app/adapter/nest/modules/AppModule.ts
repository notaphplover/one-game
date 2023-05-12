import {
  JwtModuleOptions,
  JwtServiceOptions,
} from '@cornie-js/backend-app-jwt';
import { DbModuleOptions } from '@cornie-js/backend-app-user-db';
import {
  Environment,
  EnvModule,
  EnvironmentService,
} from '@cornie-js/backend-app-user-env';
import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AuthModule } from '../../../../auth/adapters/nest/AuthModule';
import { UserModule } from '../../../../user/adapter/nest/modules/UserModule';

function buildDbModuleOptions(): DbModuleOptions {
  return {
    imports: [EnvModule],
    inject: [EnvironmentService],
    useFactory: (
      environmentService: EnvironmentService,
    ): TypeOrmModuleOptions =>
      environmentService.getEnvironment().typeOrmDatasourceOptions,
  };
}

function buildJwtModuleOptions(): JwtModuleOptions {
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

const authModule: DynamicModule = AuthModule.forRootAsync(
  buildDbModuleOptions(),
  buildJwtModuleOptions(),
);

const userModule: DynamicModule = UserModule.forRootAsync(
  buildDbModuleOptions(),
);

@Module({
  exports: [authModule, userModule],
  imports: [authModule, userModule],
})
export class AppModule {}
