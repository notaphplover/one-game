import { models as apiModels } from '@cornie-js/api-models';
import { BuilderAsync } from '@cornie-js/backend-common';
import { UserCreateQuery } from '@cornie-js/backend-user-domain/users';
import { Inject, Injectable } from '@nestjs/common';

import { UuidContext } from '../../../foundation/common/application/models/UuidContext';
import {
  BcryptHashProviderOutputPort,
  bcryptHashProviderOutputPortSymbol,
} from '../../../foundation/hash/application/ports/output/BcryptHashProviderOutputPort';

@Injectable()
export class UserCreateQueryFromUserCreateQueryV1Builder
  implements
    BuilderAsync<UserCreateQuery, [apiModels.UserCreateQueryV1, UuidContext]>
{
  readonly #bcryptHashProviderOutputPort: BcryptHashProviderOutputPort;

  constructor(
    @Inject(bcryptHashProviderOutputPortSymbol)
    bcryptHashProviderOutputPort: BcryptHashProviderOutputPort,
  ) {
    this.#bcryptHashProviderOutputPort = bcryptHashProviderOutputPort;
  }

  public async build(
    userCreateQueryV1: apiModels.UserCreateQueryV1,
    context: UuidContext,
  ): Promise<UserCreateQuery> {
    return {
      active: false,
      email: userCreateQueryV1.email,
      id: context.uuid,
      name: userCreateQueryV1.name,
      passwordHash: await this.#bcryptHashProviderOutputPort.hash(
        userCreateQueryV1.password,
      ),
    };
  }
}
