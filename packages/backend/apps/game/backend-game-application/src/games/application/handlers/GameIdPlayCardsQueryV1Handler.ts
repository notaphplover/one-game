import { models as apiModels } from '@cornie-js/api-models';
import {
  AppError,
  AppErrorKind,
  Builder,
  Handler,
} from '@cornie-js/backend-common';
import { TransactionWrapper } from '@cornie-js/backend-db/application';
import { Card, CardColor } from '@cornie-js/backend-game-domain/cards';
import {
  ActiveGame,
  CardsFromCurrentSlotOfActiveGameBuilder,
  CurrentPlayerCanPlayCardsSpec,
  GameCardsEffectUpdateQueryFromGameBuilder,
  GamePlayCardsUpdateQueryFromGameBuilder,
  GameSpec,
  GameUpdateQuery,
  PlayerCanUpdateGameSpec,
} from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';

import { CardColorFromCardColorV1Builder } from '../../../cards/application/builders/CardColorFromCardColorV1Builder';
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
export class GameIdPlayCardsQueryV1Handler extends GameIdUpdateQueryV1Handler<apiModels.GameIdPlayCardsQueryV1> {
  readonly #cardColorFromCardColorV1Builder: Builder<
    CardColor,
    [apiModels.CardColorV1]
  >;
  readonly #cardsFromCurrentSlotOfActiveGameBuilder: Builder<
    Card[],
    [ActiveGame, number[]]
  >;
  readonly #currentPlayerCanPlayCardsSpec: CurrentPlayerCanPlayCardsSpec;
  readonly #gameCardsEffectUpdateQueryFromGameBuilder: Builder<
    GameUpdateQuery,
    [ActiveGame, Card, number, CardColor | undefined]
  >;
  readonly #gamePlayCardsUpdateQueryFromGameBuilder: Builder<
    GameUpdateQuery,
    [ActiveGame, number[], number]
  >;

  constructor(
    @Inject(GameCardsEffectUpdateQueryFromGameBuilder)
    gameCardsEffectUpdateQueryFromGameBuilder: Builder<
      GameUpdateQuery,
      [ActiveGame, Card, number, CardColor | undefined]
    >,
    @Inject(gameSpecPersistenceOutputPortSymbol)
    gameSpecPersistenceOutputPort: GameSpecPersistenceOutputPort,
    @Inject(gamePersistenceOutputPortSymbol)
    gamePersistenceOutputPort: GamePersistenceOutputPort,
    @Inject(GamePlayCardsUpdateQueryFromGameBuilder)
    gamePlayCardsUpdateQueryFromGameBuilder: Builder<
      GameUpdateQuery,
      [ActiveGame, number[], number]
    >,
    @Inject(GameUpdatedEventHandler)
    gameUpdatedEventHandler: Handler<[ActiveGameUpdatedEvent], void>,
    @Inject(PlayerCanUpdateGameSpec)
    playerCanUpdateGameSpec: PlayerCanUpdateGameSpec,
    @Inject(CardColorFromCardColorV1Builder)
    cardColorFromCardColorV1Builder: Builder<
      CardColor,
      [apiModels.CardColorV1]
    >,
    @Inject(CardsFromCurrentSlotOfActiveGameBuilder)
    cardsFromCurrentSlotOfActiveGameBuilder: Builder<
      Card[],
      [ActiveGame, number[]]
    >,
    @Inject(CurrentPlayerCanPlayCardsSpec)
    currentPlayerCanPlayCardsSpec: CurrentPlayerCanPlayCardsSpec,
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

    this.#cardColorFromCardColorV1Builder = cardColorFromCardColorV1Builder;
    this.#cardsFromCurrentSlotOfActiveGameBuilder =
      cardsFromCurrentSlotOfActiveGameBuilder;
    this.#currentPlayerCanPlayCardsSpec = currentPlayerCanPlayCardsSpec;
    this.#gameCardsEffectUpdateQueryFromGameBuilder =
      gameCardsEffectUpdateQueryFromGameBuilder;
    this.#gamePlayCardsUpdateQueryFromGameBuilder =
      gamePlayCardsUpdateQueryFromGameBuilder;
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

  protected override async _handleUpdateGame(
    game: ActiveGame,
    gameSpec: GameSpec,
    gameIdUpdateQueryV1: apiModels.GameIdPlayCardsQueryV1,
    transactionWrapper: TransactionWrapper,
  ): Promise<ActiveGameUpdatedEvent> {
    await this._updateGame(
      this.#buildUpdateQueries(game, gameSpec, gameIdUpdateQueryV1),
      transactionWrapper,
    );

    const cards: Card[] = this.#cardsFromCurrentSlotOfActiveGameBuilder.build(
      game,
      gameIdUpdateQueryV1.cardIndexes,
    );

    return {
      cards,
      game: await this._getUpdatedGame(game, transactionWrapper),
      gameBeforeUpdate: game,
      kind: ActiveGameUpdatedEventKind.cardsPlay,
      transactionWrapper,
    };
  }

  #buildUpdateQueries(
    game: ActiveGame,
    gameSpec: GameSpec,
    gameIdUpdateQueryV1: apiModels.GameIdPlayCardsQueryV1,
  ): GameUpdateQuery[] {
    const cardColor: CardColor | undefined = this.#getColorOrUndefined(
      gameIdUpdateQueryV1.colorChoice,
    );

    const gamePlayCardsUpdatequery: GameUpdateQuery =
      this.#gamePlayCardsUpdateQueryFromGameBuilder.build(
        game,
        gameIdUpdateQueryV1.cardIndexes,
        gameIdUpdateQueryV1.slotIndex,
      );

    const card: Card | undefined = gamePlayCardsUpdatequery.currentCard;

    if (card === undefined) {
      throw new AppError(
        AppErrorKind.unknown,
        'Unexpected missing card when attempting to play cards',
      );
    }

    const gameCardsEffectUpdateQuery: GameUpdateQuery =
      this.#gameCardsEffectUpdateQueryFromGameBuilder.build(
        game,
        card,
        gameSpec.gameSlotsAmount,
        cardColor,
      );

    return [gamePlayCardsUpdatequery, gameCardsEffectUpdateQuery];
  }

  #getColorOrUndefined(
    cardColorV1: apiModels.CardColorV1 | undefined,
  ): CardColor | undefined {
    return cardColorV1 === undefined
      ? undefined
      : this.#cardColorFromCardColorV1Builder.build(cardColorV1);
  }
}
