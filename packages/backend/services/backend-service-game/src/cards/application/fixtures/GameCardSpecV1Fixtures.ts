import { GameCardSpecV1 } from '@one-game-js/api-models/lib/models/types';

import { CardV1Fixtures } from './CardV1Fixtures';

export class GameCardSpecV1Fixtures {
  public static get any(): GameCardSpecV1 {
    return {
      amount: 3,
      card: CardV1Fixtures.wildCard,
    };
  }
}
