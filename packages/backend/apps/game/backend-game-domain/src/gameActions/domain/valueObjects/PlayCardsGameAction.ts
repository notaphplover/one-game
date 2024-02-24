import { Card } from '../../../cards/domain/valueObjects/Card';
import { BaseGameAction } from './BaseGameAction';
import { GameActionKind } from './GameActionKind';

export interface PlayCardsGameAction
  extends BaseGameAction<GameActionKind.playCards> {
  readonly cards: Card[];
}
