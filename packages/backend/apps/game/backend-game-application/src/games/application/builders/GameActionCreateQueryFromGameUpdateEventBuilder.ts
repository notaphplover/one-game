import { Builder } from '@cornie-js/backend-common';
import {
  DrawGameActionCreateQuery,
  GameActionCreateQuery,
  GameActionKind,
  PassTurnGameActionCreateQuery,
  PlayCardsGameActionCreateQuery,
} from '@cornie-js/backend-game-domain/gameActions';
import {
  ActiveGame,
  Game,
  GameStatus,
} from '@cornie-js/backend-game-domain/games';
import { Injectable } from '@nestjs/common';

import { UuidContext } from '../../../foundation/common/application/models/UuidContext';
import { ActiveGameUpdatedCardsDrawEvent } from '../models/ActiveGameUpdatedCardsDrawEvent';
import { ActiveGameUpdatedCardsPlayEvent } from '../models/ActiveGameUpdatedCardsPlayEvent';
import { ActiveGameUpdatedEvent } from '../models/ActiveGameUpdatedEvent';
import { ActiveGameUpdatedEventKind } from '../models/ActiveGameUpdatedEventKind';
import { ActiveGameUpdatedTurnPassEvent } from '../models/ActiveGameUpdatedTurnPassEvent';

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
        gameActionCreateQuery = this.#buildDrawGameActionCreateQuery(
          event,
          context,
        );
        break;
      case ActiveGameUpdatedEventKind.cardsPlay:
        gameActionCreateQuery = this.#buildPlayCardsGameActionCreateQuery(
          event,
          context,
        );
        break;
      case ActiveGameUpdatedEventKind.turnPass:
        gameActionCreateQuery = this.#buildPassTurnGameActionCreateQuery(
          event,
          context,
        );
        break;
    }

    return gameActionCreateQuery;
  }

  #buildDrawGameActionCreateQuery(
    event: ActiveGameUpdatedCardsDrawEvent,
    context: UuidContext,
  ): DrawGameActionCreateQuery {
    return {
      currentPlayingSlotIndex:
        event.gameBeforeUpdate.state.currentPlayingSlotIndex,
      draw: event.draw,
      gameId: event.gameBeforeUpdate.id,
      id: context.uuid,
      kind: GameActionKind.draw,
      turn: event.gameBeforeUpdate.state.turn,
    };
  }

  #buildPassTurnGameActionCreateQuery(
    event: ActiveGameUpdatedTurnPassEvent,
    context: UuidContext,
  ): PassTurnGameActionCreateQuery {
    return {
      currentPlayingSlotIndex:
        event.gameBeforeUpdate.state.currentPlayingSlotIndex,
      gameId: event.gameBeforeUpdate.id,
      id: context.uuid,
      kind: GameActionKind.passTurn,
      nextPlayingSlotIndex: this.#isActiveGame(event.game)
        ? event.game.state.currentPlayingSlotIndex
        : null,
      turn: event.gameBeforeUpdate.state.turn,
    };
  }

  #buildPlayCardsGameActionCreateQuery(
    event: ActiveGameUpdatedCardsPlayEvent,
    context: UuidContext,
  ): PlayCardsGameActionCreateQuery {
    if (this.#isActiveGame(event.game)) {
      return {
        cards: event.cards,
        currentPlayingSlotIndex:
          event.gameBeforeUpdate.state.currentPlayingSlotIndex,
        gameId: event.gameBeforeUpdate.id,
        id: context.uuid,
        kind: GameActionKind.playCards,
        stateUpdate: {
          currentCard: event.game.state.currentCard,
          currentColor: event.game.state.currentColor,
          currentDirection: event.game.state.currentDirection,
          drawCount: event.game.state.drawCount,
        },
        turn: event.gameBeforeUpdate.state.turn,
      };
    } else {
      return {
        cards: event.cards,
        currentPlayingSlotIndex:
          event.gameBeforeUpdate.state.currentPlayingSlotIndex,
        gameId: event.gameBeforeUpdate.id,
        id: context.uuid,
        kind: GameActionKind.playCards,
        stateUpdate: {
          currentCard: null,
          currentColor: null,
          currentDirection: null,
          drawCount: null,
        },
        turn: event.gameBeforeUpdate.state.turn,
      };
    }
  }

  #isActiveGame(game: Game): game is ActiveGame {
    return game.state.status === GameStatus.active;
  }
}
