import {
  ActiveGameFixtures,
  GameUpdateQueryFixtures,
} from '@cornie-js/backend-game-domain/games/fixtures';

import { GameUpdatedEvent } from '../models/GameUpdatedEvent';

export class GameUpdatedEventFixtures {
  public static get any(): GameUpdatedEvent {
    return {
      gameBeforeUpdate: ActiveGameFixtures.any,
      gameUpdateQuery: GameUpdateQueryFixtures.any,
    };
  }
}
