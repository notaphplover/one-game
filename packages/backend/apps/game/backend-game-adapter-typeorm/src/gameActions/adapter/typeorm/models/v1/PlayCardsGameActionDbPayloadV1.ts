import { CardColorDb } from '../../../../../cards/adapter/typeorm/models/CardColorDb';
import { CardDb } from '../../../../../cards/adapter/typeorm/models/CardDb';
import { GameDirectionDb } from '../../../../../games/adapter/typeorm/models/GameDirectionDb';
import { BaseGameActionDbPayloadV1 } from './BaseGameActionDbPayloadV1';
import { GameActionDbPayloadV1Kind } from './GameActionDbPayloadV1Kind';

export type PlayCardsGameActionStateUpdateDbPayloadV1 =
  | {
      currentCard: CardDb;
      currentColor: CardColorDb;
      currentDirection: GameDirectionDb;
      drawCount: number;
    }
  | {
      currentCard: null;
      currentColor: null;
      currentDirection: null;
      drawCount: null;
    };

export interface PlayCardsGameActionDbPayloadV1
  extends BaseGameActionDbPayloadV1<GameActionDbPayloadV1Kind.playCards> {
  readonly cards: CardDb[];
  readonly stateUpdate: PlayCardsGameActionStateUpdateDbPayloadV1;
}
