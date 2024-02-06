import { models as apiModels } from '@cornie-js/api-models';
import {
  UuidProviderOutputPort,
  uuidProviderOutputPortSymbol,
} from '@cornie-js/backend-app-uuid';
import {
  AppError,
  AppErrorKind,
  Builder,
  BuilderAsync,
  Handler,
} from '@cornie-js/backend-common';
import {
  User,
  UserCreateQuery,
  UserFindQuery,
  UserUpdateQuery,
} from '@cornie-js/backend-user-domain/users';
import { Inject, Injectable } from '@nestjs/common';

import { UuidContext } from '../../../../foundation/common/application/models/UuidContext';
import { UserCreateQueryFromUserCreateQueryV1Builder } from '../../builders/UserCreateQueryFromUserCreateQueryV1Builder';
import { UserUpdateQueryFromUserMeUpdateQueryV1Builder } from '../../builders/UserUpdateQueryFromUserMeUpdateQueryV1Builder';
import { UserV1FromUserBuilder } from '../../builders/UserV1FromUserBuilder';
import { CreateUserUseCaseHandler } from '../../handlers/CreateUserUseCaseHandler';
import { UpdateUserUseCaseHandler } from '../../handlers/UpdateUserUseCaseHandler';
import {
  UserCodePersistenceOutputPort,
  userCodePersistenceOutputPortSymbol,
} from '../output/UserCodePersistenceOutputPort';
import {
  UserPersistenceOutputPort,
  userPersistenceOutputPortSymbol,
} from '../output/UserPersistenceOutputPort';

@Injectable()
export class UserManagementInputPort {
  readonly #createUserUseCaseHandler: Handler<[UserCreateQuery], User>;
  readonly #updateUserUseCaseHandler: Handler<[UserUpdateQuery], User>;
  readonly #userCodePersistenceOutputPort: UserCodePersistenceOutputPort;
  readonly #userCreateQueryFromUserCreateQueryV1Builder: BuilderAsync<
    UserCreateQuery,
    [apiModels.UserCreateQueryV1, UuidContext]
  >;
  readonly #userPersistenceOutputPort: UserPersistenceOutputPort;
  readonly #userUpdateQueryFromUserMeUpdateQueryV1Builder: Builder<
    UserUpdateQuery,
    [apiModels.UserMeUpdateQueryV1, UuidContext]
  >;
  readonly #userV1FromUserBuilder: Builder<apiModels.UserV1, [User]>;
  readonly #uuidProviderOutputPort: UuidProviderOutputPort;

  constructor(
    @Inject(CreateUserUseCaseHandler)
    createUserUseCaseHandler: Handler<[UserCreateQuery], User>,
    @Inject(UpdateUserUseCaseHandler)
    updateUserUseCaseHandler: Handler<[UserUpdateQuery], User>,
    @Inject(userCodePersistenceOutputPortSymbol)
    userCodePersistenceOutputPort: UserCodePersistenceOutputPort,
    @Inject(UserCreateQueryFromUserCreateQueryV1Builder)
    userCreateQueryFromUserCreateQueryV1Builder: BuilderAsync<
      UserCreateQuery,
      [apiModels.UserCreateQueryV1, UuidContext]
    >,
    @Inject(userPersistenceOutputPortSymbol)
    userPersistenceOutputPort: UserPersistenceOutputPort,
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
    this.#createUserUseCaseHandler = createUserUseCaseHandler;
    this.#updateUserUseCaseHandler = updateUserUseCaseHandler;
    this.#userCodePersistenceOutputPort = userCodePersistenceOutputPort;
    this.#userCreateQueryFromUserCreateQueryV1Builder =
      userCreateQueryFromUserCreateQueryV1Builder;
    this.#userPersistenceOutputPort = userPersistenceOutputPort;
    this.#userUpdateQueryFromUserMeUpdateQueryV1Builder =
      userUpdateQueryFromUserMeUpdateQueryV1Builder;
    this.#userV1FromUserBuilder = userV1FromUserBuilder;
    this.#uuidProviderOutputPort = uuidProviderOutputPort;
  }

  public async create(
    userCreateQueryV1: apiModels.UserCreateQueryV1,
  ): Promise<apiModels.UserV1> {
    const userCreateQueryContext: UuidContext =
      await this.#buildCreateContext();

    const userCreateQuery: UserCreateQuery =
      await this.#userCreateQueryFromUserCreateQueryV1Builder.build(
        userCreateQueryV1,
        userCreateQueryContext,
      );

    const user: User =
      await this.#createUserUseCaseHandler.handle(userCreateQuery);

    return this.#userV1FromUserBuilder.build(user);
  }

  public async delete(id: string): Promise<void> {
    const userFindQuery: UserFindQuery = {
      id,
    };

    const userOrUndefined: User | undefined =
      await this.#userPersistenceOutputPort.findOne(userFindQuery);

    if (userOrUndefined === undefined) {
      throw new AppError(AppErrorKind.entityNotFound, `User "${id}" not found`);
    }

    await this.#userCodePersistenceOutputPort.delete({
      userId: userOrUndefined.id,
    });

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
    const userUpdateQuery: UserUpdateQuery =
      this.#userUpdateQueryFromUserMeUpdateQueryV1Builder.build(
        userMeUpdateQueryV1,
        {
          uuid: id,
        },
      );

    const user: User =
      await this.#updateUserUseCaseHandler.handle(userUpdateQuery);

    return this.#userV1FromUserBuilder.build(user);
  }

  async #buildCreateContext(): Promise<UuidContext> {
    const uuid: string = this.#uuidProviderOutputPort.generateV4();

    return {
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
