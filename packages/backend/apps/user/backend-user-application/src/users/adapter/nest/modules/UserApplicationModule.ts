import { UuidModule } from '@cornie-js/backend-app-uuid';
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
      imports: [...(imports ?? []), HashModule, UuidModule],
      module: UserApplicationModule,
      providers: [
        UserCreateQueryFromUserCreateQueryV1Builder,
        UserUpdateQueryFromUserMeUpdateQueryV1Builder,
        UserV1FromUserBuilder,
      ],
    };
  }
}
