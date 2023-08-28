import { Game } from '@cornie-js/backend-game-domain/games';

import { BaseGameMessageEvent } from './BaseGameMessageEvent';
import { GameMessageEventKind } from './GameMessageEventKind';

export interface GameUpdatedMessageEvent
  extends BaseGameMessageEvent<GameMessageEventKind.gameUpdated> {
  game: Game;
}
