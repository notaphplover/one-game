import { models as apiModels } from '@cornie-js/api-models';
import {
  UserPersistenceOutputPort,
  userPersistenceOutputPortSymbol,
} from '@cornie-js/backend-app-user-models/application';
import {
  User,
  UserCreateQuery,
  UserFindQuery,
} from '@cornie-js/backend-app-user-models/domain';
import {
  UuidProviderOutputPort,
  uuidProviderOutputPortSymbol,
} from '@cornie-js/backend-app-uuid';
import { Builder } from '@cornie-js/backend-common';
import { Inject, Injectable } from '@nestjs/common';

import { UuidContext } from '../../../../foundation/common/application/models/UuidContext';
import { HashContext } from '../../../../foundation/hash/application/models/HashContext';
import {
  bcryptHashProviderOutputPortSymbol,
  BcryptHashProviderOutputPort,
} from '../../../../foundation/hash/application/ports/output/BcryptHashProviderOutputPort';
import { UserCreateQueryFromUserCreateQueryV1Builder } from '../../converters/UserCreateQueryFromUserCreateQueryV1Builder';
import { UserV1FromUserBuilder } from '../../converters/UserV1FromUserBuilder';

@Injectable()
export class UserManagementInputPort {
  readonly #bcryptHashProviderOutputPort: BcryptHashProviderOutputPort;
  readonly #userCreateQueryFromUserCreateQueryV1Builder: Builder<
    UserCreateQuery,
    [apiModels.UserCreateQueryV1, HashContext & UuidContext]
  >;
  readonly #userPersistenceOutputPort: UserPersistenceOutputPort;
  readonly #userV1FromUserBuilder: Builder<apiModels.UserV1, [User]>;
  readonly #uuidProviderOutputPort: UuidProviderOutputPort;

  constructor(
    @Inject(bcryptHashProviderOutputPortSymbol)
    bcryptHashProviderOutputPort: BcryptHashProviderOutputPort,
    @Inject(UserCreateQueryFromUserCreateQueryV1Builder)
    userCreateQueryFromUserCreateQueryV1Builder: Builder<
      UserCreateQuery,
      [apiModels.UserCreateQueryV1, HashContext & UuidContext]
    >,
    @Inject(userPersistenceOutputPortSymbol)
    userPersistenceOutputPort: UserPersistenceOutputPort,
    @Inject(UserV1FromUserBuilder)
    userV1FromUserBuilder: Builder<apiModels.UserV1, [User]>,
    @Inject(uuidProviderOutputPortSymbol)
    uuidProviderOutputPort: UuidProviderOutputPort,
  ) {
    this.#bcryptHashProviderOutputPort = bcryptHashProviderOutputPort;
    this.#userCreateQueryFromUserCreateQueryV1Builder =
      userCreateQueryFromUserCreateQueryV1Builder;
    this.#userPersistenceOutputPort = userPersistenceOutputPort;
    this.#userV1FromUserBuilder = userV1FromUserBuilder;
    this.#uuidProviderOutputPort = uuidProviderOutputPort;
  }

  public async create(
    userCreateQueryV1: apiModels.UserCreateQueryV1,
  ): Promise<apiModels.UserV1> {
    const context: HashContext & UuidContext = await this.#buildCreateContext(
      userCreateQueryV1,
    );

    const userCreateQuery: UserCreateQuery =
      this.#userCreateQueryFromUserCreateQueryV1Builder.build(
        userCreateQueryV1,
        context,
      );

    const user: User = await this.#userPersistenceOutputPort.create(
      userCreateQuery,
    );

    return this.#userV1FromUserBuilder.build(user);
  }

  public async findOne(id: string): Promise<apiModels.UserV1 | undefined> {
    const userFindQuery: UserFindQuery = {
      id,
    };

    const userOrUndefined: User | undefined =
      await this.#userPersistenceOutputPort.findOne(userFindQuery);

    return this.#buildUserV1OrUndefined(userOrUndefined);
  }

  async #buildCreateContext(
    userCreateQueryV1: apiModels.UserCreateQueryV1,
  ): Promise<HashContext & UuidContext> {
    const passwordHash: string = await this.#bcryptHashProviderOutputPort.hash(
      userCreateQueryV1.password,
    );

    const uuid: string = this.#uuidProviderOutputPort.generateV4();

    return {
      hash: passwordHash,
      uuid,
    };
  }

  #buildUserV1OrUndefined(
    userOrUndefined: User | undefined,
  ): apiModels.UserV1 | undefined {
    let userV1OrUndefined: apiModels.UserV1 | undefined;

    if (userOrUndefined === undefined) {
      userV1OrUndefined = undefined;
    } else {
      userV1OrUndefined = this.#userV1FromUserBuilder.build(userOrUndefined);
    }

    return userV1OrUndefined;
  }
}
