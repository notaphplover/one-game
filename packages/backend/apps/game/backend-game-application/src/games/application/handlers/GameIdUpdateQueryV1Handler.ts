import { models as apiModels } from '@cornie-js/api-models';
import { AppError, AppErrorKind, Handler } from '@cornie-js/backend-common';
import { TransactionWrapper } from '@cornie-js/backend-db/application';
import {
  ActiveGame,
  FinishedGame,
  Game,
  GameFindQuery,
  GameSpec,
  GameSpecFindQuery,
  GameStatus,
  GameUpdateQuery,
  NonStartedGame,
  PlayerCanUpdateGameSpec,
} from '@cornie-js/backend-game-domain/games';
import { Logger, LoggerService } from '@nestjs/common';

import { TransactionProvisionOutputPort } from '../../../foundation/db/application/ports/output/TransactionProvisionOutputPort';
import { ActiveGameUpdatedEvent } from '../models/ActiveGameUpdatedEvent';
import { GamePersistenceOutputPort } from '../ports/output/GamePersistenceOutputPort';
import { GameSpecPersistenceOutputPort } from '../ports/output/GameSpecPersistenceOutputPort';

export abstract class GameIdUpdateQueryV1Handler<
  TQuery extends apiModels.GameIdUpdateQueryV1,
> implements Handler<[string, TQuery, apiModels.UserV1], void>
{
  readonly #gamePersistenceOutputPort: GamePersistenceOutputPort;
  readonly #gameSpecPersistenceOutputPort: GameSpecPersistenceOutputPort;
  readonly #gameUpdatedEventHandler: Handler<[ActiveGameUpdatedEvent], void>;
  readonly #logger: LoggerService;
  readonly #playerCanUpdateGameSpec: PlayerCanUpdateGameSpec;
  readonly #transactionProvisionOutputPort: TransactionProvisionOutputPort;

  constructor(
    gameSpecPersistenceOutputPort: GameSpecPersistenceOutputPort,
    gamePersistenceOutputPort: GamePersistenceOutputPort,
    gameUpdatedEventHandler: Handler<[ActiveGameUpdatedEvent], void>,
    playerCanUpdateGameSpec: PlayerCanUpdateGameSpec,
    transactionProvisionOutputPort: TransactionProvisionOutputPort,
  ) {
    this.#gameSpecPersistenceOutputPort = gameSpecPersistenceOutputPort;
    this.#gamePersistenceOutputPort = gamePersistenceOutputPort;
    this.#gameUpdatedEventHandler = gameUpdatedEventHandler;
    this.#logger = new Logger(GameIdUpdateQueryV1Handler.name);
    this.#playerCanUpdateGameSpec = playerCanUpdateGameSpec;
    this.#transactionProvisionOutputPort = transactionProvisionOutputPort;
  }

  public async handle(
    gameId: string,
    gameIdUpdateQueryV1: TQuery,
    userV1: apiModels.UserV1,
  ): Promise<void> {
    this.#logger.log(`Performing validations for game update query v1:
${JSON.stringify(gameIdUpdateQueryV1)}`);

    const [game, gameSpec]: [ActiveGame, GameSpec] =
      await this.#getActiveGameAndSpecOrThrow(gameId);

    this.#checkRightPlayer(game, gameIdUpdateQueryV1, userV1);

    this._checkUnprocessableOperation(game, gameSpec, gameIdUpdateQueryV1);

    this.#logger
      .log(`Proceeding to apply database updates for game update query v1:
      ${JSON.stringify(gameIdUpdateQueryV1)}`);

    await using transactionWrapper: TransactionWrapper =
      await this.#transactionProvisionOutputPort.provide();

    const gameUpdatedEvent: ActiveGameUpdatedEvent =
      await this._handleUpdateGame(
        game,
        gameSpec,
        gameIdUpdateQueryV1,
        transactionWrapper,
      );

    await this.#gameUpdatedEventHandler.handle(gameUpdatedEvent);

    await transactionWrapper.tryCommit();

    this.#logger.log(`Applied database updates for game update query v1:
      ${JSON.stringify(gameIdUpdateQueryV1)}`);
  }

  protected async _getUpdatedGame(
    game: ActiveGame,
    transactionWrapper: TransactionWrapper,
  ): Promise<ActiveGame | FinishedGame> {
    const gameFound: Game | undefined =
      await this.#gamePersistenceOutputPort.findOne(
        { id: game.id },
        transactionWrapper,
      );

    if (gameFound === undefined || this.#isNonStartedGame(gameFound)) {
      throw new AppError(
        AppErrorKind.unknown,
        'Unexpected game found trying to get an updated active game',
      );
    }

    return gameFound;
  }

  protected async _updateGame(
    gameUpdateQueries: GameUpdateQuery[],
    transactionWrapper: TransactionWrapper,
  ): Promise<void> {
    for (const gameUpdateQuery of gameUpdateQueries) {
      await this.#gamePersistenceOutputPort.update(
        gameUpdateQuery,
        transactionWrapper,
      );
    }
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

  #isNonStartedGame(game: Game): game is NonStartedGame {
    return game.state.status === GameStatus.nonStarted;
  }

  protected abstract _checkUnprocessableOperation(
    game: ActiveGame,
    gameSpec: GameSpec,
    gameIdUpdateQueryV1: TQuery,
  ): void;

  protected abstract _handleUpdateGame(
    game: ActiveGame,
    gameSpec: GameSpec,
    gameIdUpdateQueryV1: TQuery,
    transactionWrapper: TransactionWrapper,
  ): Promise<ActiveGameUpdatedEvent>;
}
