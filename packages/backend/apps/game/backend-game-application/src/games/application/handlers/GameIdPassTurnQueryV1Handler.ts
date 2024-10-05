import { models as apiModels } from '@cornie-js/api-models';
import {
  AppError,
  AppErrorKind,
  Builder,
  Handler,
} from '@cornie-js/backend-common';
import { TransactionWrapper } from '@cornie-js/backend-db/application';
import {
  ActiveGame,
  GamePassTurnUpdateQueryFromGameBuilder,
  GameSpec,
  GameUpdateQuery,
  PlayerCanPassTurnSpec,
  PlayerCanUpdateGameSpec,
} from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';

import {
  TransactionProvisionOutputPort,
  transactionProvisionOutputPortSymbol,
} from '../../../foundation/db/application/ports/output/TransactionProvisionOutputPort';
import { ActiveGameUpdatedEvent } from '../models/ActiveGameUpdatedEvent';
import { ActiveGameUpdatedEventKind } from '../models/ActiveGameUpdatedEventKind';
import {
  GamePersistenceOutputPort,
  gamePersistenceOutputPortSymbol,
} from '../ports/output/GamePersistenceOutputPort';
import {
  GameSpecPersistenceOutputPort,
  gameSpecPersistenceOutputPortSymbol,
} from '../ports/output/GameSpecPersistenceOutputPort';
import { GameIdUpdateQueryV1Handler } from './GameIdUpdateQueryV1Handler';
import { GameUpdatedEventHandler } from './GameUpdatedEventHandler';

@Injectable()
export class GameIdPassTurnQueryV1Handler extends GameIdUpdateQueryV1Handler<apiModels.GameIdPassTurnQueryV1> {
  readonly #gamePassTurnUpdateQueryFromGameBuilder: Builder<
    GameUpdateQuery,
    [ActiveGame, GameSpec]
  >;
  readonly #playerCanPassTurnSpec: PlayerCanPassTurnSpec;

  constructor(
    @Inject(GamePassTurnUpdateQueryFromGameBuilder)
    gamePassTurnUpdateQueryFromGameBuilder: Builder<
      GameUpdateQuery,
      [ActiveGame, GameSpec]
    >,
    @Inject(gamePersistenceOutputPortSymbol)
    gamePersistenceOutputPort: GamePersistenceOutputPort,
    @Inject(gameSpecPersistenceOutputPortSymbol)
    gameSpecPersistenceOutputPort: GameSpecPersistenceOutputPort,
    @Inject(GameUpdatedEventHandler)
    gameUpdatedEventHandler: Handler<[ActiveGameUpdatedEvent], void>,
    @Inject(PlayerCanUpdateGameSpec)
    playerCanUpdateGameSpec: PlayerCanUpdateGameSpec,
    @Inject(PlayerCanPassTurnSpec)
    playerCanPassTurnSpec: PlayerCanPassTurnSpec,
    @Inject(transactionProvisionOutputPortSymbol)
    transactionProvisionOutputPort: TransactionProvisionOutputPort,
  ) {
    super(
      gameSpecPersistenceOutputPort,
      gamePersistenceOutputPort,
      gameUpdatedEventHandler,
      playerCanUpdateGameSpec,
      transactionProvisionOutputPort,
    );

    this.#gamePassTurnUpdateQueryFromGameBuilder =
      gamePassTurnUpdateQueryFromGameBuilder;
    this.#playerCanPassTurnSpec = playerCanPassTurnSpec;
  }

  protected override _checkUnprocessableOperation(
    game: ActiveGame,
    gameSpec: GameSpec,
    gameIdPassTurnQueryV1: apiModels.GameIdPassTurnQueryV1,
  ): void {
    if (
      !this.#playerCanPassTurnSpec.isSatisfiedBy(
        game,
        gameSpec.options,
        gameIdPassTurnQueryV1.slotIndex,
      )
    ) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        'Player cannot end the turn. Reason: there is a pending action preventing the turn to be ended',
      );
    }
  }

  protected override async _handleUpdateGame(
    game: ActiveGame,
    gameSpec: GameSpec,
    _gameIdUpdateQueryV1: apiModels.GameIdPassTurnQueryV1,
    transactionWrapper: TransactionWrapper,
  ): Promise<ActiveGameUpdatedEvent> {
    await this._updateGame(
      this.#buildUpdateQueries(game, gameSpec),
      transactionWrapper,
    );

    return {
      game: await this._getUpdatedGame(game, transactionWrapper),
      gameBeforeUpdate: game,
      kind: ActiveGameUpdatedEventKind.turnPass,
      transactionWrapper,
    };
  }

  #buildUpdateQueries(game: ActiveGame, gameSpec: GameSpec): GameUpdateQuery[] {
    return [this.#gamePassTurnUpdateQueryFromGameBuilder.build(game, gameSpec)];
  }
}
