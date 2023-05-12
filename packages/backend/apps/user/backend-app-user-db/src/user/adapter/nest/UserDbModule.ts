import { userPersistenceOutputPortSymbol } from '@cornie-js/backend-app-user-models';
import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DbModuleOptions } from '../../../foundation/db/adapter/nest/models/DbModuleOptions';
import { DbModule } from '../../../foundation/db/adapter/nest/modules/DbModule';
import { UserPersistenceTypeOrmAdapter } from '../typeorm/adapters/UserPersistenceTypeOrmAdapter';
import { UserCreateQueryToUserCreateQueryTypeOrmConverter } from '../typeorm/converters/UserCreateQueryToUserCreateQueryTypeOrmConverter';
import { UserDbToUserConverter } from '../typeorm/converters/UserDbToUserConverter';
import { UserFindQueryToUserFindQueryTypeOrmConverter } from '../typeorm/converters/UserFindQueryToUserFindQueryTypeOrmConverter';
import { UserDb } from '../typeorm/models/UserDb';
import { CreateUserTypeOrmService } from '../typeorm/services/CreateUserTypeOrmService';
import { FindUserTypeOrmService } from '../typeorm/services/FindUserTypeOrmService';

@Module({})
export class UserDbModule {
  public static forRootAsync(dbModuleOptions: DbModuleOptions): DynamicModule {
    return {
      exports: [userPersistenceOutputPortSymbol],
      global: false,
      imports: [
        DbModule.forRootAsync(dbModuleOptions),
        TypeOrmModule.forFeature([UserDb]),
      ],
      module: UserDbModule,
      providers: [
        CreateUserTypeOrmService,
        FindUserTypeOrmService,
        UserCreateQueryToUserCreateQueryTypeOrmConverter,
        UserFindQueryToUserFindQueryTypeOrmConverter,
        UserDbToUserConverter,
        {
          provide: userPersistenceOutputPortSymbol,
          useClass: UserPersistenceTypeOrmAdapter,
        },
      ],
    };
  }
}
