import { JwtModule } from '@cornie-js/backend-app-jwt';
import { EnvModule } from '@cornie-js/backend-app-user-env';
import { UserDomainModule } from '@cornie-js/backend-user-domain';
import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';

import { HashModule } from '../../../../foundation/hash/adapter/nest/modules/HashModule';
import { buildJwtModuleOptions } from '../../../../foundation/jwt/adapter/nest/calculations/buildJwtModuleOptions';
import { UserApplicationModule } from '../../../../users/adapter/nest/modules/UserApplicationModule';
import { AuthMiddleware } from '../../../application/middlewares/AuthMiddleware';
import { AuthManagementInputPort } from '../../../application/ports/input/AuthManagementInputPort';

@Module({})
export class AuthApplicationModule {
  public static forRootAsync(
    userImports?: Array<
      Type<unknown> | DynamicModule | Promise<DynamicModule> | ForwardReference
    >,
  ): DynamicModule {
    return {
      exports: [AuthManagementInputPort, AuthMiddleware],
      global: false,
      imports: [
        ...(userImports ?? []),
        EnvModule,
        HashModule,
        JwtModule.forRootAsync(buildJwtModuleOptions()),
        UserDomainModule,
        UserApplicationModule.forRootAsync(userImports),
      ],
      module: AuthApplicationModule,
      providers: [AuthManagementInputPort, AuthMiddleware],
    };
  }
}
