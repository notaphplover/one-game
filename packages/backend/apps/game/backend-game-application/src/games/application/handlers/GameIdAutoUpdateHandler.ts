import { models as apiModels } from '@cornie-js/api-models';
import {
  AppError,
  AppErrorKind,
  Builder,
  Handler,
} from '@cornie-js/backend-common';
import {
  ActiveGame,
  ActiveGameSlot,
  CurrentPlayerMustPlayCardsIfPossibleSpec,
  Game,
  GameFindQuery,
  GameOptions,
  GameSpec,
  GameSpecFindQuery,
  GameStatus,
  PlayerCanDrawCardsSpec,
} from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';

import { UserManagementInputPort } from '../../../users/application/ports/input/UserManagementInputPort';
import { RandomGameIdPlayCardsQueryV1FromActiveGameBuilder } from '../builders/RandomGameIdPlayCardsQueryV1FromActiveGameBuilder';
import {
  GamePersistenceOutputPort,
  gamePersistenceOutputPortSymbol,
} from '../ports/output/GamePersistenceOutputPort';
import {
  GameSpecPersistenceOutputPort,
  gameSpecPersistenceOutputPortSymbol,
} from '../ports/output/GameSpecPersistenceOutputPort';
import { GameIdDrawCardsQueryV1Handler } from './GameIdDrawCardsQueryV1Handler';
import { GameIdPassTurnQueryV1Handler } from './GameIdPassTurnQueryV1Handler';
import { GameIdPlayCardsQueryV1Handler } from './GameIdPlayCardsQueryV1Handler';

@Injectable()
export class GameIdAutoUpdateHandler implements Handler<[string], void> {
  readonly #currentPlayerMustPlayCardsIfPossibleSpec: CurrentPlayerMustPlayCardsIfPossibleSpec;
  readonly #gameIdDrawCardsQueryV1Handler: Handler<
    [string, apiModels.GameIdDrawCardsQueryV1, apiModels.UserV1],
    void
  >;
  readonly #gameIdPassTurnQueryV1Handler: Handler<
    [string, apiModels.GameIdPassTurnQueryV1, apiModels.UserV1],
    void
  >;
  readonly #gameIdPlayCardsQueryV1Handler: Handler<
    [string, apiModels.GameIdPlayCardsQueryV1, apiModels.UserV1],
    void
  >;
  readonly #gamePersistenceOutputPort: GamePersistenceOutputPort;
  readonly #gameSpecPersistenceOutputPort: GameSpecPersistenceOutputPort;
  readonly #playerCanDrawCardsSpec: PlayerCanDrawCardsSpec;
  readonly #randomGameIdPlayCardsQueryV1FromActiveGameBuilder: Builder<
    apiModels.GameIdPlayCardsQueryV1 | undefined,
    [ActiveGame, GameOptions]
  >;
  readonly #userManagementInputPort: UserManagementInputPort;

  constructor(
    @Inject(CurrentPlayerMustPlayCardsIfPossibleSpec)
    currentPlayerMustPlayCardsIfPossibleSpec: CurrentPlayerMustPlayCardsIfPossibleSpec,
    @Inject(GameIdDrawCardsQueryV1Handler)
    gameIdDrawCardsQueryV1Handler: Handler<
      [string, apiModels.GameIdDrawCardsQueryV1, apiModels.UserV1],
      void
    >,
    @Inject(GameIdPassTurnQueryV1Handler)
    gameIdPassTurnQueryV1Handler: Handler<
      [string, apiModels.GameIdPassTurnQueryV1, apiModels.UserV1],
      void
    >,
    @Inject(GameIdPlayCardsQueryV1Handler)
    gameIdPlayCardsQueryV1Handler: Handler<
      [string, apiModels.GameIdPlayCardsQueryV1, apiModels.UserV1],
      void
    >,
    @Inject(gameSpecPersistenceOutputPortSymbol)
    gameSpecPersistenceOutputPort: GameSpecPersistenceOutputPort,
    @Inject(gamePersistenceOutputPortSymbol)
    gamePersistenceOutputPort: GamePersistenceOutputPort,
    @Inject(PlayerCanDrawCardsSpec)
    playerCanDrawCardsSpec: PlayerCanDrawCardsSpec,
    @Inject(RandomGameIdPlayCardsQueryV1FromActiveGameBuilder)
    randomGameIdPlayCardsQueryV1FromActiveGameBuilder: Builder<
      apiModels.GameIdPlayCardsQueryV1 | undefined,
      [ActiveGame, GameOptions]
    >,
    @Inject(UserManagementInputPort)
    userManagementInputPort: UserManagementInputPort,
  ) {
    this.#currentPlayerMustPlayCardsIfPossibleSpec =
      currentPlayerMustPlayCardsIfPossibleSpec;
    this.#gameIdDrawCardsQueryV1Handler = gameIdDrawCardsQueryV1Handler;
    this.#gameIdPassTurnQueryV1Handler = gameIdPassTurnQueryV1Handler;
    this.#gameIdPlayCardsQueryV1Handler = gameIdPlayCardsQueryV1Handler;
    this.#gameSpecPersistenceOutputPort = gameSpecPersistenceOutputPort;
    this.#gamePersistenceOutputPort = gamePersistenceOutputPort;
    this.#playerCanDrawCardsSpec = playerCanDrawCardsSpec;
    this.#randomGameIdPlayCardsQueryV1FromActiveGameBuilder =
      randomGameIdPlayCardsQueryV1FromActiveGameBuilder;
    this.#userManagementInputPort = userManagementInputPort;
  }

