import { NonStartedGameFixtures } from '@cornie-js/backend-game-domain/games/fixtures';

import { GameOptionsCreateQueryContext } from '../models/GameOptionsCreateQueryContext';

export class GameOptionsCreateQueryContextFixtures {
  public static get any(): GameOptionsCreateQueryContext {
    return {
      game: NonStartedGameFixtures.any,
      uuid: '738e3afd-b015-4385-ad87-378475db4847',
    };
  }
}
