import { AppError, AppErrorKind, Handler } from '@cornie-js/backend-common';
import { Inject, Injectable } from '@nestjs/common';

import { Card } from '../../../cards/domain/models/Card';
import { NonStartedGameFilledEvent } from '../../domain/events/NonStartedGameFilledEvent';
import { Game } from '../../domain/models/Game';
import { GameInitialDraws } from '../../domain/models/GameInitialDraws';
import { GameSlotUpdateQuery } from '../../domain/query/GameSlotUpdateQuery';
import { GameUpdateQuery } from '../../domain/query/GameUpdateQuery';
import { GameService } from '../../domain/services/GameService';
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
    const game: Game = await this.#getGameOrFail(
      nonStartedGameFilledEvent.gameId,
    );

    const gameUpdateQuery: GameUpdateQuery = this.#buildGameUpdateQuery(game);

    await this.#gamePersistenceOutputPort.update(gameUpdateQuery);
  }

  #buildGameUpdateQuery(game: Game): GameUpdateQuery {
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
      gameFindQuery: {
        id: game.id,
      },
      gameSlotUpdateQueries,
    };

    return gameUpdateQuery;
  }

  async #getGameOrFail(gameId: string): Promise<Game> {
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

    return game;
  }
}
