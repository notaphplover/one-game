import { Card } from '../../../cards/domain/valueObjects/Card';
import { CardColor } from '../../../cards/domain/valueObjects/CardColor';
import { GameCardSpec } from '../valueObjects/GameCardSpec';
import { GameDirection } from '../valueObjects/GameDirection';
import { GameStatus } from '../valueObjects/GameStatus';
import { GameFindQuery } from './GameFindQuery';
import { GameSlotUpdateQuery } from './GameSlotUpdateQuery';

export interface GameUpdateQuery {
  gameFindQuery: GameFindQuery;

  currentCard?: Card;
  currentColor?: CardColor;
  currentDirection?: GameDirection;
  currentPlayingSlotIndex?: number;
  currentTurnCardsDrawn?: boolean | null;
  currentTurnSingleCardDraw?: Card | null;
  currentTurnCardsPlayed?: boolean | null;
  deck?: GameCardSpec[];
  discardPile?: GameCardSpec[];
  drawCount?: number;
  gameSlotUpdateQueries?: GameSlotUpdateQuery[];
  lastGameActionId?: string | null;
  skipCount?: number;
  status?: GameStatus;
  turn?: number;
  turnExpiresAt?: Date;
}
