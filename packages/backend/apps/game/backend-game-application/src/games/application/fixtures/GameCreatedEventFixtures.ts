import { GameCreateQueryFixtures } from '@cornie-js/backend-game-domain/games/fixtures';

import { GameCreatedEvent } from '../models/GameCreatedEvent';

export class GameCreatedEventFixtures {
  public static get any(): GameCreatedEvent {
    return {
      gameCreateQuery: GameCreateQueryFixtures.any,
    };
  }
}
