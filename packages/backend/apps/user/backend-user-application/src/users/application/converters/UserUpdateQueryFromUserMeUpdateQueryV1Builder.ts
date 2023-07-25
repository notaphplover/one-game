import { models as apiModels } from '@cornie-js/api-models';
import { Builder, Writable } from '@cornie-js/backend-common';
import { UserUpdateQuery } from '@cornie-js/backend-user-domain/users';

import { UuidContext } from '../../../foundation/common/application/models/UuidContext';

export class UserUpdateQueryFromUserMeUpdateQueryV1Builder
  implements
    Builder<UserUpdateQuery, [apiModels.UserMeUpdateQueryV1, UuidContext]>
{
  public build(
    userMeUpdateQueryV1: apiModels.UserMeUpdateQueryV1,
    userMeContext: UuidContext,
  ): UserUpdateQuery {
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

    return userUpdateQuery;
  }
}
