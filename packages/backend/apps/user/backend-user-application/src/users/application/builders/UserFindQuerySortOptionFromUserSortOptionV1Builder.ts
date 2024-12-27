import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { UserFindQuerySortOption } from '@cornie-js/backend-user-domain/users';
import { Injectable } from '@nestjs/common';

const MAP: {
  [TKey in apiModels.UserSortOptionV1]: UserFindQuerySortOption;
} = {
  ids: UserFindQuerySortOption.ids,
};

@Injectable()
export class UserFindQuerySortOptionFromUserSortOptionV1Builder
  implements Builder<UserFindQuerySortOption, [apiModels.UserSortOptionV1]>
{
  public build(
    gameSpecSortOptionV1: apiModels.UserSortOptionV1,
  ): UserFindQuerySortOption {
    return MAP[gameSpecSortOptionV1];
  }
}
