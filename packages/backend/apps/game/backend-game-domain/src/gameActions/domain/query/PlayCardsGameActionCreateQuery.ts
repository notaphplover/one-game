import { Card } from '../../../cards/domain/valueObjects/Card';
import { CardColor } from '../../../cards/domain/valueObjects/CardColor';
import { GameDirection } from '../../../games/domain/valueObjects/GameDirection';
import { GameActionKind } from '../valueObjects/GameActionKind';
import { BaseGameActionCreateQuery } from './BaseGameActionCreateQuery';

export type PlayCardsGameActionCreateQueryStateUpdate =
  | {
      currentCard: Card;
      currentColor: CardColor;
      currentDirection: GameDirection;
      drawCount: number;
    }
  | {
      currentCard: null;
      currentColor: null;
      currentDirection: null;
      drawCount: null;
    };

export interface PlayCardsGameActionCreateQuery
  extends BaseGameActionCreateQuery<GameActionKind.playCards> {
  readonly cards: Card[];
  readonly stateUpdate: PlayCardsGameActionCreateQueryStateUpdate;
}
