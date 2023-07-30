import { models as apiModels } from '@cornie-js/api-models';
import {
  UuidProviderOutputPort,
  uuidProviderOutputPortSymbol,
} from '@cornie-js/backend-app-uuid';
import {
  AppError,
  AppErrorKind,
  Builder,
  Either,
  Handler,
  ReportBasedSpec,
} from '@cornie-js/backend-common';
import {
  IsValidUserCreateQuerySpec,
  User,
  UserCreateQuery,
  UserFindQuery,
  UserUpdateQuery,
} from '@cornie-js/backend-user-domain/users';
import { Inject, Injectable } from '@nestjs/common';

import { UuidContext } from '../../../../foundation/common/application/models/UuidContext';
import { HashContext } from '../../../../foundation/hash/application/models/HashContext';
import {
  bcryptHashProviderOutputPortSymbol,
  BcryptHashProviderOutputPort,
} from '../../../../foundation/hash/application/ports/output/BcryptHashProviderOutputPort';
import { UserCreateQueryFromUserCreateQueryV1Builder } from '../../converters/UserCreateQueryFromUserCreateQueryV1Builder';
import { UserUpdateQueryFromUserMeUpdateQueryV1Builder } from '../../converters/UserUpdateQueryFromUserMeUpdateQueryV1Builder';
import { UserV1FromUserBuilder } from '../../converters/UserV1FromUserBuilder';
import { UserCreatedEventHandler } from '../../handlers/UserCreatedEventHandler';
import { UserUpdatedEventHandler } from '../../handlers/UserUpdatedEventHandler';
import { UserCreatedEvent } from '../../models/UserCreatedEvent';
import { UserUpdatedEvent } from '../../models/UserUpdatedEvent';
import {
  UserPersistenceOutputPort,
  userPersistenceOutputPortSymbol,
} from '../output/UserPersistenceOutputPort';

@Injectable()
export class UserManagementInputPort {
  readonly #bcryptHashProviderOutputPort: BcryptHashProviderOutputPort;
  readonly #isValidUserCreateQuerySpec: ReportBasedSpec<
    [UserCreateQuery],
    string[]
  >;
  readonly #userCreatedEventHandler: Handler<[UserCreatedEvent], void>;
  readonly #userCreateQueryFromUserCreateQueryV1Builder: Builder<
    UserCreateQuery,
    [apiModels.UserCreateQueryV1, HashContext & UuidContext]
  >;
  readonly #userPersistenceOutputPort: UserPersistenceOutputPort;
  readonly #userUpdatedEventHandler: Handler<[UserUpdatedEvent], void>;
  readonly #userUpdateQueryFromUserMeUpdateQueryV1Builder: Builder<
    UserUpdateQuery,
    [apiModels.UserMeUpdateQueryV1, UuidContext]
  >;
  readonly #userV1FromUserBuilder: Builder<apiModels.UserV1, [User]>;
  readonly #uuidProviderOutputPort: UuidProviderOutputPort;

  constructor(
    @Inject(bcryptHashProviderOutputPortSymbol)
    bcryptHashProviderOutputPort: BcryptHashProviderOutputPort,
    @Inject(IsValidUserCreateQuerySpec)
    isValidUserCreateQuerySpec: ReportBasedSpec<[UserCreateQuery], string[]>,
    @Inject(UserCreatedEventHandler)
    userCreatedEventHandler: Handler<[UserCreatedEvent], void>,
    @Inject(UserCreateQueryFromUserCreateQueryV1Builder)
    userCreateQueryFromUserCreateQueryV1Builder: Builder<
      UserCreateQuery,
      [apiModels.UserCreateQueryV1, HashContext & UuidContext]
    >,
    @Inject(userPersistenceOutputPortSymbol)
    userPersistenceOutputPort: UserPersistenceOutputPort,
    @Inject(UserUpdatedEventHandler)
    userUpdatedEventHandler: Handler<[UserUpdatedEvent], void>,
    @Inject(UserUpdateQueryFromUserMeUpdateQueryV1Builder)
    userUpdateQueryFromUserMeUpdateQueryV1Builder: Builder<
      UserUpdateQuery,
      [apiModels.UserMeUpdateQueryV1, UuidContext]
    >,
    @Inject(UserV1FromUserBuilder)
    userV1FromUserBuilder: Builder<apiModels.UserV1, [User]>,
    @Inject(uuidProviderOutputPortSymbol)
    uuidProviderOutputPort: UuidProviderOutputPort,
  ) {
    this.#bcryptHashProviderOutputPort = bcryptHashProviderOutputPort;
    this.#isValidUserCreateQuerySpec = isValidUserCreateQuerySpec;
    this.#userCreatedEventHandler = userCreatedEventHandler;
    this.#userCreateQueryFromUserCreateQueryV1Builder =
      userCreateQueryFromUserCreateQueryV1Builder;
    this.#userPersistenceOutputPort = userPersistenceOutputPort;
    this.#userUpdatedEventHandler = userUpdatedEventHandler;
    this.#userUpdateQueryFromUserMeUpdateQueryV1Builder =
      userUpdateQueryFromUserMeUpdateQueryV1Builder;
    this.#userV1FromUserBuilder = userV1FromUserBuilder;
    this.#uuidProviderOutputPort = uuidProviderOutputPort;
  }

