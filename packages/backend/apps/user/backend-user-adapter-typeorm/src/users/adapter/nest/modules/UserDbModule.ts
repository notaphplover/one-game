import {
  userCodePersistenceOutputPortSymbol,
  userPersistenceOutputPortSymbol,
} from '@cornie-js/backend-user-application/users';
import { DynamicModule, Module } from '@nestjs/common';

import { DbModuleOptions } from '../../../../foundation/db/adapter/nest/models/DbModuleOptions';
import { DbModule } from '../../../../foundation/db/adapter/nest/modules/DbModule';
import { UserCodePersistenceTypeOrmAdapter } from '../../typeorm/adapters/UserCodePersistenceTypeOrmAdapter';
import { UserPersistenceTypeOrmAdapter } from '../../typeorm/adapters/UserPersistenceTypeOrmAdapter';
import { UserCodeCreateQueryTypeOrmFromUserCodeCreateQueryBuilder } from '../../typeorm/builders/UserCodeCreateQueryTypeOrmFromUserCodeCreateQueryBuilder';
import { UserCodeFindQueryTypeOrmFromUserCodeFindQueryBuilder } from '../../typeorm/builders/UserCodeFindQueryTypeOrmFromUserCodeFindQueryBuilder';
import { UserCodeFromUserDbCodeBuilder } from '../../typeorm/builders/UserCodeFromUserCodeDbBuilder';
import { UserCodeKindDbFromUserCodeKindBuilder } from '../../typeorm/builders/UserCodeKindDbFromUserCodeKindBuilder';
import { UserCodeKindFromUserCodeKindDbBuilder } from '../../typeorm/builders/UserCodeKindFromUserCodeKindDbBuilder';
import { UserCreateQueryTypeOrmFromUserCreateQueryBuilder } from '../../typeorm/builders/UserCreateQueryTypeOrmFromUserCreateQueryBuilder';
import { UserFindQueryTypeOrmFromUserFindQueryBuilder } from '../../typeorm/builders/UserFindQueryTypeOrmFromUserFindQueryBuilder';
import { UserFindQueryTypeOrmFromUserUpdateQueryBuilder } from '../../typeorm/builders/UserFindQueryTypeOrmFromUserUpdateQueryBuilder';
import { UserFromUserDbBuilder } from '../../typeorm/builders/UserFromUserDbBuilder';
import { UserSetQueryTypeOrmFromUserUpdateQueryBuilder } from '../../typeorm/builders/UserSetQueryTypeOrmFromUserUpdateQueryBuilder';
import { UserCodeDb } from '../../typeorm/models/UserCodeDb';
import { UserDb } from '../../typeorm/models/UserDb';
import { CreateUserCodeTypeOrmService } from '../../typeorm/services/CreateUserCodeTypeOrmService';
import { CreateUserTypeOrmService } from '../../typeorm/services/CreateUserTypeOrmService';
import { DeleteUserCodeTypeOrmService } from '../../typeorm/services/DeleteUserCodeTypeOrmService';
import { DeleteUserTypeOrmService } from '../../typeorm/services/DeleteUserTypeOrmService';
import { FindUserCodeTypeOrmService } from '../../typeorm/services/FindUserCodeTypeOrmService';
import { FindUserTypeOrmService } from '../../typeorm/services/FindUserTypeOrmService';
import { UpdateUserTypeOrmService } from '../../typeorm/services/UpdateUserTypeOrmService';

@Module({})
export class UserDbModule {
  public static forRootAsync(dbModuleOptions: DbModuleOptions): DynamicModule {
    return {
      exports: [
        userCodePersistenceOutputPortSymbol,
        userPersistenceOutputPortSymbol,
      ],
      global: false,
      imports: [
        DbModule.forRootAsync(dbModuleOptions),
        dbModuleOptions.builders.feature([UserCodeDb, UserDb]),
      ],
      module: UserDbModule,
      providers: [
        CreateUserCodeTypeOrmService,
        CreateUserTypeOrmService,
        DeleteUserCodeTypeOrmService,
        DeleteUserTypeOrmService,
        FindUserCodeTypeOrmService,
        FindUserTypeOrmService,
        UpdateUserTypeOrmService,
        UserCodeCreateQueryTypeOrmFromUserCodeCreateQueryBuilder,
        UserCodeFindQueryTypeOrmFromUserCodeFindQueryBuilder,
        UserCodeFromUserDbCodeBuilder,
        UserCodeKindDbFromUserCodeKindBuilder,
        UserCodeKindFromUserCodeKindDbBuilder,
        UserCreateQueryTypeOrmFromUserCreateQueryBuilder,
        UserFindQueryTypeOrmFromUserFindQueryBuilder,
        UserFindQueryTypeOrmFromUserUpdateQueryBuilder,
        UserFromUserDbBuilder,
        {
          provide: userCodePersistenceOutputPortSymbol,
          useClass: UserCodePersistenceTypeOrmAdapter,
        },
        {
          provide: userPersistenceOutputPortSymbol,
          useClass: UserPersistenceTypeOrmAdapter,
        },
        UserSetQueryTypeOrmFromUserUpdateQueryBuilder,
      ],
    };
  }
}
