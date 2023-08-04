import {
  AppError,
  AppErrorKind,
  Either,
  Handler,
  ReportBasedSpec,
} from '@cornie-js/backend-common';
import {
  IsValidUserUpdateQuerySpec,
  User,
  UserFindQuery,
  UserUpdateQuery,
} from '@cornie-js/backend-user-domain/users';
import { Inject } from '@nestjs/common';

import { UserUpdatedEvent } from '../models/UserUpdatedEvent';
import {
  UserPersistenceOutputPort,
  userPersistenceOutputPortSymbol,
} from '../ports/output/UserPersistenceOutputPort';
import { UserUpdatedEventHandler } from './UserUpdatedEventHandler';

export class UpdateUserUseCaseHandler
  implements Handler<[UserUpdateQuery], User>
{
  readonly #isValidUserUpdateQuerySpec: ReportBasedSpec<
    [UserUpdateQuery],
    string[]
  >;
  readonly #userUpdatedEventHandler: Handler<[UserUpdatedEvent], void>;
  readonly #userPersistenceOutputPort: UserPersistenceOutputPort;

  constructor(
    @Inject(IsValidUserUpdateQuerySpec)
    isValidUserUpdateQuerySpec: ReportBasedSpec<[UserUpdateQuery], string[]>,
    @Inject(UserUpdatedEventHandler)
    userUpdatedEventHandler: Handler<[UserUpdatedEvent], void>,
    @Inject(userPersistenceOutputPortSymbol)
    userPersistenceOutputPort: UserPersistenceOutputPort,
  ) {
    this.#isValidUserUpdateQuerySpec = isValidUserUpdateQuerySpec;
    this.#userUpdatedEventHandler = userUpdatedEventHandler;
    this.#userPersistenceOutputPort = userPersistenceOutputPort;
  }

  public async handle(userUpdateQuery: UserUpdateQuery): Promise<User> {
    this.#validate(userUpdateQuery);

    const userBeforeUpdate: User = await this.#getUserOrThrowNotFound(
      userUpdateQuery.userFindQuery,
    );

    await this.#userPersistenceOutputPort.update(userUpdateQuery);

    await this.#userUpdatedEventHandler.handle({
      userBeforeUpdate: userBeforeUpdate,
      userUpdateQuery,
    });

    return this.#getUserOrThrowNotFound(userUpdateQuery.userFindQuery);
  }

  async #getUserOrThrowNotFound(userFindQuery: UserFindQuery): Promise<User> {
    const userOrUndefined: User | undefined =
      await this.#userPersistenceOutputPort.findOne(userFindQuery);

    if (userOrUndefined === undefined) {
      throw new AppError(
        AppErrorKind.entityNotFound,
        `Unable to fetch user to update`,
      );
    }

    return userOrUndefined;
  }

  #validate(userUpdateQuery: UserUpdateQuery): void {
    const isValidUserUpdateQueryResult: Either<string[], undefined> =
      this.#isValidUserUpdateQuerySpec.isSatisfiedOrReport(userUpdateQuery);

    if (!isValidUserUpdateQueryResult.isRight) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        `Invalid user update request. Reasons:

${isValidUserUpdateQueryResult.value.join('\n')}`,
      );
    }
  }
}
