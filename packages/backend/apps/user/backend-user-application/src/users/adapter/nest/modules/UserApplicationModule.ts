import { UuidModule } from '@cornie-js/backend-app-uuid';
import { UserDomainModule } from '@cornie-js/backend-user-domain';
import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';

import { HashModule } from '../../../../foundation/hash/adapter/nest/modules/HashModule';
import { UserCreateQueryFromUserCreateQueryV1Builder } from '../../../application/converters/UserCreateQueryFromUserCreateQueryV1Builder';
import { UserUpdateQueryFromUserMeUpdateQueryV1Builder } from '../../../application/converters/UserUpdateQueryFromUserMeUpdateQueryV1Builder';
import { UserV1FromUserBuilder } from '../../../application/converters/UserV1FromUserBuilder';
import { UserManagementInputPort } from '../../../application/ports/input/UserManagementInputPort';

@Module({})
export class UserApplicationModule {
  public static forRootAsync(
    imports?: Array<
      Type<unknown> | DynamicModule | Promise<DynamicModule> | ForwardReference
    >,
  ): DynamicModule {
    return {
      exports: [UserManagementInputPort],
      global: false,
      imports: [...(imports ?? []), HashModule, UuidModule, UserDomainModule],
      module: UserApplicationModule,
      providers: [
        UserCreateQueryFromUserCreateQueryV1Builder,
        UserManagementInputPort,
        UserUpdateQueryFromUserMeUpdateQueryV1Builder,
        UserV1FromUserBuilder,
      ],
    };
  }
}
