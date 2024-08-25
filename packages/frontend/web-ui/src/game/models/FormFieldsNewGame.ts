import { GameOptions } from './GameOptions';

export interface FormFieldsNewGame {
  isPublic: boolean;
  name: string | undefined;
  players: number;
  options: GameOptions;
}
