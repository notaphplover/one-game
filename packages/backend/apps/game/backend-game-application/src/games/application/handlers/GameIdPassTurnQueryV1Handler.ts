import { models as apiModels } from '@cornie-js/api-models';
import { AppError, AppErrorKind, Handler } from '@cornie-js/backend-common';
import {
  ActiveGame,
  ActiveGameSlot,
  Game,
  GameFindQuery,
  GameOptions,
  GameOptionsFindQuery,
  GameService,
  GameUpdateQuery,
  PlayerCanPassTurnSpec,
} from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';

import {
  GameOptionsPersistenceOutputPort,
  gameOptionsPersistenceOutputPortSymbol,
} from '../ports/output/GameOptionsPersistenceOutputPort';
import {
  GamePersistenceOutputPort,
  gamePersistenceOutputPortSymbol,
} from '../ports/output/GamePersistenceOutputPort';

@Injectable()
export class GameIdPassTurnQueryV1Handler
  implements
    Handler<[string, apiModels.GameIdPassTurnQueryV1, apiModels.UserV1], void>
{
  readonly #gameOptionsPersistenceOutputPort: GameOptionsPersistenceOutputPort;
  readonly #gamePersistenceOutputPort: GamePersistenceOutputPort;
  readonly #gameService: GameService;
  readonly #playerCanPassTurnSpec: PlayerCanPassTurnSpec;

  constructor(
    @Inject(gameOptionsPersistenceOutputPortSymbol)
    gameOptionsPersistenceOutputPort: GameOptionsPersistenceOutputPort,
    @Inject(gamePersistenceOutputPortSymbol)
    gamePersistenceOutputPort: GamePersistenceOutputPort,
    @Inject(GameService)
    gameService: GameService,
    @Inject(PlayerCanPassTurnSpec)
    playerCanPassTurnSpec: PlayerCanPassTurnSpec,
  ) {
    this.#gameOptionsPersistenceOutputPort = gameOptionsPersistenceOutputPort;
    this.#gamePersistenceOutputPort = gamePersistenceOutputPort;
    this.#gameService = gameService;
    this.#playerCanPassTurnSpec = playerCanPassTurnSpec;
  }

  public async handle(
    gameId: string,
    gameIdPassTurnQueryV1: apiModels.GameIdPassTurnQueryV1,
    userV1: apiModels.UserV1,
  ): Promise<void> {
    const [game, gameOptions]: [ActiveGame, GameOptions] =
      await this.#getActiveGameAndOptionsOrThrow(gameId);

    this.#checkRightPlayer(game, gameIdPassTurnQueryV1, userV1);

    this.#checkUnprocessableOperation(game, gameOptions, gameIdPassTurnQueryV1);

    const gameUpdateQuery: GameUpdateQuery =
      this.#gameService.buildPassTurnGameUpdateQuery(game);

    await this.#gamePersistenceOutputPort.update(gameUpdateQuery);
  }

  #checkRightPlayer(
    game: ActiveGame,
    gameIdPassTurnQueryV1: apiModels.GameIdPassTurnQueryV1,
    userV1: apiModels.UserV1,
  ): void {
    const userGameSlot: ActiveGameSlot | undefined =
      game.state.slots[gameIdPassTurnQueryV1.slotIndex];

    if (userGameSlot === undefined) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        `Player is not eligible for this operation. Reason: game slot "${gameIdPassTurnQueryV1.slotIndex}" does not exist`,
      );
    }

    if (userV1.id !== userGameSlot.userId) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        `Player is not eligible for this operation. Reason: user "${userV1.id}" does not own game slot "${gameIdPassTurnQueryV1.slotIndex}"`,
      );
    }

    if (
      gameIdPassTurnQueryV1.slotIndex !== game.state.currentPlayingSlotIndex
    ) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        "Player is not eligible for this operation. Reason: it is not the player's turn",
      );
    }
  }

  #checkUnprocessableOperation(
    game: ActiveGame,
    gameOptions: GameOptions,
    gameIdPassTurnQueryV1: apiModels.GameIdPassTurnQueryV1,
  ): void {
    if (
      !this.#playerCanPassTurnSpec.isSatisfiedBy(
        game,
        gameOptions,
        gameIdPassTurnQueryV1.slotIndex,
      )
    ) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        'Player cannot end the turn. Reason: there is a pending action preventing the turn to be ended',
      );
    }
  }

  async #getActiveGameAndOptionsOrThrow(
    gameId: string,
  ): Promise<[ActiveGame, GameOptions]> {
    const gameFindQuery: GameFindQuery = {
      id: gameId,
    };

    const gameOptionsFindQuery: GameOptionsFindQuery = {
      gameId,
    };

    const [game, gameOptions]: [Game | undefined, GameOptions | undefined] =
      await Promise.all([
        this.#gamePersistenceOutputPort.findOne(gameFindQuery),
        this.#gameOptionsPersistenceOutputPort.findOne(gameOptionsFindQuery),
      ]);

    if (game === undefined) {
      throw new AppError(
        AppErrorKind.entityNotFound,
        `Game "${gameId}" not found`,
      );
    }

    if (gameOptions === undefined) {
      throw new AppError(
        AppErrorKind.unknown,
        `Expecting game "${gameId}" to have options, none found`,
      );
    }

    if (!this.#isActiveGame(game)) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        `Game "${gameId}" is not eligible for this operation. Reason: the game is not active`,
      );
    }

    return [game, gameOptions];
  }

  #isActiveGame(game: Game): game is ActiveGame {
    return game.state.active;
  }
}
