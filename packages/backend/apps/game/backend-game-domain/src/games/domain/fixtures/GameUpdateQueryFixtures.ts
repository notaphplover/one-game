import { CardFixtures } from '../../../cards/domain/fixtures/CardFixtures';
import { CardColor } from '../../../cards/domain/models/CardColor';
import { GameDirection } from '../models/GameDirection';
import { GameStatus } from '../models/GameStatus';
import { GameUpdateQuery } from '../query/GameUpdateQuery';
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

  public static get withCurrentTurnCardsPlayed(): GameUpdateQuery {
    const fixture: GameUpdateQuery = {
      ...GameUpdateQueryFixtures.any,
      currentTurnCardsPlayed: true,
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

  public static get withStatusActive(): GameUpdateQuery {
    const fixture: GameUpdateQuery = {
      ...GameUpdateQueryFixtures.any,
      status: GameStatus.active,
    };

    return fixture;
  }
}
