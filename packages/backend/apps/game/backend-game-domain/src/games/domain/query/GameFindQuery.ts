import { GameStatus } from '../models/GameStatus';
import { GameSlotFindQuery } from './GameSlotFindQuery';
import { GameStateFindQuery } from './GameStateFindQuery';

export interface GameFindQuery {
  readonly gameSlotFindQuery?: GameSlotFindQuery;
  readonly id?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly state?: GameStateFindQuery;
  readonly status?: GameStatus;
}
