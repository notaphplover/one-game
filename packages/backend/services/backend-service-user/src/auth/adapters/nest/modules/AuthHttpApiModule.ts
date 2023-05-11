import {
  JwtModule,
  JwtModuleOptions,
  JwtServiceOptions,
} from '@cornie-js/backend-app-jwt';
import { AppModule } from '@cornie-js/backend-app-user';
import {
  EnvModule,
  Environment,
  EnvironmentService,
} from '@cornie-js/backend-app-user-env';
import { Module } from '@nestjs/common';

import { HttpModule } from '../../../../foundation/http/adapter/nest/modules/HttpModule';
import { JsonSchemaModule } from '../../../../foundation/jsonSchema/adapter/nest/modules/JsonSchemaModule';
import { PostAuthV1HttpRequestController } from '../../../application/controllers/PostAuthV1HttpRequestController';
import { PostAuthV1RequestParamHandler } from '../../../application/handlers/PostAuthV1RequestParamHandler';
import { AuthMiddleware } from '../../../application/middlewares/AuthMiddleware';
import { PostAuthV1HttpRequestNestController } from '../controllers/PostAuthV1HttpRequestNestController';

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

@Module({
  controllers: [PostAuthV1HttpRequestNestController],
  exports: [AuthMiddleware],
  imports: [
    AppModule,
    EnvModule,
    JsonSchemaModule,
    JwtModule.forRootAsync(buildJwtModuleOptions()),
    HttpModule,
  ],
  providers: [
    AuthMiddleware,
    PostAuthV1RequestParamHandler,
    PostAuthV1HttpRequestController,
    PostAuthV1HttpRequestNestController,
  ],
})
export class AuthHttpApiModule {}
