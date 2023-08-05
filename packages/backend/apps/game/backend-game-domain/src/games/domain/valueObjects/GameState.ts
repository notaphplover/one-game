import { ActiveGameState } from './ActiveGameState';
import { FinishedGameState } from './FinishedGameState';
import { NonStartedGameState } from './NonStartedGameState';

export type GameState =
  | ActiveGameState
  | FinishedGameState
  | NonStartedGameState;
