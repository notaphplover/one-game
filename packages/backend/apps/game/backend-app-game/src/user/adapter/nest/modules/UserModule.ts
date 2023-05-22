import { DynamicModule, Module } from '@nestjs/common';

import { HttpApiModule } from '../../../../foundation/api/adapter/nest/modules/HttpApiModule';
import { HttpApiModuleOptions } from '../../../../foundation/api/application/models/HttpApiModuleOptions';
import { UserManagementInputPort } from '../../../application/ports/input/UserManagementInputPort';

@Module({})
export class UserModule {
  public static forRootAsync(options: HttpApiModuleOptions): DynamicModule {
    return {
      exports: [UserManagementInputPort],
      global: false,
      imports: [HttpApiModule.forRootAsync(options)],
      module: UserModule,
      providers: [UserManagementInputPort],
    };
  }
}
