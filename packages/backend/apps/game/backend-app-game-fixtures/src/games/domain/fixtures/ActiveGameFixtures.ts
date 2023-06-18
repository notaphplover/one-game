import { CardColor } from '@cornie-js/backend-game-domain/cards';
import {
  ActiveGame,
  GameDirection,
} from '@cornie-js/backend-game-domain/games';

import { CardFixtures } from '../../../cards/domain/fixtures/CardFixtures';
import { ActiveGameSlotFixtures } from './ActiveGameSlotFixtures';
import { GameCardSpecFixtures } from './GameCardSpecFixtures';

export class ActiveGameFixtures {
  public static get any(): ActiveGame {
    return {
      gameSlotsAmount: 1,
      id: 'e6b54159-a4ef-41fc-994a-20709526bdaa',
      spec: {
        cards: [GameCardSpecFixtures.any],
      },
      state: {
        active: true,
        currentCard: CardFixtures.any,
        currentColor: CardColor.blue,
        currentDirection: GameDirection.antiClockwise,
        currentPlayingSlotIndex: 0,
        deck: [],
        drawCount: 0,
        slots: [ActiveGameSlotFixtures.withPositionZero],
      },
    };
  }

  public static get withSlotsOne(): ActiveGame {
    const anyActiveGameFixture: ActiveGame = ActiveGameFixtures.any;

    return {
      ...anyActiveGameFixture,
      state: {
        ...anyActiveGameFixture.state,
        slots: [ActiveGameSlotFixtures.withPositionZero],
      },
    };
  }
}
