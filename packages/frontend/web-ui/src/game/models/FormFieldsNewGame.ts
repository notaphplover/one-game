import { GameOptions } from './GameOptions';

export interface FormFieldsNewGame {
  name: string | undefined;
  players: number;
  options: GameOptions;
}
