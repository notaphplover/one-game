import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { UserCodeKind } from '@cornie-js/backend-user-domain/users';
import { Injectable } from '@nestjs/common';

const USERCODE_KIND_V1_TO_USER_CODE_KIND_MAP: {
  [TKey in apiModels.UserCodeKindV1]: UserCodeKind;
} = {
  registerConfirm: UserCodeKind.registerConfirm,
  resetPassword: UserCodeKind.resetPassword,
};

@Injectable()
export class UserCodeKindFromUserCodeKindV1Builder
  implements Builder<UserCodeKind, [apiModels.UserCodeKindV1]>
{
  public build(userCodeKindV1: apiModels.UserCodeKindV1): UserCodeKind {
    return USERCODE_KIND_V1_TO_USER_CODE_KIND_MAP[userCodeKindV1];
  }
}
