import { DbModuleOptions, UserDbModule } from '@cornie-js/backend-app-user-db';
import { DynamicModule, Module } from '@nestjs/common';

import { CommonModule } from '../../../../foundation/common/adapter/nest/modules/CommonModule';
import { HashModule } from '../../../../foundation/hash/adapter/nest/modules/HashModule';
import { UserCreateQueryV1ToUserCreateQueryConverter } from '../../../application/converters/UserCreateQueryV1ToUserCreateQueryConverter';
import { UserToUserV1Converter } from '../../../application/converters/UserToUserV1Converter';
import { UserManagementInputPort } from '../../../application/ports/input/UserManagementInputPort';

@Module({})
export class UserModule {
  public static forRootAsync(dbModuleOptions: DbModuleOptions): DynamicModule {
    const userDbModule: DynamicModule =
      UserDbModule.forRootAsync(dbModuleOptions);

    return {
      exports: [UserManagementInputPort, userDbModule],
      global: false,
      imports: [CommonModule, HashModule, userDbModule],
      module: UserModule,
      providers: [
        UserCreateQueryV1ToUserCreateQueryConverter,
        UserManagementInputPort,
        UserToUserV1Converter,
      ],
    };
  }
}
