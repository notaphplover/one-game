import { models as apiModels } from '@cornie-js/api-models';
import { BuilderAsync, Writable } from '@cornie-js/backend-common';
import { UserUpdateQuery } from '@cornie-js/backend-user-domain/users';
import { Inject, Injectable } from '@nestjs/common';

import { UuidContext } from '../../../foundation/common/application/models/UuidContext';
import {
  BcryptHashProviderOutputPort,
  bcryptHashProviderOutputPortSymbol,
} from '../../../foundation/hash/application/ports/output/BcryptHashProviderOutputPort';

@Injectable()
export class UserUpdateQueryFromUserMeUpdateQueryV1Builder
  implements
    BuilderAsync<UserUpdateQuery, [apiModels.UserMeUpdateQueryV1, UuidContext]>
{
  readonly #bcryptHashProviderOutputPort: BcryptHashProviderOutputPort;

  constructor(
    @Inject(bcryptHashProviderOutputPortSymbol)
    bcryptHashProviderOutputPort: BcryptHashProviderOutputPort,
  ) {
    this.#bcryptHashProviderOutputPort = bcryptHashProviderOutputPort;
  }

  public async build(
    userMeUpdateQueryV1: apiModels.UserMeUpdateQueryV1,
    userMeContext: UuidContext,
  ): Promise<UserUpdateQuery> {
    const userUpdateQuery: Writable<UserUpdateQuery> = {
      userFindQuery: {
        id: userMeContext.uuid,
      },
    };

    if (userMeUpdateQueryV1.active !== undefined) {
      userUpdateQuery.active = userMeUpdateQueryV1.active;
    }

    if (userMeUpdateQueryV1.name !== undefined) {
      userUpdateQuery.name = userMeUpdateQueryV1.name;
    }

    if (userMeUpdateQueryV1.password !== undefined) {
      userUpdateQuery.passwordHash =
        await this.#bcryptHashProviderOutputPort.hash(
          userMeUpdateQueryV1.password,
        );
    }

    return userUpdateQuery;
  }
}
