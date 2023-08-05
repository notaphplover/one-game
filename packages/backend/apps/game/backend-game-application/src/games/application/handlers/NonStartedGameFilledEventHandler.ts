import { AppError, AppErrorKind, Handler } from '@cornie-js/backend-common';
import {
  Game,
  GameService,
  GameStatus,
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

    const gameUpdateQuery: GameUpdateQuery =
      this.#gameService.buildStartGameUpdateQuery(game);

    await this.#gamePersistenceOutputPort.update(gameUpdateQuery);
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

    if (!this.#isNonStartedGame(game)) {
      throw new AppError(
        AppErrorKind.unknown,
        'Unexpected attempt to fill an already active game',
      );
    }

    return game;
  }

  #isNonStartedGame(game: Game): game is NonStartedGame {
    return game.state.status === GameStatus.nonStarted;
  }
}
