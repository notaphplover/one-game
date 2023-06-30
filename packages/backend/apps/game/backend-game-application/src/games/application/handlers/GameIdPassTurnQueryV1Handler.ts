import { models as apiModels } from '@cornie-js/api-models';
import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import {
  ActiveGame,
  GameOptions,
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
import { GameIdUpdateQueryV1Handler } from './GameIdUpdateQueryV1Handler';

@Injectable()
export class GameIdPassTurnQueryV1Handler extends GameIdUpdateQueryV1Handler<apiModels.GameIdPassTurnQueryV1> {
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
    super(
      gameOptionsPersistenceOutputPort,
      gamePersistenceOutputPort,
      gameService,
    );
    this.#playerCanPassTurnSpec = playerCanPassTurnSpec;
  }

  protected override _buildUpdateQuery(game: ActiveGame): GameUpdateQuery {
    return this._gameService.buildPassTurnGameUpdateQuery(game);
  }

  protected override _checkUnprocessableOperation(
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
}
