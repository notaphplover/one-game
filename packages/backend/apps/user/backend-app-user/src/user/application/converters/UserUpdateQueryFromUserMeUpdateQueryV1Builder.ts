import { models as apiModels } from '@cornie-js/api-models';
import { UserUpdateQuery } from '@cornie-js/backend-app-user-models/domain';
import { Builder } from '@cornie-js/backend-common';

import { UuidContext } from '../../../foundation/common/application/models/UuidContext';

export class UserUpdateQueryFromUserMeUpdateQueryV1Builder
  implements
    Builder<UserUpdateQuery, [apiModels.UserMeUpdateQueryV1, UuidContext]>
{
  public build(
    userMeUpdateQueryV1: apiModels.UserMeUpdateQueryV1,
    userMeContext: UuidContext,
  ): UserUpdateQuery {
    const userUpdateQuery: UserUpdateQuery = {
      userFindQuery: {
        id: userMeContext.uuid,
      },
    };

    if (userMeUpdateQueryV1.name !== undefined) {
      userUpdateQuery.name = userMeUpdateQueryV1.name;
    }

    return userUpdateQuery;
  }
}
