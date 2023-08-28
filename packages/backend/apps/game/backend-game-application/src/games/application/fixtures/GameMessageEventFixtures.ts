import { NonStartedGameFixtures } from '@cornie-js/backend-game-domain/games/fixtures';

import { GameMessageEvent } from '../models/GameMessageEvent';
import { GameMessageEventKind } from '../models/GameMessageEventKind';

export class GameMessageEventFixtures {
  public static get any(): GameMessageEvent {
    return {
      game: NonStartedGameFixtures.any,
      kind: GameMessageEventKind.gameUpdated,
    };
  }
}