  public async handle(gameId: string): Promise<void> {
    let [game, gameSpec]: [ActiveGame, GameSpec] =
      await this.#getActiveGameAndSpecOrThrow(gameId);

    const activeUserId: string = (
      game.state.slots[game.state.currentPlayingSlotIndex] as ActiveGameSlot
    ).userId;

    const userV1: apiModels.UserV1 = await this.#getUserOrThrow(activeUserId);

    await this.#tryPlayCards(game, gameSpec.options, userV1);

    [game, gameSpec] = await this.#getActiveGameAndSpecOrThrow(gameId);

    await this.#tryDrawCards(game, gameSpec.options, userV1);

    [game, gameSpec] = await this.#getActiveGameAndSpecOrThrow(gameId);

    await this.#tryPlayCards(game, gameSpec.options, userV1);

    [game, gameSpec] = await this.#getActiveGameAndSpecOrThrow(gameId);

    await this.#passTurn(game, userV1);
  }

  async #getActiveGameAndSpecOrThrow(
    gameId: string,
  ): Promise<[ActiveGame, GameSpec]> {
    const gameFindQuery: GameFindQuery = {
      id: gameId,
    };

    const gameSpecFindQuery: GameSpecFindQuery = {
      gameIds: [gameId],
    };

    const [game, gameSpec]: [Game | undefined, GameSpec | undefined] =
      await Promise.all([
        this.#gamePersistenceOutputPort.findOne(gameFindQuery),
        this.#gameSpecPersistenceOutputPort.findOne(gameSpecFindQuery),
      ]);

    if (game === undefined) {
      throw new AppError(
        AppErrorKind.entityNotFound,
        `Game "${gameId}" not found`,
      );
    }

    if (gameSpec === undefined) {
      throw new AppError(
        AppErrorKind.unknown,
        `Expecting game "${gameId}" to have spec, none found`,
      );
    }

    if (!this.#isActiveGame(game)) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        `Game "${gameId}" is not eligible for this operation. Reason: the game is not active`,
      );
    }

    return [game, gameSpec];
  }

  #isActiveGame(game: Game): game is ActiveGame {
    return game.state.status === GameStatus.active;
  }

  async #passTurn(game: ActiveGame, userV1: apiModels.UserV1): Promise<void> {
    await this.#gameIdPassTurnQueryV1Handler.handle(
      game.id,
      {
        kind: 'passTurn',
        slotIndex: game.state.currentPlayingSlotIndex,
      },
      userV1,
    );
  }

  async #tryDrawCards(
    game: ActiveGame,
    gameOptions: GameOptions,
    userV1: apiModels.UserV1,
  ): Promise<void> {
    if (
      this.#playerCanDrawCardsSpec.isSatisfiedBy(
        game,
        gameOptions,
        game.state.currentPlayingSlotIndex,
      )
    ) {
      await this.#gameIdDrawCardsQueryV1Handler.handle(
        game.id,
        {
          kind: 'drawCards',
          slotIndex: game.state.currentPlayingSlotIndex,
        },
        userV1,
      );
    }
  }

  async #tryPlayCards(
    game: ActiveGame,
    gameOptions: GameOptions,
    userV1: apiModels.UserV1,
  ): Promise<void> {
    if (
      this.#currentPlayerMustPlayCardsIfPossibleSpec.isSatisfiedBy(
        game,
        gameOptions,
      )
    ) {
      const gameIdUpdateQueryV1: apiModels.GameIdPlayCardsQueryV1 | undefined =
        this.#randomGameIdPlayCardsQueryV1FromActiveGameBuilder.build(
          game,
          gameOptions,
        );

      if (gameIdUpdateQueryV1 !== undefined) {
        await this.#gameIdPlayCardsQueryV1Handler.handle(
          game.id,
          gameIdUpdateQueryV1,
          userV1,
        );
      }
    }
  }

  async #getUserOrThrow(userId: string): Promise<apiModels.UserV1> {
    const userV1: apiModels.UserV1 | undefined =
      await this.#userManagementInputPort.findOne(userId);

    if (userV1 === undefined) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        `Unable to process operation, User "${userId}" not found`,
      );
    }

    return userV1;
  }
}
