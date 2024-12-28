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
  UserFindQuerySortOption,
  UserUpdateQuery,
} from '@cornie-js/backend-user-domain/users';
import { Inject, Injectable } from '@nestjs/common';

import { findByBatchIds } from '../../../../foundation/batching/calculations/findByBatchIds';
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
  readonly #findUsersByBatchIds: (
    userIds: string[],
  ) => Promise<(User | undefined)[]>;
  readonly #updateUserUseCaseHandler: Handler<[UserUpdateQuery], User>;
  readonly #userCodePersistenceOutputPort: UserCodePersistenceOutputPort;
  readonly #userCreateQueryFromUserCreateQueryV1Builder: BuilderAsync<
    UserCreateQuery,
    [apiModels.UserCreateQueryV1, UuidContext]
  >;
  readonly #userPersistenceOutputPort: UserPersistenceOutputPort;
  readonly #userUpdateQueryFromUserMeUpdateQueryV1Builder: BuilderAsync<
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
    userUpdateQueryFromUserMeUpdateQueryV1Builder: BuilderAsync<
      UserUpdateQuery,
      [apiModels.UserMeUpdateQueryV1, UuidContext]
    >,
    @Inject(UserV1FromUserBuilder)
    userV1FromUserBuilder: Builder<apiModels.UserV1, [User]>,
    @Inject(uuidProviderOutputPortSymbol)
    uuidProviderOutputPort: UuidProviderOutputPort,
  ) {
    this.#createUserUseCaseHandler = createUserUseCaseHandler;
    this.#findUsersByBatchIds = findByBatchIds<User, string>(
      (user: User): string => user.id,
      async (ids: string[]): Promise<User[]> =>
        this.#userPersistenceOutputPort.find({ ids }),
    );
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

  public async find(
    userFindQuery: UserFindQuery,
  ): Promise<(apiModels.UserV1 | undefined)[]> {
    if (userFindQuery.sort === UserFindQuerySortOption.ids) {
      return this.#findBySortedIds(userFindQuery);
    }

    const users: User[] =
      await this.#userPersistenceOutputPort.find(userFindQuery);

    return users.map(
      (user: User): apiModels.UserV1 => this.#buildUserV1OrUndefined(user),
    );
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
      await this.#userUpdateQueryFromUserMeUpdateQueryV1Builder.build(
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

  #buildUserV1OrUndefined(userOrUndefined: User): apiModels.UserV1;
  #buildUserV1OrUndefined(userOrUndefined: undefined): undefined;
  #buildUserV1OrUndefined(
    userOrUndefined: User | undefined,
  ): apiModels.UserV1 | undefined;
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

  async #findBySortedIds(
    userFindQuery: UserFindQuery,
  ): Promise<(apiModels.UserV1 | undefined)[]> {
    const ids: string[] = this.#getSortedIds(userFindQuery);

    const users: (User | undefined)[] = await this.#findUsersByBatchIds(ids);

    return users.map((user: User | undefined): apiModels.UserV1 | undefined =>
      this.#buildUserV1OrUndefined(user),
    );
  }

  #getSortedIds(userFindQuery: UserFindQuery): string[] {
    if (
      userFindQuery.email !== undefined ||
      userFindQuery.id !== undefined ||
      userFindQuery.ids === undefined ||
      (userFindQuery.offset !== undefined && userFindQuery.offset !== 0)
    ) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        'Ids sorted user find operations must be filtered only by ids',
      );
    }

    if (
      userFindQuery.limit !== undefined &&
      userFindQuery.ids.length > userFindQuery.limit
    ) {
      throw new AppError(
        AppErrorKind.contractViolation,
        `Invalid ids sorted user find operation. Expected no more than ${userFindQuery.limit.toString()} ids, ${userFindQuery.ids.length.toString()} found instead.`,
      );
    }

    return userFindQuery.ids;
  }
}
