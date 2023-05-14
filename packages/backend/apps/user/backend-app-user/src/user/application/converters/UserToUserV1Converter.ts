import { models as apiModels } from '@cornie-js/api-models';
import { User } from '@cornie-js/backend-app-user-models/domain';
import { Converter } from '@cornie-js/backend-common';

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
