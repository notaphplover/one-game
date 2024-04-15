import { GameOptionsV1 } from '@cornie-js/api-models/lib/models/types';

export interface CreateNewGameHttpRequest {
  gameSlotsAmount: number;
  name?: string;
  options: GameOptionsV1;
}
