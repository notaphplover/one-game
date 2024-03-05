import { models as apiModels } from '@cornie-js/api-models';
import {
  AppError,
  AppErrorKind,
  Builder,
  Handler,
} from '@cornie-js/backend-common';
import {
  ActiveGame,
  GameSpec,
  GameUpdateQuery,
  PlayerCanPassTurnSpec,
  PlayerCanUpdateGameSpec,
  GamePassTurnUpdateQueryFromGameBuilder,
} from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';

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
    gameUpdatedEventHandler: Handler<[GameUpdatedEvent], void>,
    @Inject(PlayerCanUpdateGameSpec)
    playerCanUpdateGameSpec: PlayerCanUpdateGameSpec,
    @Inject(PlayerCanPassTurnSpec)
    playerCanPassTurnSpec: PlayerCanPassTurnSpec,
  ) {
    super(
      gameSpecPersistenceOutputPort,
      gamePersistenceOutputPort,
      gameUpdatedEventHandler,
      playerCanUpdateGameSpec,
    );

    this.#gamePassTurnUpdateQueryFromGameBuilder =
      gamePassTurnUpdateQueryFromGameBuilder;
    this.#playerCanPassTurnSpec = playerCanPassTurnSpec;
  }

  protected override _buildUpdateQuery(
    game: ActiveGame,
    gameSpec: GameSpec,
  ): GameUpdateQuery {
    return this.#gamePassTurnUpdateQueryFromGameBuilder.build(game, gameSpec);
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
}
