import { GameOptions } from './GameOptions';

export interface CreateNewGameResult {
  gameName: string;
  numberOfPlayers: number;
  gameOptions: GameOptions;
  openOptions: boolean;
  setNewGame: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setNewGameOptions: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setNumberOfPlayers: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setHandleOpenOptions: () => void;
  setHandleCloseOptions: () => void;
}
