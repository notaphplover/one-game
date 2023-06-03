import { models as apiModels } from '@cornie-js/api-models';

export interface UserParameterV1 {
  readonly userCreateQuery: apiModels.UserCreateQueryV1;
  readonly user: apiModels.UserV1;
}
