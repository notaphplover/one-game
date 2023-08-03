import { Card } from '../../../cards/domain/valueObjects/Card';
import { CardColor } from '../../../cards/domain/valueObjects/CardColor';
import { GameCardSpec } from '../models/GameCardSpec';
import { GameDirection } from '../models/GameDirection';
import { GameStatus } from '../models/GameStatus';
import { GameFindQuery } from './GameFindQuery';
import { GameSlotUpdateQuery } from './GameSlotUpdateQuery';

export interface GameUpdateQuery {
  gameFindQuery: GameFindQuery;

  currentCard?: Card;
  currentColor?: CardColor;
  currentDirection?: GameDirection;
  currentPlayingSlotIndex?: number;
  currentTurnCardsPlayed?: boolean | null;
  deck?: GameCardSpec[];
  drawCount?: number;
  gameSlotUpdateQueries?: GameSlotUpdateQuery[];
  status?: GameStatus;
}
