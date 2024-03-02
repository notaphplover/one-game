import { models as apiModels } from '@cornie-js/api-models';
import {
  AppError,
  AppErrorKind,
  Builder,
  Handler,
} from '@cornie-js/backend-common';
import { CardColor } from '@cornie-js/backend-game-domain/cards';
import {
  ActiveGame,
  CurrentPlayerCanPlayCardsSpec,
  GameSpec,
  GameService,
  GameUpdateQuery,
  PlayerCanUpdateGameSpec,
} from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';

import { CardColorFromCardColorV1Builder } from '../../../cards/application/builders/CardColorFromCardColorV1Builder';
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
export class GameIdPlayCardsQueryV1Handler extends GameIdUpdateQueryV1Handler<apiModels.GameIdPlayCardsQueryV1> {
  readonly #cardColorFromCardColorV1Builder: Builder<
    CardColor,
    [apiModels.CardColorV1]
  >;
  readonly #currentPlayerCanPlayCardsSpec: CurrentPlayerCanPlayCardsSpec;

  constructor(
    @Inject(gameSpecPersistenceOutputPortSymbol)
    gameSpecPersistenceOutputPort: GameSpecPersistenceOutputPort,
    @Inject(gamePersistenceOutputPortSymbol)
    gamePersistenceOutputPort: GamePersistenceOutputPort,
    @Inject(GameService)
    gameService: GameService,
    @Inject(GameUpdatedEventHandler)
    gameUpdatedEventHandler: Handler<[GameUpdatedEvent], void>,
    @Inject(PlayerCanUpdateGameSpec)
    playerCanUpdateGameSpec: PlayerCanUpdateGameSpec,
    @Inject(CardColorFromCardColorV1Builder)
    cardColorFromCardColorV1Builder: Builder<
      CardColor,
      [apiModels.CardColorV1]
    >,
    @Inject(CurrentPlayerCanPlayCardsSpec)
    currentPlayerCanPlayCardsSpec: CurrentPlayerCanPlayCardsSpec,
  ) {
    super(
      gameSpecPersistenceOutputPort,
      gamePersistenceOutputPort,
      gameService,
      gameUpdatedEventHandler,
      playerCanUpdateGameSpec,
    );

    this.#cardColorFromCardColorV1Builder = cardColorFromCardColorV1Builder;
    this.#currentPlayerCanPlayCardsSpec = currentPlayerCanPlayCardsSpec;
  }

  protected override _buildUpdateQuery(
    game: ActiveGame,
    _gameSpec: GameSpec,
    gameIdUpdateQueryV1: apiModels.GameIdPlayCardsQueryV1,
  ): GameUpdateQuery {
    return this._gameService.buildPlayCardsGameUpdateQuery(
      game,
      gameIdUpdateQueryV1.cardIndexes,
      gameIdUpdateQueryV1.slotIndex,
      this.#getColorOrUndefined(gameIdUpdateQueryV1.colorChoice),
    );
  }

  protected override _checkUnprocessableOperation(
    game: ActiveGame,
    gameSpec: GameSpec,
    gameIdUpdateQueryV1: apiModels.GameIdPlayCardsQueryV1,
  ): void {
    if (
      !this.#currentPlayerCanPlayCardsSpec.isSatisfiedBy(
        game,
        gameSpec.options,
        gameIdUpdateQueryV1.cardIndexes,
      )
    ) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        'Operation not allowed. Reason: selected cards cannot be played in the current context',
      );
    }
  }

  #getColorOrUndefined(
    cardColorV1: apiModels.CardColorV1 | undefined,
  ): CardColor | undefined {
    return cardColorV1 === undefined
      ? undefined
      : this.#cardColorFromCardColorV1Builder.build(cardColorV1);
  }
}
