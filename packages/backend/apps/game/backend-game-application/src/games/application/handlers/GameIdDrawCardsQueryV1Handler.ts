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
  GameDrawCardsUpdateQueryFromGameBuilder,
  GameDrawMutation,
  GameDrawService,
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

const MIN_CARDS_TO_DRAW: number = 1;

@Injectable()
export class GameIdDrawCardsQueryV1Handler extends GameIdUpdateQueryV1Handler<apiModels.GameIdDrawCardsQueryV1> {
  readonly #gameDrawCardsUpdateQueryFromGameBuilder: Builder<
    GameUpdateQuery,
    [ActiveGame, GameDrawMutation]
  >;
  readonly #gameDrawService: GameDrawService;
  readonly #playerCanDrawCardsSpec: PlayerCanDrawCardsSpec;

  constructor(
    @Inject(GameDrawCardsUpdateQueryFromGameBuilder)
    gameDrawCardsUpdateQueryFromGameBuilder: Builder<
      GameUpdateQuery,
      [ActiveGame, GameDrawMutation]
    >,
    @Inject(GameDrawService)
    gameDrawService: GameDrawService,
    @Inject(gamePersistenceOutputPortSymbol)
    gamePersistenceOutputPort: GamePersistenceOutputPort,
    @Inject(gameSpecPersistenceOutputPortSymbol)
    gameSpecPersistenceOutputPort: GameSpecPersistenceOutputPort,
    @Inject(GameUpdatedEventHandler)
    gameUpdatedEventHandler: Handler<[ActiveGameUpdatedEvent], void>,
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
    this.#gameDrawService = gameDrawService;
    this.#playerCanDrawCardsSpec = playerCanDrawCardsSpec;
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
  protected override async _handleUpdateGame(
    game: ActiveGame,
    _gameSpec: GameSpec,
    _gameIdUpdateQueryV1: apiModels.GameIdDrawCardsQueryV1,
    transactionWrapper: TransactionWrapper,
  ): Promise<ActiveGameUpdatedEvent> {
    const drawMutation: GameDrawMutation = this.#buildDrawMutation(game);

    const gameUpdateQuery: GameUpdateQuery =
      this.#gameDrawCardsUpdateQueryFromGameBuilder.build(game, drawMutation);

    await this._updateGame([gameUpdateQuery], transactionWrapper);

    return {
      draw: drawMutation.cards,
      game: await this._getUpdatedGame(game, transactionWrapper),
      gameBeforeUpdate: game,
      kind: ActiveGameUpdatedEventKind.cardsDraw,
      transactionWrapper,
    };
  }

  #buildDrawMutation(game: ActiveGame): GameDrawMutation {
    const cardsToDraw: number = Math.max(
      MIN_CARDS_TO_DRAW,
      game.state.drawCount,
    );

    return this.#gameDrawService.calculateDrawMutation(
      game.state.deck,
      game.state.discardPile,
      cardsToDraw,
    );
  }
}
