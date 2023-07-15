import { GameStatus } from '../models/GameStatus';
import { GameSlotFindQuery } from './GameSlotFindQuery';

export interface GameFindQuery {
  gameSlotFindQuery?: GameSlotFindQuery;
  id?: string;
  limit?: number;
  offset?: number;
  status?: GameStatus;
}
