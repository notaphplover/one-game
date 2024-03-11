import { GameActionDbVersion } from './GameActionDbVersion';

export interface BaseGameActionDbPayload<TVersion extends GameActionDbVersion> {
  version: TVersion;
}
