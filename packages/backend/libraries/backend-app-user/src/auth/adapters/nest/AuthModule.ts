import { JwtModule, JwtModuleOptions } from '@cornie-js/backend-app-jwt';
import { DynamicModule, Module } from '@nestjs/common';

import { DbModuleOptions } from '../../../foundation/db/adapter/nest/models/DbModuleOptions';
import { HashModule } from '../../../foundation/hash/adapter/nest/modules/HashModule';
import { UserModule } from '../../../user/adapter/nest/modules/UserModule';
import { AuthManagementInputPort } from '../../application/ports/input/AuthManagementInputPort';

@Module({})
export class AuthModule {
  public static forRootAsync(
    dbModuleOptions: DbModuleOptions,
    jwtModuleOptions: JwtModuleOptions,
  ): DynamicModule {
    return {
      exports: [AuthManagementInputPort],
      global: false,
      imports: [
        HashModule,
        JwtModule.forRootAsync(jwtModuleOptions),
        UserModule.forRootAsync(dbModuleOptions),
      ],
      module: AuthModule,
      providers: [AuthManagementInputPort],
    };
  }
}
