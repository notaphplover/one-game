import { models as apiModels } from '@cornie-js/api-models';
import { UserCreateQuery } from '@cornie-js/backend-app-user-models/domain';
import { Converter } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';

import { UuidContext } from '../../../foundation/common/application/models/UuidContext';
import { HashContext } from '../../../foundation/hash/application/models/HashContext';

@Injectable()
export class UserCreateQueryV1ToUserCreateQueryConverter
  implements
    Converter<apiModels.UserCreateQueryV1, UserCreateQuery, UuidContext>
{
  public convert(
    userCreateQueryV1: apiModels.UserCreateQueryV1,
    context: HashContext & UuidContext,
  ): UserCreateQuery {
    return {
      email: userCreateQueryV1.email,
      id: context.uuid,
      name: userCreateQueryV1.name,
      passwordHash: context.hash,
    };
  }
}
