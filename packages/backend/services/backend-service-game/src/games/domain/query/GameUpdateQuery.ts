import { Card } from '../../../cards/domain/models/Card';
import { CardColor } from '../../../cards/domain/models/CardColor';
import { GameCardSpec } from '../models/GameCardSpec';
import { GameDirection } from '../models/GameDirection';
import { GameFindQuery } from './GameFindQuery';
import { GameSlotUpdateQuery } from './GameSlotUpdateQuery';

export interface GameUpdateQuery {
  gameFindQuery: GameFindQuery;

  active?: boolean;
  currentCard?: Card;
  currentColor?: CardColor;
  currentDirection?: GameDirection;
  currentPlayingSlotIndex?: number;
  deck?: GameCardSpec[];
  drawCount?: number;
  gameSlotUpdateQueries?: GameSlotUpdateQuery[];
}
