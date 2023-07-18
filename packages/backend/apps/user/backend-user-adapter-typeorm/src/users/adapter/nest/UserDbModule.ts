import { userPersistenceOutputPortSymbol } from '@cornie-js/backend-user-application/users';
import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DbModuleOptions } from '../../../foundation/db/adapter/nest/models/DbModuleOptions';
import { DbModule } from '../../../foundation/db/adapter/nest/modules/DbModule';
import { UserPersistenceTypeOrmAdapter } from '../typeorm/adapters/UserPersistenceTypeOrmAdapter';
import { UserCodeCreateQueryToUserCodeCreateQueryTypeOrmConverter } from '../typeorm/converters/UserCodeCreateQueryToUserCodeCreateQueryTypeOrmConverter';
import { UserCodeDbToUserCodeConverter } from '../typeorm/converters/UserCodeDbToUserCodeConverter';
import { UserCodeFindQueryToUserCodeFindQueryTypeOrmConverter } from '../typeorm/converters/UserCodeFindQueryToUserCodeFindQueryTypeOrmConverter';
import { UserCreateQueryToUserCreateQueryTypeOrmConverter } from '../typeorm/converters/UserCreateQueryToUserCreateQueryTypeOrmConverter';
import { UserDbToUserConverter } from '../typeorm/converters/UserDbToUserConverter';
import { UserFindQueryToUserFindQueryTypeOrmConverter } from '../typeorm/converters/UserFindQueryToUserFindQueryTypeOrmConverter';
import { UserUpdateQueryToUserFindQueryTypeOrmConverter } from '../typeorm/converters/UserUpdateQueryToUserFindQueryTypeOrmConverter';
import { UserUpdateQueryToUserSetQueryTypeOrmConverter } from '../typeorm/converters/UserUpdateQueryToUserSetQueryTypeOrmConverter';
import { UserCodeDb } from '../typeorm/models/UserCodeDb';
import { UserDb } from '../typeorm/models/UserDb';
import { CreateUserTypeOrmService } from '../typeorm/services/CreateUserTypeOrmService';
import { DeleteUserTypeOrmService } from '../typeorm/services/DeleteUserTypeOrmService';
import { FindUserTypeOrmService } from '../typeorm/services/FindUserTypeOrmService';
import { UpdateUserTypeOrmService } from '../typeorm/services/UpdateUserTypeOrmService';

@Module({})
export class UserDbModule {
  public static forRootAsync(dbModuleOptions: DbModuleOptions): DynamicModule {
    return {
      exports: [userPersistenceOutputPortSymbol],
      global: false,
      imports: [
        DbModule.forRootAsync(dbModuleOptions),
        TypeOrmModule.forFeature([UserCodeDb, UserDb]),
      ],
      module: UserDbModule,
      providers: [
        CreateUserTypeOrmService,
        DeleteUserTypeOrmService,
        FindUserTypeOrmService,
        UpdateUserTypeOrmService,
        UserCodeCreateQueryToUserCodeCreateQueryTypeOrmConverter,
        UserCodeDbToUserCodeConverter,
        UserCodeFindQueryToUserCodeFindQueryTypeOrmConverter,
        UserCreateQueryToUserCreateQueryTypeOrmConverter,
        UserFindQueryToUserFindQueryTypeOrmConverter,
        UserDbToUserConverter,
        {
          provide: userPersistenceOutputPortSymbol,
          useClass: UserPersistenceTypeOrmAdapter,
        },
        UserUpdateQueryToUserFindQueryTypeOrmConverter,
        UserUpdateQueryToUserSetQueryTypeOrmConverter,
      ],
    };
  }
}
