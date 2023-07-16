import { JwtModule } from '@cornie-js/backend-app-jwt';
import { EnvModule } from '@cornie-js/backend-app-user-env';
import { UuidModule } from '@cornie-js/backend-app-uuid';
import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';

import { HashModule } from '../../../../foundation/hash/adapter/nest/modules/HashModule';
import { buildJwtModuleOptions } from '../../../../foundation/jwt/adapter/nest/calculations/buildJwtModuleOptions';
import { AuthMiddleware } from '../../../application/middlewares/AuthMiddleware';
import { AuthManagementInputPort } from '../../../application/ports/input/AuthManagementInputPort';

@Module({})
export class AuthApplicationModule {
  public static forRootAsync(
    imports?: Array<
      Type<unknown> | DynamicModule | Promise<DynamicModule> | ForwardReference
    >,
  ): DynamicModule {
    return {
      exports: [AuthManagementInputPort, AuthMiddleware],
      global: false,
      imports: [
        ...(imports ?? []),
        EnvModule,
        HashModule,
        JwtModule.forRootAsync(buildJwtModuleOptions()),
        UuidModule,
      ],
      module: AuthApplicationModule,
    };
  }
}
