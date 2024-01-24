import { EnvModule } from '@cornie-js/backend-app-user-env';
import { UuidModule } from '@cornie-js/backend-app-uuid';
import { UserDomainModule } from '@cornie-js/backend-user-domain';
import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';

import { HashModule } from '../../../../foundation/hash/adapter/nest/modules/HashModule';
import { StringModule } from '../../../../foundation/string/adapter/nest/StringModule';
import { UserActivationMailDeliveryOptionsFromUserBuilder } from '../../../application/builders/UserActivationMailDeliveryOptionsFromUserBuilder';
import { UserCodeCreateQueryFromUserBuilder } from '../../../application/builders/UserCodeCreateQueryFromUserBuilder';
import { UserCreateQueryFromUserCreateQueryV1Builder } from '../../../application/builders/UserCreateQueryFromUserCreateQueryV1Builder';
import { UserUpdateQueryFromUserMeUpdateQueryV1Builder } from '../../../application/builders/UserUpdateQueryFromUserMeUpdateQueryV1Builder';
import { UserV1FromUserBuilder } from '../../../application/builders/UserV1FromUserBuilder';
import { CreateUserUseCaseHandler } from '../../../application/handlers/CreateUserUseCaseHandler';
import { UpdateUserUseCaseHandler } from '../../../application/handlers/UpdateUserUseCaseHandler';
import { UserCreatedEventHandler } from '../../../application/handlers/UserCreatedEventHandler';
import { UserUpdatedEventHandler } from '../../../application/handlers/UserUpdatedEventHandler';
import { UserCodeManagementInputPort } from '../../../application/ports/input/UserCodeManagementInputPort';
import { UserManagementInputPort } from '../../../application/ports/input/UserManagementInputPort';

@Module({})
export class UserApplicationModule {
  public static forRootAsync(
    imports?: Array<
      Type<unknown> | DynamicModule | Promise<DynamicModule> | ForwardReference
    >,
  ): DynamicModule {
    return {
      exports: [UserCodeManagementInputPort, UserManagementInputPort],
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
        UpdateUserUseCaseHandler,
        UserActivationMailDeliveryOptionsFromUserBuilder,
        UserCodeCreateQueryFromUserBuilder,
        UserCodeManagementInputPort,
        UserCreatedEventHandler,
        UserCreateQueryFromUserCreateQueryV1Builder,
        UserManagementInputPort,
        UserUpdatedEventHandler,
        UserUpdateQueryFromUserMeUpdateQueryV1Builder,
        UserV1FromUserBuilder,
      ],
    };
  }
}
