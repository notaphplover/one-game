import { models as apiModels } from '@cornie-js/api-models';
import {
  UuidProviderOutputPort,
  uuidProviderOutputPortSymbol,
} from '@cornie-js/backend-app-uuid';
import {
  AppError,
  AppErrorKind,
  Builder,
  Handler,
  Spec,
} from '@cornie-js/backend-common';
import { TransactionWrapper } from '@cornie-js/backend-db/application';
import { Card } from '@cornie-js/backend-game-domain/cards';
import {
  ActiveGame,
  ActiveGameSlot,
  Game,
  GameCanHoldMoreGameSlotsSpec,
  GameCanHoldOnlyOneMoreGameSlotSpec,
  GameSlotCreateQuery,
  GameSpec,
  GameStatus,
  NonStartedGame,
  NonStartedGameSlot,
} from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';

import { CardV1FromCardBuilder } from '../../../../cards/application/builders/CardV1FromCardBuilder';
import { UuidContext } from '../../../../foundation/common/application/models/UuidContext';
import {
  TransactionProvisionOutputPort,
  transactionProvisionOutputPortSymbol,
} from '../../../../foundation/db/application/ports/output/TransactionProvisionOutputPort';
import { GameSlotCreateQueryFromGameSlotCreateQueryV1Builder } from '../../builders/GameSlotCreateQueryFromGameSlotCreateQueryV1Builder';
import { GameSlotV1FromGameSlotBuilder } from '../../builders/GameSlotV1FromGameSlotBuilder';
import { NonStartedGameFilledEventHandler } from '../../handlers/NonStartedGameFilledEventHandler';
import { GameSlotCreateQueryContext } from '../../models/GameSlotCreateQueryContext';
import { NonStartedGameFilledEvent } from '../../models/NonStartedGameFilledEvent';
import {
  GameSlotPersistenceOutputPort,
  gameSlotPersistenceOutputPortSymbol,
} from '../../ports/output/GameSlotPersistenceOutputPort';
import {
  GameSpecPersistenceOutputPort,
  gameSpecPersistenceOutputPortSymbol,
} from '../../ports/output/GameSpecPersistenceOutputPort';

@Injectable()
export class GameSlotManagementInputPort {
  readonly #cardV1FromCardBuilder: Builder<apiModels.CardV1, [Card]>;
  readonly #gameCanHoldMoreGameSlotsSpec: Spec<[Game, GameSpec]>;
  readonly #gameCanHoldOnlyOneMoreGameSlotSpec: Spec<[Game, GameSpec]>;
  readonly #gameSlotCreateQueryFromGameSlotCreateQueryV1Builder: Builder<
    GameSlotCreateQuery,
    [apiModels.GameIdSlotCreateQueryV1, GameSlotCreateQueryContext]
  >;
  readonly #gameSlotV1FromGameSlotBuilder: Builder<
    apiModels.GameSlotV1,
    [ActiveGameSlot | NonStartedGameSlot]
  >;
  readonly #gameSlotPersistenceOutputPort: GameSlotPersistenceOutputPort;
  readonly #gameSpecPersistenceOutputPort: GameSpecPersistenceOutputPort;
  readonly #nonStartedGameFilledEventHandler: Handler<
    [NonStartedGameFilledEvent, TransactionWrapper],
    void
  >;
  readonly #transactionProvisionOutputPort: TransactionProvisionOutputPort;
  readonly #uuidProviderOutputPort: UuidProviderOutputPort;

  constructor(
    @Inject(CardV1FromCardBuilder)
    cardV1FromCardBuilder: Builder<apiModels.CardV1, [Card]>,
    @Inject(GameCanHoldMoreGameSlotsSpec)
    gameCanHoldMoreGameSlotsSpec: GameCanHoldMoreGameSlotsSpec,
    @Inject(GameCanHoldOnlyOneMoreGameSlotSpec)
    gameCanHoldOnlyOneMoreGameSlotSpec: Spec<[Game, GameSpec]>,
    @Inject(GameSlotCreateQueryFromGameSlotCreateQueryV1Builder)
    gameSlotCreateQueryFromGameSlotCreateQueryV1Builder: Builder<
      GameSlotCreateQuery,
      [apiModels.GameIdSlotCreateQueryV1, UuidContext]
    >,
    @Inject(GameSlotV1FromGameSlotBuilder)
    gameSlotV1FromGameSlotBuilder: Builder<
      apiModels.GameSlotV1,
      [ActiveGameSlot | NonStartedGameSlot]
    >,
    @Inject(gameSlotPersistenceOutputPortSymbol)
    gameSlotPersistenceOutputPort: GameSlotPersistenceOutputPort,
    @Inject(gameSpecPersistenceOutputPortSymbol)
    gameSpecPersistenceOutputPort: GameSpecPersistenceOutputPort,
    @Inject(NonStartedGameFilledEventHandler)
    nonStartedGameFilledEventHandler: Handler<
      [NonStartedGameFilledEvent],
      void
    >,
    @Inject(transactionProvisionOutputPortSymbol)
    transactionProvisionOutputPort: TransactionProvisionOutputPort,
    @Inject(uuidProviderOutputPortSymbol)
    uuidProviderOutputPort: UuidProviderOutputPort,
  ) {
    this.#cardV1FromCardBuilder = cardV1FromCardBuilder;
    this.#gameCanHoldMoreGameSlotsSpec = gameCanHoldMoreGameSlotsSpec;
    this.#gameCanHoldOnlyOneMoreGameSlotSpec =
      gameCanHoldOnlyOneMoreGameSlotSpec;
    this.#gameSlotCreateQueryFromGameSlotCreateQueryV1Builder =
      gameSlotCreateQueryFromGameSlotCreateQueryV1Builder;
    this.#gameSlotV1FromGameSlotBuilder = gameSlotV1FromGameSlotBuilder;
    this.#gameSlotPersistenceOutputPort = gameSlotPersistenceOutputPort;
    this.#gameSpecPersistenceOutputPort = gameSpecPersistenceOutputPort;
    this.#nonStartedGameFilledEventHandler = nonStartedGameFilledEventHandler;
    this.#transactionProvisionOutputPort = transactionProvisionOutputPort;
    this.#uuidProviderOutputPort = uuidProviderOutputPort;
  }

