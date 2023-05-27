import { models as apiModels } from '@cornie-js/api-models';
import { User } from '@cornie-js/backend-app-user-models/domain';
import { Builder } from '@cornie-js/backend-common';

export class UserV1FromUserBuilder
  implements Builder<apiModels.UserV1, [User]>
{
  public build(user: User): apiModels.UserV1 {
    return {
      id: user.id,
      name: user.name,
    };
  }
}
