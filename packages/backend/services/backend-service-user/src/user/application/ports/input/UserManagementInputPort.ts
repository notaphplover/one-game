import { Inject, Injectable } from '@nestjs/common';
import { models as apiModels } from '@one-game-js/api-models';
import { Converter } from '@one-game-js/backend-common';

import { UuidContext } from '../../../../foundation/common/application/models/UuidContext';
import {
  UuidProviderOutputPort,
  uuidProviderOutputPortSymbol,
} from '../../../../foundation/common/application/ports/output/UuidProviderOutputPort';
import { HashContext } from '../../../../foundation/hash/application/models/HashContext';
import {
  bcryptHashProviderOutputPortSymbol,
  BcryptHashProviderOutputPort,
} from '../../../../foundation/hash/application/ports/output/BcryptHashProviderOutputPort';
import { User } from '../../../domain/models/User';
import { UserCreateQuery } from '../../../domain/models/UserCreateQuery';
import { UserFindQuery } from '../../../domain/models/UserFindQuery';
import { UserCreateQueryV1ToUserCreateQueryConverter } from '../../converters/UserCreateQueryV1ToUserCreateQueryConverter';
import { UserToUserV1Converter } from '../../converters/UserToUserV1Converter';
import {
  UserPersistenceOutputPort,
  userPersistenceOutputPortSymbol,
} from '../output/UserPersistenceOutputPort';

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
