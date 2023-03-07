import { models as apiModels } from '@one-game-js/backend-api-models';
import { Converter } from '@one-game-js/backend-common';

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
