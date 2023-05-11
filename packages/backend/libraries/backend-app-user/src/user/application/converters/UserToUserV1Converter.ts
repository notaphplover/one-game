import { models as apiModels } from '@cornie-js/api-models';
import { Converter } from '@cornie-js/backend-common';

import { User } from '../../domain/models/User';

export class UserToUserV1Converter
  implements Converter<User, apiModels.UserV1>
{
  public convert(user: User): apiModels.UserV1 {
    return {
      id: user.id,
      name: user.name,
    };
  }
}
