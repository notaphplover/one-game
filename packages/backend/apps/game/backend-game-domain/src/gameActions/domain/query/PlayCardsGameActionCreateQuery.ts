import { Card } from '../../../cards/domain/valueObjects/Card';
import { GameActionKind } from '../valueObjects/GameActionKind';
import { BaseGameActionCreateQuery } from './BaseGameActionCreateQuery';

export interface PlayCardsGameActionCreateQuery
  extends BaseGameActionCreateQuery<GameActionKind.playCards> {
  readonly cards: Card[];
  readonly currentCard: Card | null;
}
