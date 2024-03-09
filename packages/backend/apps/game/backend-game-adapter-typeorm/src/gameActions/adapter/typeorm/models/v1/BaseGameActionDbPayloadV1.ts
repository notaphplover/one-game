import { BaseGameActionDbPayload } from '../BaseGameActionDbPayload';
import { GameActionDbVersion } from '../GameActionDbVersion';
import { GameActionDbPayloadV1Kind } from './GameActionDbPayloadV1Kind';

export interface BaseGameActionDbPayloadV1<
  TKind extends GameActionDbPayloadV1Kind,
> extends BaseGameActionDbPayload<GameActionDbVersion.v1> {
  kind: TKind;
}
