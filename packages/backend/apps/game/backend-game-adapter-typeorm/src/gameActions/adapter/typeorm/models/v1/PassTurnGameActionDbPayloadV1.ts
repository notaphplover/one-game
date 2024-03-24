import { BaseGameActionDbPayloadV1 } from './BaseGameActionDbPayloadV1';
import { GameActionDbPayloadV1Kind } from './GameActionDbPayloadV1Kind';

export interface PassTurnGameActionDbPayloadV1
  extends BaseGameActionDbPayloadV1<GameActionDbPayloadV1Kind.passTurn> {
  nextPlayingSlotIndex: number | null;
}
