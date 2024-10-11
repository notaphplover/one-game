import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import { Inject, Injectable } from '@nestjs/common';

import { IsValidInitialCardSpec } from '../../../cards/domain/specs/IsValidInitialCardSpec';
import { Card } from '../../../cards/domain/valueObjects/Card';
import { NonStartedGame } from '../entities/NonStartedGame';
import { GameSlotUpdateQuery } from '../query/GameSlotUpdateQuery';
import { GameUpdateQuery } from '../query/GameUpdateQuery';
import { GameDrawService } from '../services/GameDrawService';
import { GameService } from '../services/GameService';
import { GameCardSpec } from '../valueObjects/GameCardSpec';
import { GameDrawMutation } from '../valueObjects/GameDrawMutation';
import { GameInitialDrawsMutation } from '../valueObjects/GameInitialDrawsMutation';
import { GameSpec } from '../valueObjects/GameSpec';
import { GameStatus } from '../valueObjects/GameStatus';

@Injectable()
export class StartGameUpdateQueryFromGameBuilder
  implements Builder<GameUpdateQuery, [NonStartedGame, GameSpec]>
{
  readonly #gameDrawService: GameDrawService;
  readonly #gameService: GameService;
  readonly #isValidInitialCardSpec: IsValidInitialCardSpec;

  constructor(
    @Inject(GameDrawService)
    gameDrawService: GameDrawService,
    @Inject(GameService)
    gameService: GameService,
    @Inject(IsValidInitialCardSpec)
    isValidInitialCardSpec: IsValidInitialCardSpec,
  ) {
    this.#gameDrawService = gameDrawService;
    this.#gameService = gameService;
    this.#isValidInitialCardSpec = isValidInitialCardSpec;
  }

  public build(game: NonStartedGame, gameSpec: GameSpec): GameUpdateQuery {
    const gameInitialDraws: GameInitialDrawsMutation =
      this.#gameDrawService.calculateInitialCardsDrawMutation(gameSpec);

    const gameSlotUpdateQueries: GameSlotUpdateQuery[] =
      this.#buildGameSlotUpdateQueries(game, gameInitialDraws);

    const [currentCard, discardPile]: [Card, GameCardSpec[]] =
      this.#getCurrentCardAndDiscardPile(gameInitialDraws);

    const gameUpdateQuery: GameUpdateQuery = {
      currentCard,
      currentColor: this.#gameService.getInitialCardColor(
        gameInitialDraws.currentCard,
      ),
      currentDirection: this.#gameService.getInitialDirection(),
      currentPlayingSlotIndex:
        this.#gameService.getInitialPlayingSlotIndex(gameSpec),
      currentTurnCardsDrawn: false,
      currentTurnCardsPlayed: false,
      deck: gameInitialDraws.deck,
      discardPile,
      drawCount: 0,
      gameFindQuery: {
        id: game.id,
      },
      gameSlotUpdateQueries,
      skipCount: 0,
      status: GameStatus.active,
      turn: this.#gameService.getInitialTurn(),
      turnExpiresAt: new Date(),
    };

    return gameUpdateQuery;
  }

  #buildGameSlotUpdateQueries(
    game: NonStartedGame,
    gameInitialDraws: GameInitialDrawsMutation,
  ): GameSlotUpdateQuery[] {
    return gameInitialDraws.cards.map(
      (cards: Card[], index: number): GameSlotUpdateQuery => ({
        cards: cards,
        gameSlotFindQuery: {
          gameId: game.id,
          position: index,
        },
      }),
    );
  }

  #getCurrentCardAndDiscardPile(
    gameInitialDraws: GameInitialDrawsMutation,
  ): [Card, GameCardSpec[]] {
    let card: Card = gameInitialDraws.currentCard;
    let deck: GameCardSpec[] = gameInitialDraws.deck;
    let discardPile: GameCardSpec[] = [];

    while (!this.#isValidInitialCardSpec.isSatisfiedBy(card)) {
      this.#gameDrawService.putCards(discardPile, [card]);

      const drawMutation: GameDrawMutation =
        this.#gameDrawService.calculateDrawMutation(deck, discardPile, 1);

      const [firstDraw]: Card[] = drawMutation.cards;

      if (firstDraw === undefined) {
        throw new AppError(AppErrorKind.unknown, 'Unexpected card draw');
      }

      card = firstDraw;
      deck = drawMutation.deck;

      if (drawMutation.isDiscardPileEmptied) {
        discardPile = [];
      }
    }

    return [card, discardPile];
  }
}
