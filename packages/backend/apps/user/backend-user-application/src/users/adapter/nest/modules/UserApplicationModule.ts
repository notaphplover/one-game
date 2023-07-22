import { EnvModule } from '@cornie-js/backend-app-user-env';
import { UuidModule } from '@cornie-js/backend-app-uuid';
import { UserDomainModule } from '@cornie-js/backend-user-domain';
import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';

import { HashModule } from '../../../../foundation/hash/adapter/nest/modules/HashModule';
import { StringModule } from '../../../../foundation/string/adapter/nest/StringModule';
import { UserActivationMailDeliveryOptionsFromUserBuilder } from '../../../application/builders/UserActivationMailDeliveryOptionsFromUserBuilder';
import { UserCreateQueryFromUserCreateQueryV1Builder } from '../../../application/converters/UserCreateQueryFromUserCreateQueryV1Builder';
import { UserUpdateQueryFromUserMeUpdateQueryV1Builder } from '../../../application/converters/UserUpdateQueryFromUserMeUpdateQueryV1Builder';
import { UserV1FromUserBuilder } from '../../../application/converters/UserV1FromUserBuilder';
import { UserCreatedEventHandler } from '../../../application/handlers/UserCreatedEventHandler';
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
        UserActivationMailDeliveryOptionsFromUserBuilder,
        UserCodeManagementInputPort,
        UserCreatedEventHandler,
        UserCreateQueryFromUserCreateQueryV1Builder,
        UserManagementInputPort,
        UserUpdateQueryFromUserMeUpdateQueryV1Builder,
        UserV1FromUserBuilder,
      ],
    };
  }
}
