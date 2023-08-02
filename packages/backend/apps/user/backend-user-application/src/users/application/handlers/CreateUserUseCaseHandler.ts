import {
  AppError,
  AppErrorKind,
  Either,
  Handler,
  ReportBasedSpec,
} from '@cornie-js/backend-common';
import {
  IsValidUserCreateQuerySpec,
  User,
  UserCreateQuery,
} from '@cornie-js/backend-user-domain/users';
import { Inject, Injectable } from '@nestjs/common';

import { UserCreatedEvent } from '../models/UserCreatedEvent';
import {
  UserPersistenceOutputPort,
  userPersistenceOutputPortSymbol,
} from '../ports/output/UserPersistenceOutputPort';
import { UserCreatedEventHandler } from './UserCreatedEventHandler';

@Injectable()
export class CreateUserUseCaseHandler
  implements Handler<[UserCreateQuery], User>
{
  readonly #isValidUserCreateQuerySpec: ReportBasedSpec<
    [UserCreateQuery],
    string[]
  >;
  readonly #userCreatedEventHandler: Handler<[UserCreatedEvent], void>;
  readonly #userPersistenceOutputPort: UserPersistenceOutputPort;

  constructor(
    @Inject(IsValidUserCreateQuerySpec)
    isValidUserCreateQuerySpec: ReportBasedSpec<[UserCreateQuery], string[]>,
    @Inject(UserCreatedEventHandler)
    userCreatedEventHandler: Handler<[UserCreatedEvent], void>,
    @Inject(userPersistenceOutputPortSymbol)
    userPersistenceOutputPort: UserPersistenceOutputPort,
  ) {
    this.#isValidUserCreateQuerySpec = isValidUserCreateQuerySpec;
    this.#userCreatedEventHandler = userCreatedEventHandler;
    this.#userPersistenceOutputPort = userPersistenceOutputPort;
  }

  public async handle(userCreateQuery: UserCreateQuery): Promise<User> {
    this.#validate(userCreateQuery);

    const user: User = await this.#userPersistenceOutputPort.create(
      userCreateQuery,
    );

    await this.#userCreatedEventHandler.handle({
      user,
      userCreateQuery,
    });

    return user;
  }

  #validate(userCreateQuery: UserCreateQuery): void {
    const isValidUserCreateQueryResult: Either<string[], undefined> =
      this.#isValidUserCreateQuerySpec.isSatisfiedOrReport(userCreateQuery);

    if (!isValidUserCreateQueryResult.isRight) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        `Invalid user create request. Reasons:

${isValidUserCreateQueryResult.value.join('\n')}`,
      );
    }
  }
}
