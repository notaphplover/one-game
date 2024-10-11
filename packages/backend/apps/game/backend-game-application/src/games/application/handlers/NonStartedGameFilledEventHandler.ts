import {
  UuidProviderOutputPort,
  uuidProviderOutputPortSymbol,
} from '@cornie-js/backend-app-uuid';
import { MessageDeliveryScheduleKind } from '@cornie-js/backend-application-messaging';
import {
  AppError,
  AppErrorKind,
  Builder,
  Handler,
} from '@cornie-js/backend-common';
import { TransactionWrapper } from '@cornie-js/backend-db/application';
import { Card, CardColor } from '@cornie-js/backend-game-domain/cards';
import {
  ActiveGame,
  ActiveGameSlot,
  Game,
  GameCardsEffectUpdateQueryFromGameBuilder,
  GamePassTurnUpdateQueryFromGameBuilder,
  GameService,
  GameSpec,
  GameStatus,
  GameUpdateQuery,
  NonStartedGame,
  StartGameUpdateQueryFromGameBuilder,
} from '@cornie-js/backend-game-domain/games';
import { GameInitialSnapshotCreateQuery } from '@cornie-js/backend-game-domain/gameSnapshots';
import {
  Inject,
  Injectable,
  Logger,
  LoggerService,
  Optional,
} from '@nestjs/common';

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
import {
  GameTurnEndSignalMessageSendOutputPort,
  gameTurnEndSignalMessageSendOutputPortSymbol,
} from '../ports/output/GameTurnEndSignalMessageSendOutputPort';

const GAME_TURN_DURATION_MS: number = 30000;

