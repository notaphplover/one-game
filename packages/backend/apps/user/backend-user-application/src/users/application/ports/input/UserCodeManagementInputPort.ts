import {
  UuidProviderOutputPort,
  uuidProviderOutputPortSymbol,
} from '@cornie-js/backend-app-uuid';
import { Builder, Handler } from '@cornie-js/backend-common';
import {
  User,
  UserCode,
  UserCodeCreateQuery,
  UserCodeFindQuery,
  UserCodeKind,
} from '@cornie-js/backend-user-domain/users';
import { Inject } from '@nestjs/common';

import { RandomHexStringBuilder } from '../../../../foundation/string/application/builders/RandomHexStringBuilder';
import { USER_CODE_LENGHT } from '../../data/userCodeLength';
import { UserCodeCreatedEventHandler } from '../../handlers/UserCodeCreatedEventHandler';
import { UserCodeCreatedEvent } from '../../models/UserCodeCreatedEvent';
import {
  UserCodePersistenceOutputPort,
  userCodePersistenceOutputPortSymbol,
} from '../output/UserCodePersistenceOutputPort';

export class UserCodeManagementInputPort {
  readonly #randomHexStringBuilder: Builder<string, [number]>;
  readonly #userCodeCreatedEventHandler: Handler<[UserCodeCreatedEvent], void>;
  readonly #userCodePersistenceOutputPort: UserCodePersistenceOutputPort;
  readonly #uuidProviderOutputPort: UuidProviderOutputPort;

  constructor(
    @Inject(RandomHexStringBuilder)
    randomHexStringBuilder: Builder<string, [number]>,
    @Inject(UserCodeCreatedEventHandler)
    userCodeCreatedEventHandler: Handler<[UserCodeCreatedEvent], void>,
    @Inject(userCodePersistenceOutputPortSymbol)
    userCodePersistenceOutputPort: UserCodePersistenceOutputPort,
    @Inject(uuidProviderOutputPortSymbol)
    uuidProviderOutputPort: UuidProviderOutputPort,
  ) {
    this.#randomHexStringBuilder = randomHexStringBuilder;
    this.#userCodeCreatedEventHandler = userCodeCreatedEventHandler;
    this.#userCodePersistenceOutputPort = userCodePersistenceOutputPort;
    this.#uuidProviderOutputPort = uuidProviderOutputPort;
  }

  public async createFromUser(
    user: User,
    userCodeKind: UserCodeKind,
  ): Promise<void> {
    const userCodeCreateQuery: UserCodeCreateQuery = {
      code: this.#randomHexStringBuilder.build(USER_CODE_LENGHT),
      id: this.#uuidProviderOutputPort.generateV4(),
      kind: userCodeKind,
      userId: user.id,
    };

    const userCode: UserCode =
      await this.#userCodePersistenceOutputPort.create(userCodeCreateQuery);

    await this.#userCodeCreatedEventHandler.handle({
      user,
      userCode,
    });
  }

  public async deleteFromUser(user: User): Promise<void> {
    const userCodeFindQuery: UserCodeFindQuery = {
      userId: user.id,
    };

    await this.#userCodePersistenceOutputPort.delete(userCodeFindQuery);
  }
}
