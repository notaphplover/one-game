import { CardColor } from '@cornie-js/backend-app-game-models/cards/domain';
import {
  GameDirection,
  GameUpdateQuery,
} from '@cornie-js/backend-app-game-models/games/domain';

import { CardFixtures } from '../../../cards/domain/fixtures/CardFixtures';
import { GameCardSpecFixtures } from './GameCardSpecFixtures';
import { GameFindQueryFixtures } from './GameFindQueryFixtures';
import { GameSlotUpdateQueryFixtures } from './GameSlotUpdateQueryFixtures';

export class GameUpdateQueryFixtures {
  public static get any(): GameUpdateQuery {
    const fixture: GameUpdateQuery = {
      gameFindQuery: GameFindQueryFixtures.any,
    };

    return fixture;
  }

  public static get withActive(): GameUpdateQuery {
    const fixture: GameUpdateQuery = {
      ...GameUpdateQueryFixtures.any,
      active: true,
    };

    return fixture;
  }

  public static get withCurrentCard(): GameUpdateQuery {
    const fixture: GameUpdateQuery = {
      ...GameUpdateQueryFixtures.any,
      currentCard: CardFixtures.any,
    };

    return fixture;
  }

  public static get withCurrentColor(): GameUpdateQuery {
    const fixture: GameUpdateQuery = {
      ...GameUpdateQueryFixtures.any,
      currentColor: CardColor.blue,
    };

    return fixture;
  }

  public static get withCurrentDirection(): GameUpdateQuery {
    const fixture: GameUpdateQuery = {
      ...GameUpdateQueryFixtures.any,
      currentDirection: GameDirection.antiClockwise,
    };

    return fixture;
  }

  public static get withCurrentPlayingSlotIndex(): GameUpdateQuery {
    const fixture: GameUpdateQuery = {
      ...GameUpdateQueryFixtures.any,
      currentPlayingSlotIndex: 0,
    };

    return fixture;
  }

  public static get withDeck(): GameUpdateQuery {
    const fixture: GameUpdateQuery = {
      ...GameUpdateQueryFixtures.any,
      deck: [GameCardSpecFixtures.any],
    };

    return fixture;
  }

  public static get withDrawCount(): GameUpdateQuery {
    const fixture: GameUpdateQuery = {
      ...GameUpdateQueryFixtures.any,
      drawCount: 0,
    };

    return fixture;
  }

  public static get withNoGameSlotUpdateQueries(): GameUpdateQuery {
    const fixture: GameUpdateQuery = {
      ...GameUpdateQueryFixtures.any,
    };

    delete fixture.gameSlotUpdateQueries;

    return fixture;
  }

  public static get withGameSlotUpdateQueriesOne(): GameUpdateQuery {
    return {
      ...GameUpdateQueryFixtures.any,
      gameSlotUpdateQueries: [GameSlotUpdateQueryFixtures.any],
    };
  }
}
