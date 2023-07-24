import { Handler } from '@cornie-js/backend-common';
import { UserCodeFindQuery } from '@cornie-js/backend-user-domain/users';
import { Inject, Injectable } from '@nestjs/common';

import { UserUpdatedEvent } from '../models/UserUpdatedEvent';
import {
  UserCodePersistenceOutputPort,
  userCodePersistenceOutputPortSymbol,
} from '../ports/output/UserCodePersistenceOutputPort';

@Injectable()
export class UserUpdatedEventHandler
  implements Handler<[UserUpdatedEvent], void>
{
  readonly #userCodePersistenceOutputPort: UserCodePersistenceOutputPort;

  constructor(
    @Inject(userCodePersistenceOutputPortSymbol)
    userCodePersistenceOutputPort: UserCodePersistenceOutputPort,
  ) {
    this.#userCodePersistenceOutputPort = userCodePersistenceOutputPort;
  }

  public async handle(userUpdatedEvent: UserUpdatedEvent): Promise<void> {
    if (
      !userUpdatedEvent.userBeforeUpdate.active &&
      userUpdatedEvent.userUpdateQuery.active === true
    ) {
      const userCodeFindQuery: UserCodeFindQuery = {
        userId: userUpdatedEvent.userBeforeUpdate.id,
      };

      await this.#userCodePersistenceOutputPort.delete(userCodeFindQuery);
    }
  }
}
