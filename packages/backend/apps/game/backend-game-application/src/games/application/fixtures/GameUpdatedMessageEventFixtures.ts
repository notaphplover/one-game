import { GameActionFixtures } from '@cornie-js/backend-game-domain/gameActions/fixtures';
import {
  ActiveGameFixtures,
  FinishedGameFixtures,
  NonStartedGameFixtures,
} from '@cornie-js/backend-game-domain/games/fixtures';

import { GameMessageEventKind } from '../models/GameMessageEventKind';
import { GameUpdatedMessageEvent } from '../models/GameUpdatedMessageEvent';

export class GameUpdatedMessageEventFixtures {
  public static get any(): GameUpdatedMessageEvent {
    return {
      game: NonStartedGameFixtures.any,
      gameAction: GameActionFixtures.any,
      kind: GameMessageEventKind.gameUpdated,
    };
  }

  public static get withGameActiveAndDrawGameAction(): GameUpdatedMessageEvent {
    return {
      ...GameUpdatedMessageEventFixtures.any,
      game: ActiveGameFixtures.any,
      gameAction: GameActionFixtures.withKindCardsDrawnAndDrawOne,
    };
  }

  public static get withPassTurnGameAction(): GameUpdatedMessageEvent {
    return {
      ...GameUpdatedMessageEventFixtures.any,
      gameAction: GameActionFixtures.withKindPassTurn,
    };
  }

  public static get withGameFinishedAndPassTurnGameAction(): GameUpdatedMessageEvent {
    return {
      ...GameUpdatedMessageEventFixtures.any,
      game: FinishedGameFixtures.any,
      gameAction: GameActionFixtures.withKindPassTurn,
    };
  }

  public static get withPlayCardsGameActionWithCardsOneAndCurrentCard(): GameUpdatedMessageEvent {
    return {
      ...GameUpdatedMessageEventFixtures.any,
      gameAction: GameActionFixtures.withKindPlayCardsAndCardsOneAndCurrentCard,
    };
  }

  public static get withPlayCardsGameActionWithCardsOneAndCurrentCardNull(): GameUpdatedMessageEvent {
    return {
      ...GameUpdatedMessageEventFixtures.any,
      gameAction:
        GameActionFixtures.withKindPlayCardsAndCardsOneAndCurrentCardNull,
    };
  }
}
