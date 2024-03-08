import { BaseGameActionDbPayloadV1 } from './BaseGameActionDbPayloadV1';
import { GameActionDbPayloadV1Kind } from './GameActionDbPayloadV1Kind';

export type PassTurnGameActionDbPayloadV1 =
  BaseGameActionDbPayloadV1<GameActionDbPayloadV1Kind.passTurn>;
