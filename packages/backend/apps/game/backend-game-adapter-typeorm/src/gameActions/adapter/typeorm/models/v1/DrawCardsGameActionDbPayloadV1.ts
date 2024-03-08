import { CardDb } from '../../../../../cards/adapter/typeorm/models/CardDb';
import { BaseGameActionDbPayloadV1 } from './BaseGameActionDbPayloadV1';
import { GameActionDbPayloadV1Kind } from './GameActionDbPayloadV1Kind';

export interface DrawCardsGameActionDbPayloadV1
  extends BaseGameActionDbPayloadV1<GameActionDbPayloadV1Kind.draw> {
  readonly cards: CardDb[];
}
