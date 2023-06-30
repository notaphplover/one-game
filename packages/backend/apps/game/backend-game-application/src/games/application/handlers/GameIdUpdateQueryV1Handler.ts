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
} from '@cornie-js/backend-game-domain/games';

import { GameOptionsPersistenceOutputPort } from '../ports/output/GameOptionsPersistenceOutputPort';
import { GamePersistenceOutputPort } from '../ports/output/GamePersistenceOutputPort';

export abstract class GameIdUpdateQueryV1Handler<
  TQuery extends apiModels.GameIdUpdateQueryV1,
> implements Handler<[string, TQuery, apiModels.UserV1], void>
{
  protected readonly _gamePersistenceOutputPort: GamePersistenceOutputPort;
  protected readonly _gameService: GameService;
  readonly #gameOptionsPersistenceOutputPort: GameOptionsPersistenceOutputPort;

  constructor(
    gameOptionsPersistenceOutputPort: GameOptionsPersistenceOutputPort,
    gamePersistenceOutputPort: GamePersistenceOutputPort,
    gameService: GameService,
  ) {
    this.#gameOptionsPersistenceOutputPort = gameOptionsPersistenceOutputPort;
    this._gamePersistenceOutputPort = gamePersistenceOutputPort;
    this._gameService = gameService;
  }

  public async handle(
    gameId: string,
    gameIdUpdateQueryV1: TQuery,
    userV1: apiModels.UserV1,
  ): Promise<void> {
    const [game, gameOptions]: [ActiveGame, GameOptions] =
      await this.#getActiveGameAndOptionsOrThrow(gameId);

    this.#checkRightPlayer(game, gameIdUpdateQueryV1, userV1);

    this._checkUnprocessableOperation(game, gameOptions, gameIdUpdateQueryV1);

    const gameUpdateQuery: GameUpdateQuery = this._buildUpdateQuery(
      game,
      gameOptions,
      gameIdUpdateQueryV1,
    );

    await this._gamePersistenceOutputPort.update(gameUpdateQuery);
  }

  #checkRightPlayer(
    game: ActiveGame,
    gameIdUpdateQueryV1: TQuery,
    userV1: apiModels.UserV1,
  ): void {
    const userGameSlot: ActiveGameSlot | undefined =
      game.state.slots[gameIdUpdateQueryV1.slotIndex];

    if (userGameSlot === undefined) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        `Player is not eligible for this operation. Reason: game slot "${gameIdUpdateQueryV1.slotIndex}" does not exist`,
      );
    }

    if (userV1.id !== userGameSlot.userId) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        `Player is not eligible for this operation. Reason: user "${userV1.id}" does not own game slot "${gameIdUpdateQueryV1.slotIndex}"`,
      );
    }

    if (gameIdUpdateQueryV1.slotIndex !== game.state.currentPlayingSlotIndex) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        "Player is not eligible for this operation. Reason: it is not the player's turn",
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
        this._gamePersistenceOutputPort.findOne(gameFindQuery),
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

  protected abstract _buildUpdateQuery(
    game: ActiveGame,
    gameOptions: GameOptions,
    gameIdUpdateQueryV1: TQuery,
  ): GameUpdateQuery;

  protected abstract _checkUnprocessableOperation(
    game: ActiveGame,
    gameOptions: GameOptions,
    gameIdUpdateQueryV1: TQuery,
  ): void;
}
