import { NonStartedGameFixtures } from '@cornie-js/backend-app-game-fixtures/games/domain';

import { GameSlotCreateQueryContext } from '../models/GameSlotCreateQueryContext';

export class GameSlotCreateQueryContextFixtures {
  public static get any(): GameSlotCreateQueryContext {
    return {
      game: NonStartedGameFixtures.any,
      uuid: '738e3afd-b015-4385-ad87-378475db4847',
    };
  }
}
