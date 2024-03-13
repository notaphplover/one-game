import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import { Inject, Injectable } from '@nestjs/common';

import { Card } from '../../../cards/domain/valueObjects/Card';
import { ActiveGame } from '../entities/ActiveGame';
import { GameUpdateQuery } from '../query/GameUpdateQuery';
import { GameService } from '../services/GameService';
import { ActiveGameSlot } from '../valueObjects/ActiveGameSlot';
import { GameDrawMutation } from '../valueObjects/GameDrawMutation';

const SINGLE_DRAW_AMOUNT: number = 1;

@Injectable()
export class GameDrawCardsUpdateQueryFromGameBuilder
  implements Builder<GameUpdateQuery, [ActiveGame, GameDrawMutation]>
{
  readonly #gameService: GameService;

  constructor(
    @Inject(GameService)
    gameService: GameService,
  ) {
    this.#gameService = gameService;
  }

  public build(
    game: ActiveGame,
    drawMutation: GameDrawMutation,
  ): GameUpdateQuery {
    const gameUpdateQuery: GameUpdateQuery = {
      currentTurnCardsDrawn: true,
      drawCount: 0,
      gameFindQuery: {
        id: game.id,
        state: {
          currentPlayingSlotIndex: game.state.currentPlayingSlotIndex,
        },
      },
    };

    this.#setGameUpdateQueryDrawCards(game, drawMutation, gameUpdateQuery);

    return gameUpdateQuery;
  }

  #setGameUpdateQueryCurrentTurnSingleCardDraw(
    gameUpdateQuery: GameUpdateQuery,
    drawMutation: GameDrawMutation,
  ): void {
    const [drawMutationCard]: Card[] = drawMutation.cards;

    if (drawMutationCard === undefined) {
      throw new AppError(
        AppErrorKind.unknown,
        'Expecting a draw card when drawing a single card, none found',
      );
    }

    gameUpdateQuery.currentTurnSingleCardDraw = drawMutationCard;
  }

  #setGameUpdateQueryDrawCards(
    game: ActiveGame,
    drawMutation: GameDrawMutation,
    gameUpdateQuery: GameUpdateQuery,
  ): void {
    if (drawMutation.isDiscardPileEmptied) {
      gameUpdateQuery.discardPile = [];
    }

    if (drawMutation.cards.length === SINGLE_DRAW_AMOUNT) {
      this.#setGameUpdateQueryCurrentTurnSingleCardDraw(
        gameUpdateQuery,
        drawMutation,
      );
    }

    gameUpdateQuery.deck = drawMutation.deck;

    this.#setGameUpdateQuerySlots(game, gameUpdateQuery, drawMutation);
  }

  #setGameUpdateQuerySlots(
    game: ActiveGame,
    gameUpdateQuery: GameUpdateQuery,
    drawMutation: GameDrawMutation,
  ): void {
    const playerSlot: ActiveGameSlot = this.#gameService.getGameSlotOrThrow(
      game,
      game.state.currentPlayingSlotIndex,
    );

    gameUpdateQuery.gameSlotUpdateQueries = [
      {
        cards: [...playerSlot.cards, ...drawMutation.cards],
        gameSlotFindQuery: {
          gameId: game.id,
          position: game.state.currentPlayingSlotIndex,
        },
      },
    ];
  }
}
