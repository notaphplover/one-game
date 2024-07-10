import {
  AppError,
  AppErrorKind,
  Either,
  Handler,
  ReportBasedSpec,
} from '@cornie-js/backend-common';
import { TransactionWrapper } from '@cornie-js/backend-db/application';
import {
  IsValidUserCreateQuerySpec,
  User,
  UserCreateQuery,
} from '@cornie-js/backend-user-domain/users';
import { Inject, Injectable } from '@nestjs/common';

import {
  TransactionProvisionOutputPort,
  transactionProvisionOutputPortSymbol,
} from '../../../foundation/db/application/ports/output/TransactionProvisionOutputPort';
import {
  UserPersistenceOutputPort,
  userPersistenceOutputPortSymbol,
} from '../ports/output/UserPersistenceOutputPort';

@Injectable()
export class CreateUserUseCaseHandler
  implements Handler<[UserCreateQuery], User>
{
  readonly #isValidUserCreateQuerySpec: ReportBasedSpec<
    [UserCreateQuery],
    string[]
  >;
  readonly #transactionProvisionOutputPort: TransactionProvisionOutputPort;
  readonly #userPersistenceOutputPort: UserPersistenceOutputPort;

  constructor(
    @Inject(IsValidUserCreateQuerySpec)
    isValidUserCreateQuerySpec: ReportBasedSpec<[UserCreateQuery], string[]>,
    @Inject(transactionProvisionOutputPortSymbol)
    transactionProvisionOutputPort: TransactionProvisionOutputPort,
    @Inject(userPersistenceOutputPortSymbol)
    userPersistenceOutputPort: UserPersistenceOutputPort,
  ) {
    this.#isValidUserCreateQuerySpec = isValidUserCreateQuerySpec;
    this.#transactionProvisionOutputPort = transactionProvisionOutputPort;
    this.#userPersistenceOutputPort = userPersistenceOutputPort;
  }

  public async handle(userCreateQuery: UserCreateQuery): Promise<User> {
    this.#validate(userCreateQuery);

    await using transactionWrapper: TransactionWrapper =
      await this.#transactionProvisionOutputPort.provide();

    const user: User = await this.#userPersistenceOutputPort.create(
      userCreateQuery,
      transactionWrapper,
    );

    await transactionWrapper.tryCommit();

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
