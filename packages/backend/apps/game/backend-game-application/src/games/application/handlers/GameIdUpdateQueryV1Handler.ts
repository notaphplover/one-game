import { models as apiModels } from '@cornie-js/api-models';
import { AppError, AppErrorKind, Handler } from '@cornie-js/backend-common';
import {
  ActiveGame,
  Game,
  GameFindQuery,
  GameSpec,
  GameSpecFindQuery,
  GameStatus,
  GameUpdateQuery,
  PlayerCanUpdateGameSpec,
} from '@cornie-js/backend-game-domain/games';

import { GameUpdatedEvent } from '../models/GameUpdatedEvent';
import { GamePersistenceOutputPort } from '../ports/output/GamePersistenceOutputPort';
import { GameSpecPersistenceOutputPort } from '../ports/output/GameSpecPersistenceOutputPort';

export abstract class GameIdUpdateQueryV1Handler<
  TQuery extends apiModels.GameIdUpdateQueryV1,
> implements Handler<[string, TQuery, apiModels.UserV1], void>
{
  protected readonly _gamePersistenceOutputPort: GamePersistenceOutputPort;
  readonly #gameSpecPersistenceOutputPort: GameSpecPersistenceOutputPort;
  readonly #gameUpdatedEventHandler: Handler<[GameUpdatedEvent], void>;
  readonly #playerCanUpdateGameSpec: PlayerCanUpdateGameSpec;

  constructor(
    gameSpecPersistenceOutputPort: GameSpecPersistenceOutputPort,
    gamePersistenceOutputPort: GamePersistenceOutputPort,
    gameUpdatedEventHandler: Handler<[GameUpdatedEvent], void>,
    playerCanUpdateGameSpec: PlayerCanUpdateGameSpec,
  ) {
    this.#gameSpecPersistenceOutputPort = gameSpecPersistenceOutputPort;
    this._gamePersistenceOutputPort = gamePersistenceOutputPort;
    this.#gameUpdatedEventHandler = gameUpdatedEventHandler;
    this.#playerCanUpdateGameSpec = playerCanUpdateGameSpec;
  }

  public async handle(
    gameId: string,
    gameIdUpdateQueryV1: TQuery,
    userV1: apiModels.UserV1,
  ): Promise<void> {
    const [game, gameSpec]: [ActiveGame, GameSpec] =
      await this.#getActiveGameAndSpecOrThrow(gameId);

    this.#checkRightPlayer(game, gameIdUpdateQueryV1, userV1);

    this._checkUnprocessableOperation(game, gameSpec, gameIdUpdateQueryV1);

    const gameUpdateQuery: GameUpdateQuery = this._buildUpdateQuery(
      game,
      gameSpec,
      gameIdUpdateQueryV1,
    );

    await this._gamePersistenceOutputPort.update(gameUpdateQuery);

    await this.#gameUpdatedEventHandler.handle({
      gameBeforeUpdate: game,
      gameUpdateQuery,
    });
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
        this._gamePersistenceOutputPort.findOne(gameFindQuery),
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

  protected abstract _buildUpdateQuery(
    game: ActiveGame,
    gameSpec: GameSpec,
    gameIdUpdateQueryV1: TQuery,
  ): GameUpdateQuery;

  protected abstract _checkUnprocessableOperation(
    game: ActiveGame,
    gameSpec: GameSpec,
    gameIdUpdateQueryV1: TQuery,
  ): void;
}
