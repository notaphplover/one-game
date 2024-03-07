import { Builder } from '@cornie-js/backend-common';
import { Inject, Injectable } from '@nestjs/common';

import { Card } from '../../../cards/domain/valueObjects/Card';
import { NonStartedGame } from '../entities/NonStartedGame';
import { GameSlotUpdateQuery } from '../query/GameSlotUpdateQuery';
import { GameUpdateQuery } from '../query/GameUpdateQuery';
import { GameDrawService } from '../services/GameDrawService';
import { GameService } from '../services/GameService';
import { GameInitialDrawsMutation } from '../valueObjects/GameInitialDrawsMutation';
import { GameSpec } from '../valueObjects/GameSpec';
import { GameStatus } from '../valueObjects/GameStatus';

@Injectable()
export class StartGameUpdateQueryFromGameBuilder
  implements Builder<GameUpdateQuery, [NonStartedGame, GameSpec]>
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

  public build(game: NonStartedGame, gameSpec: GameSpec): GameUpdateQuery {
    const gameInitialDraws: GameInitialDrawsMutation =
      this.#gameDrawService.calculateInitialCardsDrawMutation(gameSpec);

    const gameSlotUpdateQueries: GameSlotUpdateQuery[] =
      gameInitialDraws.cards.map(
        (cards: Card[], index: number): GameSlotUpdateQuery => ({
          cards: cards,
          gameSlotFindQuery: {
            gameId: game.id,
            position: index,
          },
        }),
      );

    const gameUpdateQuery: GameUpdateQuery = {
      currentCard: gameInitialDraws.currentCard,
      currentColor: this.#gameService.getInitialCardColor(
        gameInitialDraws.currentCard,
      ),
      currentDirection: this.#gameService.getInitialDirection(),
      currentPlayingSlotIndex:
        this.#gameService.getInitialPlayingSlotIndex(gameSpec),
      currentTurnCardsDrawn: false,
      currentTurnCardsPlayed: false,
      deck: gameInitialDraws.deck,
      drawCount: 0,
      gameFindQuery: {
        id: game.id,
      },
      gameSlotUpdateQueries,
      skipCount: 0,
      status: GameStatus.active,
      turn: this.#gameService.getInitialTurn(),
    };

    return gameUpdateQuery;
  }
}
