import { TransactionWrapper } from '@cornie-js/backend-db/application';
import { CardFixtures } from '@cornie-js/backend-game-domain/cards/fixtures';
import {
  ActiveGameFixtures,
  FinishedGameFixtures,
} from '@cornie-js/backend-game-domain/games/fixtures';

import { ActiveGameUpdatedCardsDrawEvent } from '../models/ActiveGameUpdatedCardsDrawEvent';
import { ActiveGameUpdatedCardsPlayEvent } from '../models/ActiveGameUpdatedCardsPlayEvent';
import { ActiveGameUpdatedEventKind } from '../models/ActiveGameUpdatedEventKind';
import { ActiveGameUpdatedTurnPassEvent } from '../models/ActiveGameUpdatedTurnPassEvent';

export class ActiveGameUpdatedEventFixtures {
  public static get anyCardsDrawEvent(): ActiveGameUpdatedCardsDrawEvent {
    return {
      draw: [CardFixtures.any],
      game: ActiveGameFixtures.any,
      gameBeforeUpdate: ActiveGameFixtures.any,
      kind: ActiveGameUpdatedEventKind.cardsDraw,
      transactionWrapper: Symbol() as unknown as TransactionWrapper,
    };
  }

  public static get anyCardsPlayEvent(): ActiveGameUpdatedCardsPlayEvent {
    return {
      cards: [CardFixtures.any],
      game: ActiveGameFixtures.any,
      gameBeforeUpdate: ActiveGameFixtures.any,
      kind: ActiveGameUpdatedEventKind.cardsPlay,
      transactionWrapper: Symbol() as unknown as TransactionWrapper,
    };
  }

  public static get anyTurnPassEvent(): ActiveGameUpdatedTurnPassEvent {
    return {
      game: ActiveGameFixtures.any,
      gameBeforeUpdate: ActiveGameFixtures.any,
      kind: ActiveGameUpdatedEventKind.turnPass,
      transactionWrapper: Symbol() as unknown as TransactionWrapper,
    };
  }

  public static get cardPlayEventWithActiveGame(): ActiveGameUpdatedCardsPlayEvent {
    return {
      ...ActiveGameUpdatedEventFixtures.anyCardsPlayEvent,
      game: ActiveGameFixtures.any,
    };
  }

  public static get cardPlayEventWithFinishedGame(): ActiveGameUpdatedCardsPlayEvent {
    return {
      ...ActiveGameUpdatedEventFixtures.anyCardsPlayEvent,
      game: FinishedGameFixtures.any,
    };
  }

  public static get turnPassEventWithActiveGame(): ActiveGameUpdatedTurnPassEvent {
    return {
      ...ActiveGameUpdatedEventFixtures.anyTurnPassEvent,
      game: ActiveGameFixtures.any,
    };
  }

  public static get turnPassEventWithFinishedGame(): ActiveGameUpdatedTurnPassEvent {
    return {
      ...ActiveGameUpdatedEventFixtures.anyTurnPassEvent,
      game: FinishedGameFixtures.any,
    };
  }
}
