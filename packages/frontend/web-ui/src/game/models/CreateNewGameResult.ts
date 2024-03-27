import { CreateNewGameStatus } from './CreateNewGameStatus';
import { GameOptions } from './GameOptions';

export interface CreateNewGameResult {
  gameName: string;
  numberOfPlayers: number;
  gameOptions: GameOptions;
  status: CreateNewGameStatus;
  setNewGame: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setNewGameOptions: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setNumberOfPlayers: (event: React.ChangeEvent<HTMLInputElement>) => void;
  notifyFormFieldsFilled: () => void;
}
