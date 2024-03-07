import { models as apiModels } from '@cornie-js/api-models';
import {
  AppError,
  AppErrorKind,
  Builder,
  Handler,
} from '@cornie-js/backend-common';
import {
  ActiveGame,
  GameDrawCardsUpdateQueryFromGameBuilder,
  GameSpec,
  GameUpdateQuery,
  PlayerCanDrawCardsSpec,
  PlayerCanUpdateGameSpec,
} from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';

import {
  TransactionProvisionOutputPort,
  transactionProvisionOutputPortSymbol,
} from '../../../foundation/db/application/ports/output/TransactionProvisionOutputPort';
import { GameUpdatedEvent } from '../models/GameUpdatedEvent';
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
export class GameIdDrawCardsQueryV1Handler extends GameIdUpdateQueryV1Handler<apiModels.GameIdDrawCardsQueryV1> {
  readonly #gameDrawCardsUpdateQueryFromGameBuilder: Builder<
    GameUpdateQuery,
    [ActiveGame]
  >;
  readonly #playerCanDrawCardsSpec: PlayerCanDrawCardsSpec;

  constructor(
    @Inject(GameDrawCardsUpdateQueryFromGameBuilder)
    gameDrawCardsUpdateQueryFromGameBuilder: Builder<
      GameUpdateQuery,
      [ActiveGame]
    >,
    @Inject(gamePersistenceOutputPortSymbol)
    gamePersistenceOutputPort: GamePersistenceOutputPort,
    @Inject(gameSpecPersistenceOutputPortSymbol)
    gameSpecPersistenceOutputPort: GameSpecPersistenceOutputPort,
    @Inject(GameUpdatedEventHandler)
    gameUpdatedEventHandler: Handler<[GameUpdatedEvent], void>,
    @Inject(PlayerCanUpdateGameSpec)
    playerCanUpdateGameSpec: PlayerCanUpdateGameSpec,
    @Inject(PlayerCanDrawCardsSpec)
    playerCanDrawCardsSpec: PlayerCanDrawCardsSpec,
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

    this.#gameDrawCardsUpdateQueryFromGameBuilder =
      gameDrawCardsUpdateQueryFromGameBuilder;
    this.#playerCanDrawCardsSpec = playerCanDrawCardsSpec;
  }

  protected override _buildUpdateQueries(game: ActiveGame): GameUpdateQuery[] {
    return [this.#gameDrawCardsUpdateQueryFromGameBuilder.build(game)];
  }

  protected override _checkUnprocessableOperation(
    game: ActiveGame,
    gameSpec: GameSpec,
    gameIdPassTurnQueryV1: apiModels.GameIdDrawCardsQueryV1,
  ): void {
    if (
      !this.#playerCanDrawCardsSpec.isSatisfiedBy(
        game,
        gameSpec.options,
        gameIdPassTurnQueryV1.slotIndex,
      )
    ) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        'Player cannot draw cards',
      );
    }
  }
}
