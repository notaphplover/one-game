import { Card } from '../../../cards/domain/models/Card';
import { GameSlotFindQuery } from './GameSlotFindQuery';

export interface GameSlotUpdateQuery {
  gameSlotFindQuery: GameSlotFindQuery;

  cards?: Card[];
}
