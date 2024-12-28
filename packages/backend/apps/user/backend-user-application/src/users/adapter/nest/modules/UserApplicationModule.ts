import { EnvModule } from '@cornie-js/backend-app-user-env';
import { UuidModule } from '@cornie-js/backend-app-uuid';
import { UserDomainModule } from '@cornie-js/backend-user-domain';
import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';

import { HashModule } from '../../../../foundation/hash/adapter/nest/modules/HashModule';
import { StringModule } from '../../../../foundation/string/adapter/nest/StringModule';
import { PasswordResetMailDeliveryOptionsFromUserBuilder } from '../../../application/builders/PasswordResetMailDeliveryOptionsFromUserBuilder';
import { UserActivationMailDeliveryOptionsFromUserBuilder } from '../../../application/builders/UserActivationMailDeliveryOptionsFromUserBuilder';
import { UserCodeCreateQueryFromUserBuilder } from '../../../application/builders/UserCodeCreateQueryFromUserBuilder';
import { UserCodeKindFromUserCodeKindV1Builder } from '../../../application/builders/UserCodeKindFromUserCodeKindV1Builder';
import { UserCreateQueryFromUserCreateQueryV1Builder } from '../../../application/builders/UserCreateQueryFromUserCreateQueryV1Builder';
import { UserDetailV1FromUserBuilder } from '../../../application/builders/UserDetailV1FromUserBuilder';
import { UserFindQuerySortOptionFromUserSortOptionV1Builder } from '../../../application/builders/UserFindQuerySortOptionFromUserSortOptionV1Builder';
import { UserUpdateQueryFromUserMeUpdateQueryV1Builder } from '../../../application/builders/UserUpdateQueryFromUserMeUpdateQueryV1Builder';
import { UserV1FromUserBuilder } from '../../../application/builders/UserV1FromUserBuilder';
import { CreateUserUseCaseHandler } from '../../../application/handlers/CreateUserUseCaseHandler';
import { UpdateUserUseCaseHandler } from '../../../application/handlers/UpdateUserUseCaseHandler';
import { UserCodeCreatedEventHandler } from '../../../application/handlers/UserCodeCreatedEventHandler';
import { UserUpdatedEventHandler } from '../../../application/handlers/UserUpdatedEventHandler';
import { UserCodeManagementInputPort } from '../../../application/ports/input/UserCodeManagementInputPort';
import { UserDetailManagementInputPort } from '../../../application/ports/input/UserDetailManagementInputPort';
import { UserManagementInputPort } from '../../../application/ports/input/UserManagementInputPort';

@Module({})
export class UserApplicationModule {
  public static forRootAsync(
    imports?: Array<
      Type<unknown> | DynamicModule | Promise<DynamicModule> | ForwardReference
    >,
  ): DynamicModule {
    return {
      exports: [
        UserCodeKindFromUserCodeKindV1Builder,
        UserCodeManagementInputPort,
        UserDetailManagementInputPort,
        UserFindQuerySortOptionFromUserSortOptionV1Builder,
        UserManagementInputPort,
      ],
      global: false,
      imports: [
        ...(imports ?? []),
        EnvModule,
        HashModule,
        StringModule,
        UserDomainModule,
        UuidModule,
      ],
      module: UserApplicationModule,
      providers: [
        CreateUserUseCaseHandler,
        PasswordResetMailDeliveryOptionsFromUserBuilder,
        UpdateUserUseCaseHandler,
        UserActivationMailDeliveryOptionsFromUserBuilder,
        UserCodeCreatedEventHandler,
        UserCodeCreateQueryFromUserBuilder,
        UserCodeKindFromUserCodeKindV1Builder,
        UserCodeManagementInputPort,
        UserCreateQueryFromUserCreateQueryV1Builder,
        UserDetailManagementInputPort,
        UserDetailV1FromUserBuilder,
        UserFindQuerySortOptionFromUserSortOptionV1Builder,
        UserManagementInputPort,
        UserUpdatedEventHandler,
        UserUpdateQueryFromUserMeUpdateQueryV1Builder,
        UserV1FromUserBuilder,
      ],
    };
  }
}
