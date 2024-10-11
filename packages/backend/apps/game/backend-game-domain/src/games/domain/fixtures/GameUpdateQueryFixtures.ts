import { CardFixtures } from '../../../cards/domain/fixtures/CardFixtures';
import { CardColor } from '../../../cards/domain/valueObjects/CardColor';
import { GameUpdateQuery } from '../query/GameUpdateQuery';
import { GameDirection } from '../valueObjects/GameDirection';
import { GameStatus } from '../valueObjects/GameStatus';
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

  public static get withCurrentTurnCardsDrawn(): GameUpdateQuery {
    const fixture: GameUpdateQuery = {
      ...GameUpdateQueryFixtures.any,
      currentTurnCardsDrawn: true,
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

  public static get currentTurnSingleCardDraw(): GameUpdateQuery {
    const fixture: GameUpdateQuery = {
      ...GameUpdateQueryFixtures.any,
      currentTurnSingleCardDraw: CardFixtures.any,
    };

    return fixture;
  }

  public static get currentTurnSingleCardDrawNull(): GameUpdateQuery {
    const fixture: GameUpdateQuery = {
      ...GameUpdateQueryFixtures.any,
      currentTurnSingleCardDraw: null,
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

  public static get withDiscardPile(): GameUpdateQuery {
    const fixture: GameUpdateQuery = {
      ...GameUpdateQueryFixtures.any,
      discardPile: [GameCardSpecFixtures.any],
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

  public static get withLastGameActionIdNull(): GameUpdateQuery {
    const fixture: GameUpdateQuery = {
      ...GameUpdateQueryFixtures.any,
      lastGameActionId: null,
    };

    return fixture;
  }

  public static get withLastGameActionIdString(): GameUpdateQuery {
    const fixture: GameUpdateQuery = {
      ...GameUpdateQueryFixtures.any,
      lastGameActionId: '16b54159-a4ef-41fc-994a-20709526bda0',
    };

    return fixture;
  }

  public static get withSkipCount(): GameUpdateQuery {
    const fixture: GameUpdateQuery = {
      ...GameUpdateQueryFixtures.any,
      skipCount: 0,
    };

    return fixture;
  }

  public static get withStatusActive(): GameUpdateQuery {
    const fixture: GameUpdateQuery = {
      ...GameUpdateQueryFixtures.any,
      status: GameStatus.active,
    };

    return fixture;
  }

  public static get withTurn(): GameUpdateQuery {
    const fixture: GameUpdateQuery = {
      ...GameUpdateQueryFixtures.any,
      turn: 1,
    };

    return fixture;
  }

  public static get withTurnExpiresAt(): GameUpdateQuery {
    const fixture: GameUpdateQuery = {
      ...GameUpdateQueryFixtures.any,
      turnExpiresAt: new Date('2020-01-01'),
    };

    return fixture;
  }
}
