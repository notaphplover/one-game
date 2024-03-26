import { GameOptions } from './GameOptions';

export interface CreateNewGameHttpRequest {
  gameSlotsAmount: number;
  name: string;
  options: GameOptions;
}
