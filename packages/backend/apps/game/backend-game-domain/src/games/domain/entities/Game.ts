import { ActiveGame } from './ActiveGame';
import { FinishedGame } from './FinishedGame';
import { NonStartedGame } from './NonStartedGame';

export type Game = ActiveGame | FinishedGame | NonStartedGame;
