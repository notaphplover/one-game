import { models as apiModels } from '@cornie-js/api-models';
import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import {
  ActiveGame,
  CurrentPlayerCanPlayCardsSpec,
  GameOptions,
  GameService,
  GameUpdateQuery,
  PlayerCanUpdateGameSpec,
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
export class GameIdPlayCardsQueryV1Handler extends GameIdUpdateQueryV1Handler<apiModels.GameIdPlayCardsQueryV1> {
  readonly #currentPlayerCanPlayCardsSpec: CurrentPlayerCanPlayCardsSpec;

  constructor(
    @Inject(gameOptionsPersistenceOutputPortSymbol)
    gameOptionsPersistenceOutputPort: GameOptionsPersistenceOutputPort,
    @Inject(gamePersistenceOutputPortSymbol)
    gamePersistenceOutputPort: GamePersistenceOutputPort,
    @Inject(GameService)
    gameService: GameService,
    @Inject(PlayerCanUpdateGameSpec)
    playerCanUpdateGameSpec: PlayerCanUpdateGameSpec,
    @Inject(CurrentPlayerCanPlayCardsSpec)
    currentPlayerCanPlayCardsSpec: CurrentPlayerCanPlayCardsSpec,
  ) {
    super(
      gameOptionsPersistenceOutputPort,
      gamePersistenceOutputPort,
      gameService,
      playerCanUpdateGameSpec,
    );

    this.#currentPlayerCanPlayCardsSpec = currentPlayerCanPlayCardsSpec;
  }

  protected override _buildUpdateQuery(
    game: ActiveGame,
    _gameOptions: GameOptions,
    gameIdUpdateQueryV1: apiModels.GameIdPlayCardsQueryV1,
  ): GameUpdateQuery {
    return this._gameService.buildPlayCardsGameUpdateQuery(
      game,
      gameIdUpdateQueryV1.cardIndexes,
      gameIdUpdateQueryV1.slotIndex,
    );
  }

  protected override _checkUnprocessableOperation(
    game: ActiveGame,
    gameOptions: GameOptions,
    gameIdUpdateQueryV1: apiModels.GameIdPlayCardsQueryV1,
  ): void {
    if (
      !this.#currentPlayerCanPlayCardsSpec.isSatisfiedBy(
        game,
        gameOptions,
        gameIdUpdateQueryV1.cardIndexes,
      )
    ) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        'Operation not allowed. Reason: selected cards cannot be played in the current context',
      );
    }
  }
}
