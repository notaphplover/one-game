import {
  UuidProviderOutputPort,
  uuidProviderOutputPortSymbol,
} from '@cornie-js/backend-app-uuid';
import { AppError, AppErrorKind, Handler } from '@cornie-js/backend-common';
import { TransactionWrapper } from '@cornie-js/backend-db/application';
import {
  ActiveGame,
  ActiveGameSlot,
  Game,
  GameService,
  GameSpec,
  GameStatus,
  GameUpdateQuery,
  NonStartedGame,
} from '@cornie-js/backend-game-domain/games';
import { GameInitialSnapshotCreateQuery } from '@cornie-js/backend-game-domain/gameSnapshots';
import { Inject, Injectable } from '@nestjs/common';

import { CreateGameInitialSnapshotUseCaseHandler } from '../../../gameSnapshots/application/handlers/CreateGameInitialSnapshotUseCaseHandler';
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
  implements Handler<[NonStartedGameFilledEvent, TransactionWrapper], void>
{
  readonly #createGameInitialSnapshotUseCaseHandler: Handler<
    [GameInitialSnapshotCreateQuery, TransactionWrapper | undefined],
    void
  >;
  readonly #gamePersistenceOutputPort: GamePersistenceOutputPort;
  readonly #gameService: GameService;
  readonly #gameSpecPersistenceOutputPort: GameSpecPersistenceOutputPort;
  readonly #uuidProviderOutputPort: UuidProviderOutputPort;

  constructor(
    @Inject(CreateGameInitialSnapshotUseCaseHandler)
    createGameInitialSnapshotUseCaseHandler: Handler<
      [GameInitialSnapshotCreateQuery, TransactionWrapper | undefined],
      void
    >,
    @Inject(gamePersistenceOutputPortSymbol)
    gamePersistenceOutputPort: GamePersistenceOutputPort,
    @Inject(GameService)
    gameService: GameService,
    @Inject(gameSpecPersistenceOutputPortSymbol)
    gameSpecPersistenceOutputPort: GameSpecPersistenceOutputPort,
    @Inject(uuidProviderOutputPortSymbol)
    uuidProviderOutputPort: UuidProviderOutputPort,
  ) {
    this.#createGameInitialSnapshotUseCaseHandler =
      createGameInitialSnapshotUseCaseHandler;
    this.#gamePersistenceOutputPort = gamePersistenceOutputPort;
    this.#gameService = gameService;
    this.#gameSpecPersistenceOutputPort = gameSpecPersistenceOutputPort;
    this.#uuidProviderOutputPort = uuidProviderOutputPort;
  }

  public async handle(
    nonStartedGameFilledEvent: NonStartedGameFilledEvent,
    transactionWrapper: TransactionWrapper,
  ): Promise<void> {
    const [game, gameSpec]: [NonStartedGame, GameSpec] = await Promise.all([
      this.#getNonStartedGameOrFail(nonStartedGameFilledEvent.gameId),
      this.#getGameSpecOrFail(nonStartedGameFilledEvent.gameId),
    ]);

    const gameUpdateQuery: GameUpdateQuery =
      this.#gameService.buildStartGameUpdateQuery(game, gameSpec);

    await this.#gamePersistenceOutputPort.update(
      gameUpdateQuery,
      transactionWrapper,
    );

    await this.#createGameInitialSnapshot(game, transactionWrapper);
  }

  #isActiveGame(game: Game | undefined): game is ActiveGame {
    return game?.state.status === GameStatus.active;
  }

  async #createGameInitialSnapshot(
    game: Game,
    transactionWrapper: TransactionWrapper,
  ): Promise<void> {
    const updatedGame: Game | undefined =
      await this.#gamePersistenceOutputPort.findOne(
        { id: game.id },
        transactionWrapper,
      );

    if (!this.#isActiveGame(updatedGame)) {
      throw new AppError(
        AppErrorKind.unknown,
        'Unexpected non active game when attempting to create game snapshot',
      );
    }

    const gameInitialSnapshotId: string =
      this.#uuidProviderOutputPort.generateV4();

    const gameInitialSnapshotCreateQuery: GameInitialSnapshotCreateQuery = {
      currentCard: updatedGame.state.currentCard,
      currentColor: updatedGame.state.currentColor,
      currentDirection: updatedGame.state.currentDirection,
      currentPlayingSlotIndex: updatedGame.state.currentPlayingSlotIndex,
      deck: updatedGame.state.deck,
      drawCount: updatedGame.state.drawCount,
      gameId: updatedGame.id,
      gameSlotCreateQueries: updatedGame.state.slots.map(
        (gameSlot: ActiveGameSlot) => ({
          cards: gameSlot.cards,
          gameInitialSnapshotId,
          id: this.#uuidProviderOutputPort.generateV4(),
          position: gameSlot.position,
          userId: gameSlot.userId,
        }),
      ),
      id: gameInitialSnapshotId,
    };

    await this.#createGameInitialSnapshotUseCaseHandler.handle(
      gameInitialSnapshotCreateQuery,
      transactionWrapper,
    );
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
