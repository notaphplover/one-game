import { Builder } from '@cornie-js/backend-common';
import {
  GameActionCreateQuery,
  GameActionKind,
} from '@cornie-js/backend-game-domain/gameActions';
import { Injectable } from '@nestjs/common';

import { UuidContext } from '../../../foundation/common/application/models/UuidContext';
import { ActiveGameUpdatedEvent } from '../models/ActiveGameUpdatedEvent';
import { ActiveGameUpdatedEventKind } from '../models/ActiveGameUpdatedEventKind';

@Injectable()
export class GameActionCreateQueryFromGameUpdateEventBuilder
  implements
    Builder<GameActionCreateQuery, [ActiveGameUpdatedEvent, UuidContext]>
{
  public build(
    event: ActiveGameUpdatedEvent,
    context: UuidContext,
  ): GameActionCreateQuery {
    let gameActionCreateQuery: GameActionCreateQuery;
    switch (event.kind) {
      case ActiveGameUpdatedEventKind.cardsDraw:
        gameActionCreateQuery = {
          currentPlayingSlotIndex:
            event.gameBeforeUpdate.state.currentPlayingSlotIndex,
          draw: event.draw,
          gameId: event.gameBeforeUpdate.id,
          id: context.uuid,
          kind: GameActionKind.draw,
          turn: event.gameBeforeUpdate.state.turn,
        };
        break;
      case ActiveGameUpdatedEventKind.cardsPlay:
        gameActionCreateQuery = {
          cards: event.cards,
          currentPlayingSlotIndex:
            event.gameBeforeUpdate.state.currentPlayingSlotIndex,
          gameId: event.gameBeforeUpdate.id,
          id: context.uuid,
          kind: GameActionKind.playCards,
          turn: event.gameBeforeUpdate.state.turn,
        };
        break;
      case ActiveGameUpdatedEventKind.turnPass:
        gameActionCreateQuery = {
          currentPlayingSlotIndex:
            event.gameBeforeUpdate.state.currentPlayingSlotIndex,
          gameId: event.gameBeforeUpdate.id,
          id: context.uuid,
          kind: GameActionKind.passTurn,
          turn: event.gameBeforeUpdate.state.turn,
        };
        break;
    }

    return gameActionCreateQuery;
  }
}
