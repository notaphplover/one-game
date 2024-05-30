import { models as apiModels } from '@cornie-js/api-models';

export interface CreateAuthV2QueryArgs {
  authCreateQuery: apiModels.AuthCreateQueryV2;
}

export interface CreateAuthV2RefreshTokenArgs {
  refreshToken: string;
}

export type CreateAuthV2Args =
  | CreateAuthV2QueryArgs
  | CreateAuthV2RefreshTokenArgs;
