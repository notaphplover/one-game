import { AppError, AppErrorKind, Handler } from '@cornie-js/backend-common';
import { Card } from '@cornie-js/backend-game-domain/cards';
import {
  ActiveGame,
  Game,
  GameInitialDraws,
  GameService,
  GameSlotUpdateQuery,
  GameUpdateQuery,
  NonStartedGame,
} from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';

import { NonStartedGameFilledEvent } from '../models/NonStartedGameFilledEvent';
import {
  GamePersistenceOutputPort,
  gamePersistenceOutputPortSymbol,
} from '../ports/output/GamePersistenceOutputPort';

@Injectable()
export class NonStartedGameFilledEventHandler
  implements Handler<[NonStartedGameFilledEvent], void>
{
  readonly #gamePersistenceOutputPort: GamePersistenceOutputPort;
  readonly #gameService: GameService;

  constructor(
    @Inject(gamePersistenceOutputPortSymbol)
    gamePersistenceOutputPort: GamePersistenceOutputPort,
    @Inject(GameService)
    gameService: GameService,
  ) {
    this.#gamePersistenceOutputPort = gamePersistenceOutputPort;
    this.#gameService = gameService;
  }

  public async handle(
    nonStartedGameFilledEvent: NonStartedGameFilledEvent,
  ): Promise<void> {
    const game: NonStartedGame = await this.#getNonStartedGameOrFail(
      nonStartedGameFilledEvent.gameId,
    );

    const gameUpdateQuery: GameUpdateQuery = this.#buildGameUpdateQuery(game);

    await this.#gamePersistenceOutputPort.update(gameUpdateQuery);
  }

  #buildGameUpdateQuery(game: NonStartedGame): GameUpdateQuery {
    const gameInitialDraws: GameInitialDraws =
      this.#gameService.getInitialCardsDraw(game);

    const gameSlotUpdateQueries: GameSlotUpdateQuery[] =
      gameInitialDraws.playersCards.map(
        (cards: Card[], index: number): GameSlotUpdateQuery => ({
          cards: cards,
          gameSlotFindQuery: {
            gameId: game.id,
            position: index,
          },
        }),
      );

    const gameUpdateQuery: GameUpdateQuery = {
      active: true,
      currentCard: gameInitialDraws.currentCard,
      currentColor: this.#gameService.getInitialCardColor(
        gameInitialDraws.currentCard,
      ),
      currentDirection: this.#gameService.getInitialDirection(),
      currentPlayingSlotIndex: this.#gameService.getInitialPlayingSlotIndex(),
      deck: gameInitialDraws.remainingDeck,
      drawCount: this.#gameService.getInitialDrawCount(),
      gameFindQuery: {
        id: game.id,
      },
      gameSlotUpdateQueries,
    };

    return gameUpdateQuery;
  }

  async #getNonStartedGameOrFail(gameId: string): Promise<NonStartedGame> {
    const game: Game | undefined =
      await this.#gamePersistenceOutputPort.findOne({
        id: gameId,
      });

    if (game === undefined) {
      throw new AppError(
        AppErrorKind.unknown,
        `expecting game "${gameId}", none found`,
      );
    }

    if (this.#isGameActive(game)) {
      throw new AppError(
        AppErrorKind.unknown,
        'Unexpected attempt to fill an already active game',
      );
    }

    return game;
  }

  #isGameActive(game: Game): game is ActiveGame {
    return game.state.active;
  }
}