  public async create(
    userCreateQueryV1: apiModels.UserCreateQueryV1,
  ): Promise<apiModels.UserV1> {
    const userCreateQueryContext: HashContext & UuidContext =
      await this.#buildCreateContext(userCreateQueryV1);

    const userCreateQuery: UserCreateQuery =
      this.#userCreateQueryFromUserCreateQueryV1Builder.build(
        userCreateQueryV1,
        userCreateQueryContext,
      );

    const isValidUserCreateQueryResult: Either<string[], undefined> =
      this.#isValidUserCreateQuerySpec.isSatisfiedOrReport(userCreateQuery);

    if (!isValidUserCreateQueryResult.isRight) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        `Invalid user create request. Reasons:

${isValidUserCreateQueryResult.value.join('\n')}`,
      );
    }

    const user: User = await this.#userPersistenceOutputPort.create(
      userCreateQuery,
    );

    await this.#userCreatedEventHandler.handle({
      user,
      userCreateQuery,
    });

    return this.#userV1FromUserBuilder.build(user);
  }

  public async delete(id: string): Promise<void> {
    const userFindQuery: UserFindQuery = {
      id,
    };

    await this.#userPersistenceOutputPort.delete(userFindQuery);
  }

  public async findOne(id: string): Promise<apiModels.UserV1 | undefined> {
    const userFindQuery: UserFindQuery = {
      id,
    };

    const userOrUndefined: User | undefined =
      await this.#userPersistenceOutputPort.findOne(userFindQuery);

    return this.#buildUserV1OrUndefined(userOrUndefined);
  }

  public async updateMe(
    id: string,
    userMeUpdateQueryV1: apiModels.UserMeUpdateQueryV1,
  ): Promise<apiModels.UserV1> {
    const userBeforeUpdate: User = await this.#getUserOrThrowUnknown(id);

    const userUpdateQuery: UserUpdateQuery =
      this.#userUpdateQueryFromUserMeUpdateQueryV1Builder.build(
        userMeUpdateQueryV1,
        {
          uuid: id,
        },
      );

    await this.#userPersistenceOutputPort.update(userUpdateQuery);

    await this.#userUpdatedEventHandler.handle({
      userBeforeUpdate: userBeforeUpdate,
      userUpdateQuery,
    });

    const userOrUndefined: User | undefined =
      await this.#userPersistenceOutputPort.findOne({
        id,
      });

    return this.#buildUserV1OrThrowUnknownError(id, userOrUndefined);
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

  #buildUserV1OrThrowUnknownError(
    id: string,
    userOrUndefined: User | undefined,
  ): apiModels.UserV1 {
    const userV1: apiModels.UserV1 | undefined =
      this.#buildUserV1OrUndefined(userOrUndefined);

    if (userV1 === undefined) {
      throw new AppError(AppErrorKind.unknown, `Unable to fetch user "${id}"`);
    }

    return userV1;
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

  async #getUserOrThrowUnknown(id: string): Promise<User> {
    const userOrUndefined: User | undefined =
      await this.#userPersistenceOutputPort.findOne({
        id,
      });

    if (userOrUndefined === undefined) {
      throw new AppError(AppErrorKind.unknown, `Unable to fetch user "${id}"`);
    }

    return userOrUndefined;
  }
}
