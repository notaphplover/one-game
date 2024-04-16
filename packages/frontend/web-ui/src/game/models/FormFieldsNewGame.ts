import { models as apiModels } from '@cornie-js/api-models';

export interface FormFieldsNewGame {
  name?: string;
  players: number;
  options: apiModels.GameOptionsV1;
}
