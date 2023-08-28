import { GameMessageEventKind } from './GameMessageEventKind';

export interface BaseGameMessageEvent<
  TKind extends GameMessageEventKind = GameMessageEventKind,
> {
  kind: TKind;
}
