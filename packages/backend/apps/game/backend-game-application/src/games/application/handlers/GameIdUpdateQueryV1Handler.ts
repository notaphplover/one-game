import { models as apiModels } from '@cornie-js/api-models';
import { AppError, AppErrorKind, Handler } from '@cornie-js/backend-common';
import {
  ActiveGame,
  Game,
  GameFindQuery,
  GameOptions,
  GameOptionsFindQuery,
  GameService,
  GameStatus,
  GameUpdateQuery,
  PlayerCanUpdateGameSpec,
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
  readonly #playerCanUpdateGameSpec: PlayerCanUpdateGameSpec;

  constructor(
    gameOptionsPersistenceOutputPort: GameOptionsPersistenceOutputPort,
    gamePersistenceOutputPort: GamePersistenceOutputPort,
    gameService: GameService,
    playerCanUpdateGameSpec: PlayerCanUpdateGameSpec,
  ) {
    this.#gameOptionsPersistenceOutputPort = gameOptionsPersistenceOutputPort;
    this._gamePersistenceOutputPort = gamePersistenceOutputPort;
    this._gameService = gameService;
    this.#playerCanUpdateGameSpec = playerCanUpdateGameSpec;
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
    const playerCanUpdateSpec: boolean =
      this.#playerCanUpdateGameSpec.isSatisfiedBy(
        game,
        userV1.id,
        gameIdUpdateQueryV1.slotIndex,
      );

    if (!playerCanUpdateSpec) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        'Invalid game update request. Expecting the owner of the playing slot to perform this action',
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
    return game.state.status === GameStatus.active;
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
