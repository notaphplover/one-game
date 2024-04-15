import { GameOptionsV1 } from '@cornie-js/api-models/lib/models/types';

export interface FormFieldsNewGame {
  name?: string;
  players: number;
  options: GameOptionsV1;
}
