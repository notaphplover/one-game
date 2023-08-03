import { Card } from '../../../cards/domain/valueObjects/Card';
import { GameSlotFindQuery } from './GameSlotFindQuery';

export interface GameSlotUpdateQuery {
  gameSlotFindQuery: GameSlotFindQuery;

  cards?: Card[];
}
