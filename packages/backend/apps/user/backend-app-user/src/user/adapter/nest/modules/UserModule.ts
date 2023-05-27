import { DbModuleOptions, UserDbModule } from '@cornie-js/backend-app-user-db';
import { UuidModule } from '@cornie-js/backend-app-uuid';
import { DynamicModule, Module } from '@nestjs/common';

import { HashModule } from '../../../../foundation/hash/adapter/nest/modules/HashModule';
import { UserCreateQueryFromUserCreateQueryV1Builder } from '../../../application/converters/UserCreateQueryFromUserCreateQueryV1Builder';
import { UserUpdateQueryFromUserMeUpdateQueryV1Builder } from '../../../application/converters/UserUpdateQueryFromUserMeUpdateQueryV1Builder';
import { UserV1FromUserBuilder } from '../../../application/converters/UserV1FromUserBuilder';
import { UserManagementInputPort } from '../../../application/ports/input/UserManagementInputPort';

@Module({})
export class UserModule {
  public static forRootAsync(dbModuleOptions: DbModuleOptions): DynamicModule {
    const userDbModule: DynamicModule =
      UserDbModule.forRootAsync(dbModuleOptions);

    return {
      exports: [UserManagementInputPort, userDbModule],
      global: false,
      imports: [UuidModule, HashModule, userDbModule],
      module: UserModule,
      providers: [
        UserCreateQueryFromUserCreateQueryV1Builder,
        UserManagementInputPort,
        UserUpdateQueryFromUserMeUpdateQueryV1Builder,
        UserV1FromUserBuilder,
      ],
    };
  }
}
