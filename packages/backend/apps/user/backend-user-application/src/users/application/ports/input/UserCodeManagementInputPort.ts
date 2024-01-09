import {
  UuidProviderOutputPort,
  uuidProviderOutputPortSymbol,
} from '@cornie-js/backend-app-uuid';
import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import {
  User,
  UserCanCreateCodeSpec,
  UserCodeCreateQuery,
  UserCodeFindQuery,
} from '@cornie-js/backend-user-domain/users';
import { Inject } from '@nestjs/common';

import { RandomHexStringBuilder } from '../../../../foundation/string/application/builders/RandomHexStringBuilder';
import { USER_CODE_LENGHT } from '../../data/userCodeLength';
import {
  UserCodePersistenceOutputPort,
  userCodePersistenceOutputPortSymbol,
} from '../output/UserCodePersistenceOutputPort';

export class UserCodeManagementInputPort {
  readonly #randomHexStringBuilder: Builder<string, [number]>;
  readonly #userCanCreateCodeSpec: UserCanCreateCodeSpec;
  readonly #userCodePersistenceOutputPort: UserCodePersistenceOutputPort;
  readonly #uuidProviderOutputPort: UuidProviderOutputPort;

  constructor(
    @Inject(RandomHexStringBuilder)
    randomHexStringBuilder: Builder<string, [number]>,
    @Inject(UserCanCreateCodeSpec)
    userCanCreateCodeSpec: UserCanCreateCodeSpec,
    @Inject(userCodePersistenceOutputPortSymbol)
    userCodePersistenceOutputPort: UserCodePersistenceOutputPort,
    @Inject(uuidProviderOutputPortSymbol)
    uuidProviderOutputPort: UuidProviderOutputPort,
  ) {
    this.#randomHexStringBuilder = randomHexStringBuilder;
    this.#userCanCreateCodeSpec = userCanCreateCodeSpec;
    this.#userCodePersistenceOutputPort = userCodePersistenceOutputPort;
    this.#uuidProviderOutputPort = uuidProviderOutputPort;
  }

  public async createFromUser(user: User): Promise<void> {
    this.#validateUserCanCreateCodeOrThrow(user);

    const userCodeCreateQuery: UserCodeCreateQuery = {
      code: this.#randomHexStringBuilder.build(USER_CODE_LENGHT),
      id: this.#uuidProviderOutputPort.generateV4(),
      userId: user.id,
    };

    await this.#userCodePersistenceOutputPort.create(userCodeCreateQuery);
  }

  public async deleteFromUser(user: User): Promise<void> {
    const userCodeFindQuery: UserCodeFindQuery = {
      userId: user.id,
    };

    await this.#userCodePersistenceOutputPort.delete(userCodeFindQuery);
  }

  #validateUserCanCreateCodeOrThrow(user: User): void {
    if (!this.#userCanCreateCodeSpec.isSatisfiedBy(user)) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        'Unable to perform operation',
      );
    }
  }
}
