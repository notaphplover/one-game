import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { User } from '@cornie-js/backend-user-domain/users';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserDetailV1FromUserBuilder
  implements Builder<apiModels.UserDetailV1, [User]>
{
  public build(user: User): apiModels.UserDetailV1 {
    return {
      email: user.email,
    };
  }
}
