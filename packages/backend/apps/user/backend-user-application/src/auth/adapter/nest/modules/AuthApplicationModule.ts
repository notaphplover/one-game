import { JwtModule } from '@cornie-js/backend-app-jwt';
import { EnvModule } from '@cornie-js/backend-app-user-env';
import { UuidModule } from '@cornie-js/backend-app-uuid';
import { UserDomainModule } from '@cornie-js/backend-user-domain';
import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';

import { HashModule } from '../../../../foundation/hash/adapter/nest/modules/HashModule';
import { buildJwtModuleOptions } from '../../../../foundation/jwt/adapter/nest/calculations/buildJwtModuleOptions';
import { UserApplicationModule } from '../../../../users/adapter/nest/modules/UserApplicationModule';
import { AccessTokenAuthMiddleware } from '../../../application/middlewares/AccessTokenAuthMiddleware';
import { RefreshTokenAuthMiddleware } from '../../../application/middlewares/RefreshTokenAuthMiddleware';
import { AuthManagementInputPort } from '../../../application/ports/input/AuthManagementInputPort';

@Module({})
export class AuthApplicationModule {
  public static forRootAsync(
    userImports?: Array<
      Type<unknown> | DynamicModule | Promise<DynamicModule> | ForwardReference
    >,
  ): DynamicModule {
    return {
      exports: [
        AuthManagementInputPort,
        AccessTokenAuthMiddleware,
        RefreshTokenAuthMiddleware,
      ],
      global: false,
      imports: [
        ...(userImports ?? []),
        EnvModule,
        HashModule,
        JwtModule.forRootAsync(buildJwtModuleOptions()),
        UserDomainModule,
        UserApplicationModule.forRootAsync(userImports),
        UuidModule,
      ],
      module: AuthApplicationModule,
      providers: [
        AuthManagementInputPort,
        AccessTokenAuthMiddleware,
        RefreshTokenAuthMiddleware,
      ],
    };
  }
}
