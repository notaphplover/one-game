import { GameOptions } from './GameOptions';

export interface FormFieldsNewGame {
  name?: string;
  players: number;
  options: GameOptions;
}
