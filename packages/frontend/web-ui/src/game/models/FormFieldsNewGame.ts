import { GameOptions } from './GameOptions';

export interface FormFieldsNewGame {
  name: string | null;
  players: number;
  options: GameOptions;
}
