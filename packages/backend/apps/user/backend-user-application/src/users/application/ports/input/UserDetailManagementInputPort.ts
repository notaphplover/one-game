import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { User, UserFindQuery } from '@cornie-js/backend-user-domain/users';
import { Inject, Injectable } from '@nestjs/common';

import { UserDetailV1FromUserBuilder } from '../../builders/UserDetailV1FromUserBuilder';
import {
  UserPersistenceOutputPort,
  userPersistenceOutputPortSymbol,
} from '../output/UserPersistenceOutputPort';

@Injectable()
export class UserDetailManagementInputPort {
  readonly #userDetailV1FromUserBuilder: Builder<
    apiModels.UserDetailV1,
    [User]
  >;

  readonly #userPersistenceOutputPort: UserPersistenceOutputPort;

  constructor(
    @Inject(UserDetailV1FromUserBuilder)
    userDetailV1FromUserBuilder: Builder<apiModels.UserDetailV1, [User]>,
    @Inject(userPersistenceOutputPortSymbol)
    userPersistenceOutputPort: UserPersistenceOutputPort,
  ) {
    this.#userDetailV1FromUserBuilder = userDetailV1FromUserBuilder;
    this.#userPersistenceOutputPort = userPersistenceOutputPort;
  }

  public async findOne(
    id: string,
  ): Promise<apiModels.UserDetailV1 | undefined> {
    const userFindQuery: UserFindQuery = {
      id,
    };

    const userOrUndefined: User | undefined =
      await this.#userPersistenceOutputPort.findOne(userFindQuery);

    return this.#buildUserDetailV1OrUndefined(userOrUndefined);
  }

  #buildUserDetailV1OrUndefined(
    userOrUndefined: User | undefined,
  ): apiModels.UserDetailV1 | undefined {
    let userDetailV1OrUndefined: apiModels.UserDetailV1 | undefined;

    if (userOrUndefined === undefined) {
      userDetailV1OrUndefined = undefined;
    } else {
      userDetailV1OrUndefined =
        this.#userDetailV1FromUserBuilder.build(userOrUndefined);
    }

    return userDetailV1OrUndefined;
  }
}
