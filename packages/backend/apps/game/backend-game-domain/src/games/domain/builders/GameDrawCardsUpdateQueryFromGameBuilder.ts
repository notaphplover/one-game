import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import { Inject, Injectable } from '@nestjs/common';

import { Card } from '../../../cards/domain/valueObjects/Card';
import { ActiveGame } from '../entities/ActiveGame';
import { GameUpdateQuery } from '../query/GameUpdateQuery';
import { GameDrawService } from '../services/GameDrawService';
import { GameService } from '../services/GameService';
import { ActiveGameSlot } from '../valueObjects/ActiveGameSlot';
import { GameDrawMutation } from '../valueObjects/GameDrawMutation';

const MIN_CARDS_TO_DRAW: number = 1;

@Injectable()
export class GameDrawCardsUpdateQueryFromGameBuilder
  implements Builder<GameUpdateQuery, [ActiveGame]>
{
  readonly #gameDrawService: GameDrawService;
  readonly #gameService: GameService;

  constructor(
    @Inject(GameDrawService)
    gameDrawService: GameDrawService,
    @Inject(GameService)
    gameService: GameService,
  ) {
    this.#gameDrawService = gameDrawService;
    this.#gameService = gameService;
  }

  public build(game: ActiveGame): GameUpdateQuery {
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

    this.#setGameUpdateQueryDrawCards(game, gameUpdateQuery);

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
    gameUpdateQuery: GameUpdateQuery,
  ): void {
    const cardsToDraw: number = Math.max(
      MIN_CARDS_TO_DRAW,
      game.state.drawCount,
    );

    const drawMutation: GameDrawMutation =
      this.#gameDrawService.calculateDrawMutation(
        game.state.deck,
        game.state.discardPile,
        cardsToDraw,
      );

    if (drawMutation.isDiscardPileEmptied) {
      gameUpdateQuery.discardPile = [];
    }

    if (cardsToDraw === MIN_CARDS_TO_DRAW) {
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
