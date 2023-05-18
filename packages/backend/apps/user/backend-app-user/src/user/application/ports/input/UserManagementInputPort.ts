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
import { Converter } from '@cornie-js/backend-common';
import { Inject, Injectable } from '@nestjs/common';

import { UuidContext } from '../../../../foundation/common/application/models/UuidContext';
import { HashContext } from '../../../../foundation/hash/application/models/HashContext';
import {
  bcryptHashProviderOutputPortSymbol,
  BcryptHashProviderOutputPort,
} from '../../../../foundation/hash/application/ports/output/BcryptHashProviderOutputPort';
import { UserCreateQueryV1ToUserCreateQueryConverter } from '../../converters/UserCreateQueryV1ToUserCreateQueryConverter';
import { UserToUserV1Converter } from '../../converters/UserToUserV1Converter';

@Injectable()
export class UserManagementInputPort {
  readonly #bcryptHashProviderOutputPort: BcryptHashProviderOutputPort;
  readonly #userCreateQueryV1ToUserCreateQueryConverter: Converter<
    apiModels.UserCreateQueryV1,
    UserCreateQuery,
    HashContext & UuidContext
  >;
  readonly #userPersistenceOutputPort: UserPersistenceOutputPort;
  readonly #userToUserV1Converter: Converter<User, apiModels.UserV1>;
  readonly #uuidProviderOutputPort: UuidProviderOutputPort;

  constructor(
    @Inject(bcryptHashProviderOutputPortSymbol)
    bcryptHashProviderOutputPort: BcryptHashProviderOutputPort,
    @Inject(UserCreateQueryV1ToUserCreateQueryConverter)
    userCreateQueryV1ToUserCreateQueryConverter: Converter<
      apiModels.UserCreateQueryV1,
      UserCreateQuery,
      HashContext & UuidContext
    >,
    @Inject(userPersistenceOutputPortSymbol)
    userPersistenceOutputPort: UserPersistenceOutputPort,
    @Inject(UserToUserV1Converter)
    userToUserV1Converter: Converter<User, apiModels.UserV1>,
    @Inject(uuidProviderOutputPortSymbol)
    uuidProviderOutputPort: UuidProviderOutputPort,
  ) {
    this.#bcryptHashProviderOutputPort = bcryptHashProviderOutputPort;
    this.#userCreateQueryV1ToUserCreateQueryConverter =
      userCreateQueryV1ToUserCreateQueryConverter;
    this.#userPersistenceOutputPort = userPersistenceOutputPort;
    this.#userToUserV1Converter = userToUserV1Converter;
    this.#uuidProviderOutputPort = uuidProviderOutputPort;
  }

  public async create(
    userCreateQueryV1: apiModels.UserCreateQueryV1,
  ): Promise<apiModels.UserV1> {
    const context: HashContext & UuidContext = await this.#buildCreateContext(
      userCreateQueryV1,
    );

    const userCreateQuery: UserCreateQuery =
      this.#userCreateQueryV1ToUserCreateQueryConverter.convert(
        userCreateQueryV1,
        context,
      );

    const user: User = await this.#userPersistenceOutputPort.create(
      userCreateQuery,
    );

    return this.#userToUserV1Converter.convert(user);
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
      userV1OrUndefined = this.#userToUserV1Converter.convert(userOrUndefined);
    }

    return userV1OrUndefined;
  }
}