@Injectable()
export class NonStartedGameFilledEventHandler
  implements Handler<[NonStartedGameFilledEvent, TransactionWrapper], void>
{
  readonly #createGameInitialSnapshotUseCaseHandler: Handler<
    [GameInitialSnapshotCreateQuery, TransactionWrapper | undefined],
    void
  >;
  readonly #gameCardsEffectUpdateQueryFromGameBuilder: Builder<
    GameUpdateQuery,
    [ActiveGame, Card, number, CardColor | undefined]
  >;
  readonly #gamePassTurnUpdateQueryFromGameBuilder: Builder<
    GameUpdateQuery,
    [ActiveGame, GameSpec]
  >;
  readonly #gameService: GameService;
  readonly #gamePersistenceOutputPort: GamePersistenceOutputPort;
  readonly #gameSpecPersistenceOutputPort: GameSpecPersistenceOutputPort;
  readonly #gameTurnEndSignalMessageSendOutputPort:
    | GameTurnEndSignalMessageSendOutputPort
    | undefined;
  readonly #logger: LoggerService;
  readonly #startGameUpdateQueryFromGameBuilder: Builder<
    GameUpdateQuery,
    [NonStartedGame, GameSpec]
  >;
  readonly #uuidProviderOutputPort: UuidProviderOutputPort;

  constructor(
    @Inject(CreateGameInitialSnapshotUseCaseHandler)
    createGameInitialSnapshotUseCaseHandler: Handler<
      [GameInitialSnapshotCreateQuery, TransactionWrapper | undefined],
      void
    >,
    @Inject(GameCardsEffectUpdateQueryFromGameBuilder)
    gameCardsEffectUpdateQueryFromGameBuilder: Builder<
      GameUpdateQuery,
      [ActiveGame, Card, number, CardColor | undefined]
    >,
    @Inject(GamePassTurnUpdateQueryFromGameBuilder)
    gamePassTurnUpdateQueryFromGameBuilder: Builder<
      GameUpdateQuery,
      [ActiveGame, GameSpec]
    >,
    @Inject(gameTurnEndSignalMessageSendOutputPortSymbol)
    @Optional()
    gameTurnEndSignalMessageSendOutputPort:
      | GameTurnEndSignalMessageSendOutputPort
      | undefined,
    @Inject(gamePersistenceOutputPortSymbol)
    gamePersistenceOutputPort: GamePersistenceOutputPort,
    @Inject(GameService)
    gameService: GameService,
    @Inject(gameSpecPersistenceOutputPortSymbol)
    gameSpecPersistenceOutputPort: GameSpecPersistenceOutputPort,
    @Inject(StartGameUpdateQueryFromGameBuilder)
    startGameUpdateQueryFromGameBuilder: Builder<
      GameUpdateQuery,
      [NonStartedGame, GameSpec]
    >,
    @Inject(uuidProviderOutputPortSymbol)
    uuidProviderOutputPort: UuidProviderOutputPort,
  ) {
    this.#createGameInitialSnapshotUseCaseHandler =
      createGameInitialSnapshotUseCaseHandler;
    this.#gameCardsEffectUpdateQueryFromGameBuilder =
      gameCardsEffectUpdateQueryFromGameBuilder;
    this.#gamePassTurnUpdateQueryFromGameBuilder =
      gamePassTurnUpdateQueryFromGameBuilder;
    this.#gameTurnEndSignalMessageSendOutputPort =
      gameTurnEndSignalMessageSendOutputPort;
    this.#gamePersistenceOutputPort = gamePersistenceOutputPort;
    this.#gameService = gameService;
    this.#gameSpecPersistenceOutputPort = gameSpecPersistenceOutputPort;
    this.#logger = new Logger(NonStartedGameFilledEventHandler.name);
    this.#startGameUpdateQueryFromGameBuilder =
      startGameUpdateQueryFromGameBuilder;
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

    const updatedGame: ActiveGame = await this.#updateNonStartedGame(
      game,
      gameSpec,
      transactionWrapper,
    );

    await this.#createGameInitialSnapshot(updatedGame, transactionWrapper);

    await this.#sendGameTurnEndSignal(updatedGame);
  }

  #isActiveGame(game: Game | undefined): game is ActiveGame {
    return game?.state.status === GameStatus.active;
  }

  async #createGameInitialSnapshot(
    game: ActiveGame,
    transactionWrapper: TransactionWrapper,
  ): Promise<void> {
    const gameInitialSnapshotCreateQuery: GameInitialSnapshotCreateQuery =
      this.#buildGameInitialSnapshotCreateQuery(game);

    await this.#createGameInitialSnapshotUseCaseHandler.handle(
      gameInitialSnapshotCreateQuery,
      transactionWrapper,
    );
  }

  async #applyCurrentCardEffect(
    game: ActiveGame,
    transactionWrapper: TransactionWrapper,
  ): Promise<ActiveGame> {
    const cardEffectUpdateQuery: GameUpdateQuery =
      this.#gameCardsEffectUpdateQueryFromGameBuilder.build(
        game,
        game.state.currentCard,
        1,
        this.#gameService.isColored(game.state.currentCard)
          ? undefined
          : game.state.currentColor,
      );

    await this.#gamePersistenceOutputPort.update(
      cardEffectUpdateQuery,
      transactionWrapper,
    );

    return this.#getUpdatedGame(game, transactionWrapper);
  }

  #buildGameInitialSnapshotCreateQuery(
    updatedGame: ActiveGame,
  ): GameInitialSnapshotCreateQuery {
    const gameInitialSnapshotId: string =
      this.#uuidProviderOutputPort.generateV4();

    return {
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

  async #getUpdatedGame(
    game: Game,
    transactionWrapper: TransactionWrapper,
  ): Promise<ActiveGame> {
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

    return updatedGame;
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

  async #passTurn(
    game: ActiveGame,
    gameSpec: GameSpec,
    transactionWrapper: TransactionWrapper,
  ): Promise<ActiveGame> {
    const passTurnGameUpdateQuery: GameUpdateQuery =
      this.#gamePassTurnUpdateQueryFromGameBuilder.build(game, gameSpec);

    await this.#gamePersistenceOutputPort.update(
      passTurnGameUpdateQuery,
      transactionWrapper,
    );

    return this.#getUpdatedGame(game, transactionWrapper);
  }

  async #sendGameTurnEndSignal(activeGame: ActiveGame): Promise<void> {
    if (this.#gameTurnEndSignalMessageSendOutputPort !== undefined) {
      this.#logger.log(
        `Detected start of game "${activeGame.id}", sending signal...`,
      );

      await this.#gameTurnEndSignalMessageSendOutputPort.send({
        data: {
          gameId: activeGame.id,
          turn: activeGame.state.turn,
        },
        delivery: {
          schedule: {
            delayMs: GAME_TURN_DURATION_MS,
            kind: MessageDeliveryScheduleKind.delay,
          },
        },
      });

      this.#logger.log(
        `End of turn signal sent for game "${activeGame.id}" (at turn ${activeGame.state.turn.toString()})`,
      );
    } else {
      this.#logger.log(
        `Detected start of game "${activeGame.id}", no signal is sent`,
      );
    }
  }

  async #startGame(
    game: NonStartedGame,
    gameSpec: GameSpec,
    transactionWrapper: TransactionWrapper,
  ): Promise<ActiveGame> {
    const startGameUpdateQuery: GameUpdateQuery =
      this.#startGameUpdateQueryFromGameBuilder.build(game, gameSpec);

    await this.#gamePersistenceOutputPort.update(
      startGameUpdateQuery,
      transactionWrapper,
    );

    return this.#getUpdatedGame(game, transactionWrapper);
  }

  async #updateNonStartedGame(
    game: NonStartedGame,
    gameSpec: GameSpec,
    transactionWrapper: TransactionWrapper,
  ): Promise<ActiveGame> {
    let updatedGame: ActiveGame = await this.#startGame(
      game,
      gameSpec,
      transactionWrapper,
    );

    updatedGame = await this.#applyCurrentCardEffect(
      updatedGame,
      transactionWrapper,
    );

    updatedGame = await this.#passTurn(
      updatedGame,
      gameSpec,
      transactionWrapper,
    );

    return updatedGame;
  }
}
