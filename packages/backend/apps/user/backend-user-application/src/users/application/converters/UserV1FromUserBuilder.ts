import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { User } from '@cornie-js/backend-user-domain/users';

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
