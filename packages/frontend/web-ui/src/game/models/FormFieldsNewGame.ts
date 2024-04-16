import { models as apiModels } from '@cornie-js/api-models';

export interface FormFieldsNewGame {
  name?: string;
  players: string;
  options: apiModels.GameOptionsV1;
}