  public async create(
    gameSlotCreateQueryV1: apiModels.GameIdSlotCreateQueryV1,
    game: Game,
  ): Promise<apiModels.GameSlotV1> {
    const gameSpec: GameSpec = await this.#getGameSpecOrFail(game.id);

    if (!this.#gameCanHoldMoreGameSlotsSpec.isSatisfiedBy(game, gameSpec)) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        `Unable to process request: game "${game.id}" cannot hold more game slots`,
      );
    }

    const gameSlotCreateQuery: GameSlotCreateQuery =
      this.#gameSlotCreateQueryFromGameSlotCreateQueryV1Builder.build(
        gameSlotCreateQueryV1,
        this.#createGameSlotCreationQueryContext(game),
      );

    await using transactionWrapper: TransactionWrapper =
      await this.#transactionProvisionOutputPort.provide();

    const gameSlot: ActiveGameSlot | NonStartedGameSlot =
      await this.#gameSlotPersistenceOutputPort.create(
        gameSlotCreateQuery,
        transactionWrapper,
      );

    await this.#handleNonStartedGameFilledEvent(
      game,
      gameSpec,
      transactionWrapper,
    );

    await transactionWrapper.tryCommit();

    return this.#gameSlotV1FromGameSlotBuilder.build(gameSlot);
  }

  public getSlotCards(
    game: Game,
    slotIndex: number,
  ): apiModels.ActiveGameSlotCardsV1 {
    if (!this.#isActiveGame(game)) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        'Unable to fetch cards from a non active game slot',
      );
    }

    const gameSlot: ActiveGameSlot = this.#getGameSlotOrThrow(game, slotIndex);

    return gameSlot.cards.map((card: Card) =>
      this.#cardV1FromCardBuilder.build(card),
    );
  }

  public isSlotOwner(game: Game, slotIndex: number, userId: string): boolean {
    return this.#getGameSlotOrThrow(game, slotIndex).userId === userId;
  }

  #createGameSlotCreationQueryContext(game: Game): GameSlotCreateQueryContext {
    return {
      game,
      uuid: this.#uuidProviderOutputPort.generateV4(),
    };
  }

  #getGameSlotOrThrow(game: ActiveGame, slotIndex: number): ActiveGameSlot;
  #getGameSlotOrThrow(
    game: NonStartedGame,
    slotIndex: number,
  ): NonStartedGameSlot;
  #getGameSlotOrThrow(
    game: Game,
    slotIndex: number,
  ): ActiveGameSlot | NonStartedGameSlot;
  #getGameSlotOrThrow(
    game: Game,
    slotIndex: number,
  ): ActiveGameSlot | NonStartedGameSlot {
    const gameSlot: ActiveGameSlot | NonStartedGameSlot | undefined =
      game.state.slots[slotIndex];

    if (gameSlot === undefined) {
      throw new AppError(
        AppErrorKind.entityNotFound,
        `Game slot at position "${slotIndex.toString()}" not found for game "${game.id}"`,
      );
    }

    return gameSlot;
  }

  async #getGameSpecOrFail(gameId: string): Promise<GameSpec> {
    const gameSpec: GameSpec | undefined =
      await this.#gameSpecPersistenceOutputPort.findOne({ gameIds: [gameId] });

    if (gameSpec === undefined) {
      throw new AppError(
        AppErrorKind.unknown,
        `No game spec was found for game "${gameId}"`,
      );
    }

    return gameSpec;
  }

  async #handleNonStartedGameFilledEvent(
    gameBeforeSlotCreation: Game,
    gameSpec: GameSpec,
    transactionWrapper: TransactionWrapper,
  ): Promise<void> {
    if (
      this.#gameCanHoldOnlyOneMoreGameSlotSpec.isSatisfiedBy(
        gameBeforeSlotCreation,
        gameSpec,
      )
    ) {
      /*
       * We must be the ones who filled the game. Otherwise an Error due to the invalid insertion
       * operation would have been thrown.
       */
      const nonStartedGameFilledEvent: NonStartedGameFilledEvent = {
        gameId: gameBeforeSlotCreation.id,
      };

      await this.#nonStartedGameFilledEventHandler.handle(
        nonStartedGameFilledEvent,
        transactionWrapper,
      );
    }
  }

  #isActiveGame(game: Game): game is ActiveGame {
    return game.state.status === GameStatus.active;
  }
}
