import { Card } from '../../../cards/domain/valueObjects/Card';
import { CardColor } from '../../../cards/domain/valueObjects/CardColor';
import { GameDirection } from '../../../games/domain/valueObjects/GameDirection';
import { BaseGameAction } from './BaseGameAction';
import { GameActionKind } from './GameActionKind';

export type PlayCardsGameActionStateUpdate =
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

export interface PlayCardsGameAction
  extends BaseGameAction<GameActionKind.playCards> {
  readonly cards: Card[];
  readonly stateUpdate: PlayCardsGameActionStateUpdate;
}
