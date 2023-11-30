import { AppError, AppErrorKind, Handler } from '@cornie-js/backend-common';
import {
  Game,
  GameService,
  GameSpec,
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
import {
  GameSpecPersistenceOutputPort,
  gameSpecPersistenceOutputPortSymbol,
} from '../ports/output/GameSpecPersistenceOutputPort';

@Injectable()
export class NonStartedGameFilledEventHandler
  implements Handler<[NonStartedGameFilledEvent], void>
{
  readonly #gamePersistenceOutputPort: GamePersistenceOutputPort;
  readonly #gameService: GameService;
  readonly #gameSpecPersistenceOutputPort: GameSpecPersistenceOutputPort;

  constructor(
    @Inject(gamePersistenceOutputPortSymbol)
    gamePersistenceOutputPort: GamePersistenceOutputPort,
    @Inject(GameService)
    gameService: GameService,
    @Inject(gameSpecPersistenceOutputPortSymbol)
    gameSpecPersistenceOutputPort: GameSpecPersistenceOutputPort,
  ) {
    this.#gamePersistenceOutputPort = gamePersistenceOutputPort;
    this.#gameService = gameService;
    this.#gameSpecPersistenceOutputPort = gameSpecPersistenceOutputPort;
  }

  public async handle(
    nonStartedGameFilledEvent: NonStartedGameFilledEvent,
  ): Promise<void> {
    const [game, gameSpec]: [NonStartedGame, GameSpec] = await Promise.all([
      this.#getNonStartedGameOrFail(nonStartedGameFilledEvent.gameId),
      this.#getGameSpecOrFail(nonStartedGameFilledEvent.gameId),
    ]);

    const gameUpdateQuery: GameUpdateQuery =
      this.#gameService.buildStartGameUpdateQuery(game, gameSpec);

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

  async #getGameSpecOrFail(gameId: string): Promise<GameSpec> {
    const gameSpec: GameSpec | undefined =
      await this.#gameSpecPersistenceOutputPort.findOne({ gameIds: [gameId] });

    if (gameSpec === undefined) {
      throw new AppError(
        AppErrorKind.unknown,
        `No game spec was found for game "${gameId}"`,
      );
    }

    return gameSpec;
  }

  #isNonStartedGame(game: Game): game is NonStartedGame {
    return game.state.status === GameStatus.nonStarted;
  }
}
