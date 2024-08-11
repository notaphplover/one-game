import { GameStatus } from '../valueObjects/GameStatus';
import { GameSlotFindQuery } from './GameSlotFindQuery';
import { GameStateFindQuery } from './GameStateFindQuery';

export interface GameFindQuery {
  readonly gameSlotFindQuery?: GameSlotFindQuery;
  readonly id?: string;
  readonly isPublic?: boolean;
  readonly limit?: number;
  readonly offset?: number;
  readonly state?: GameStateFindQuery;
  readonly status?: GameStatus;
}
