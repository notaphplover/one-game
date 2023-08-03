import { ActiveGameState } from './ActiveGameState';
import { NonStartedGameState } from './NonStartedGameState';

export type GameState = ActiveGameState | NonStartedGameState;
