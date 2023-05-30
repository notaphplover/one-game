import { models as apiModels } from '@cornie-js/api-models';
import { Card } from '@cornie-js/backend-app-game-models/cards/domain';
import {
  GameSlotPersistenceOutputPort,
  gameSlotPersistenceOutputPortSymbol,
} from '@cornie-js/backend-app-game-models/games/application';
import {
  ActiveGame,
  ActiveGameSlot,
  Game,
  GameSlotCreateQuery,
  NonStartedGame,
  NonStartedGameSlot,
} from '@cornie-js/backend-app-game-models/games/domain';
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
import { Inject, Injectable } from '@nestjs/common';

import { CardV1FromCardBuilder } from '../../../../cards/application/builders/CardV1FromCardBuilder';
import { UuidContext } from '../../../../foundation/common/application/models/UuidContext';
import { NonStartedGameFilledEvent } from '../../../domain/events/NonStartedGameFilledEvent';
import { GameCanHoldMoreGameSlotsSpec } from '../../../domain/specs/GameCanHoldMoreGameSlotsSpec';
import { GameCanHoldOnlyOneMoreGameSlotSpec } from '../../../domain/specs/GameCanHoldOnlyOneMoreGameSlotSpec';
import { GameSlotCreateQueryFromGameSlotCreateQueryV1Builder } from '../../builders/GameSlotCreateQueryFromGameSlotCreateQueryV1Builder';
import { GameSlotV1FromGameSlotBuilder } from '../../builders/GameSlotV1FromGameSlotBuilder';
import { NonStartedGameFilledEventHandler } from '../../handlers/NonStartedGameFilledEventHandler';
import { GameSlotCreateQueryContext } from '../../models/GameSlotCreateQueryContext';

@Injectable()
export class GameSlotManagementInputPort {
  readonly #cardV1FromCardBuilder: Builder<apiModels.CardV1, [Card]>;
  readonly #gameCanHoldMoreGameSlotsSpec: Spec<[Game]>;
  readonly #gameCanHoldOnlyOneMoreGameSlotSpec: Spec<[Game]>;
  readonly #gameSlotCreateQueryFromGameSlotCreateQueryV1Builder: Builder<
    GameSlotCreateQuery,
    [apiModels.GameIdSlotCreateQueryV1, GameSlotCreateQueryContext]
  >;
  readonly #gameSlotV1FromGameSlotBuilder: Builder<
    apiModels.GameSlotV1,
    [ActiveGameSlot | NonStartedGameSlot]
  >;
  readonly #gameSlotPersistenceOutputPort: GameSlotPersistenceOutputPort;
  readonly #nonStartedGameFilledEventHandler: Handler<
    [NonStartedGameFilledEvent],
    void
  >;
  readonly #uuidProviderOutputPort: UuidProviderOutputPort;

  constructor(
    @Inject(CardV1FromCardBuilder)
    cardV1FromCardBuilder: Builder<apiModels.CardV1, [Card]>,
    @Inject(GameCanHoldMoreGameSlotsSpec)
    gameCanHoldMoreGameSlotsSpec: GameCanHoldMoreGameSlotsSpec,
    @Inject(GameCanHoldOnlyOneMoreGameSlotSpec)
    gameCanHoldOnlyOneMoreGameSlotSpec: Spec<[Game]>,
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
    @Inject(NonStartedGameFilledEventHandler)
    nonStartedGameFilledEventHandler: Handler<
      [NonStartedGameFilledEvent],
      void
    >,
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
    this.#nonStartedGameFilledEventHandler = nonStartedGameFilledEventHandler;
    this.#uuidProviderOutputPort = uuidProviderOutputPort;
  }

  public async create(
    gameSlotCreateQueryV1: apiModels.GameIdSlotCreateQueryV1,
    game: Game,
  ): Promise<apiModels.GameSlotV1> {
    if (!this.#gameCanHoldMoreGameSlotsSpec.isSatisfiedBy(game)) {
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

    const gameSlot: ActiveGameSlot | NonStartedGameSlot =
      await this.#gameSlotPersistenceOutputPort.create(gameSlotCreateQuery);

    await this.#handleNonStartedGameFilledEvent(game);

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
        `Game slot at position "${slotIndex}" not found for game "${game.id}"`,
      );
    }

    return gameSlot;
  }

  async #handleNonStartedGameFilledEvent(
    gameBeforeSlotCreation: Game,
  ): Promise<void> {
    if (
      this.#gameCanHoldOnlyOneMoreGameSlotSpec.isSatisfiedBy(
        gameBeforeSlotCreation,
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
      );
    }
  }

  #isActiveGame(game: Game): game is ActiveGame {
    return game.state.active;
  }
}
