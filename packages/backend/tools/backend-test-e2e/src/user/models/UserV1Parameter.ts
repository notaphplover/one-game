import { models as apiModels } from '@cornie-js/api-models';

export interface UserV1Parameter {
  readonly userCreateQuery: apiModels.UserCreateQueryV1;
  readonly user: apiModels.UserV1;
}
