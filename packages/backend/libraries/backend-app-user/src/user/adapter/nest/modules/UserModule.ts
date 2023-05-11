import { userPersistenceOutputPortSymbol } from '@cornie-js/backend-app-user-models';
import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonModule } from '../../../../foundation/common/adapter/nest/modules/CommonModule';
import { DbModuleOptions } from '../../../../foundation/db/adapter/nest/models/DbModuleOptions';
import { DbModule } from '../../../../foundation/db/adapter/nest/modules/DbModule';
import { HashModule } from '../../../../foundation/hash/adapter/nest/modules/HashModule';
import { UserCreateQueryV1ToUserCreateQueryConverter } from '../../../application/converters/UserCreateQueryV1ToUserCreateQueryConverter';
import { UserToUserV1Converter } from '../../../application/converters/UserToUserV1Converter';
import { UserManagementInputPort } from '../../../application/ports/input/UserManagementInputPort';
import { UserPersistenceTypeOrmAdapter } from '../../typeorm/adapters/UserPersistenceTypeOrmAdapter';
import { UserCreateQueryToUserCreateQueryTypeOrmConverter } from '../../typeorm/converters/UserCreateQueryToUserCreateQueryTypeOrmConverter';
import { UserDbToUserConverter } from '../../typeorm/converters/UserDbToUserConverter';
import { UserFindQueryToUserFindQueryTypeOrmConverter } from '../../typeorm/converters/UserFindQueryToUserFindQueryTypeOrmConverter';
import { UserDb } from '../../typeorm/models/UserDb';
import { CreateUserTypeOrmService } from '../../typeorm/services/CreateUserTypeOrmService';
import { FindUserTypeOrmService } from '../../typeorm/services/FindUserTypeOrmService';

@Module({})
export class UserModule {
  public static forRootAsync(dbModuleOptions: DbModuleOptions): DynamicModule {
    return {
      exports: [UserManagementInputPort, userPersistenceOutputPortSymbol],
      global: false,
      imports: [
        CommonModule,
        HashModule,
        DbModule.forRootAsync(dbModuleOptions),
        TypeOrmModule.forFeature([UserDb]),
      ],
      module: UserModule,
      providers: [
        CreateUserTypeOrmService,
        FindUserTypeOrmService,
        UserCreateQueryToUserCreateQueryTypeOrmConverter,
        UserCreateQueryV1ToUserCreateQueryConverter,
        UserFindQueryToUserFindQueryTypeOrmConverter,
        UserDbToUserConverter,
        UserManagementInputPort,
        UserToUserV1Converter,
        {
          provide: userPersistenceOutputPortSymbol,
          useClass: UserPersistenceTypeOrmAdapter,
        },
      ],
    };
  }
}
