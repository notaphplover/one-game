import { Inject, Injectable } from '@nestjs/common';
import { models as apiModels } from '@one-game-js/api-models';
import { AppError, AppErrorKind, Builder } from '@one-game-js/backend-common';

import { CardV1FromCardBuilder } from '../../../../cards/application/builders/CardV1FromCardBuilder';
import { Card } from '../../../../cards/domain/models/Card';
import { UuidContext } from '../../../../foundation/common/application/models/UuidContext';
import {
  UuidProviderOutputPort,
  uuidProviderOutputPortSymbol,
} from '../../../../foundation/common/application/ports/output/UuidProviderOutputPort';
import { ActiveGame } from '../../../domain/models/ActiveGame';
import { ActiveGameSlot } from '../../../domain/models/ActiveGameSlot';
import { Game } from '../../../domain/models/Game';
import { NonStartedGame } from '../../../domain/models/NonStartedGame';
import { NonStartedGameSlot } from '../../../domain/models/NonStartedGameSlot';
import { GameSlotCreateQuery } from '../../../domain/query/GameSlotCreateQuery';
import { GameCanHoldMoreGameSlotsSpec } from '../../../domain/specs/GameCanHoldMoreGameSlotsSpec';
import { GameSlotCreateQueryFromGameSlotCreateQueryV1Builder } from '../../builders/GameSlotCreateQueryFromGameSlotCreateQueryV1Builder';
import { GameSlotV1FromGameSlotBuilder } from '../../builders/GameSlotV1FromGameSlotBuilder';
import { GameSlotCreateQueryContext } from '../../models/GameSlotCreateQueryContext';
import {
  GameSlotPersistenceOutputPort,
  gameSlotPersistenceOutputPortSymbol,
} from '../output/GameSlotPersistenceOutputPort';

@Injectable()
export class GameSlotManagementInputPort {
  readonly #cardV1FromCardBuilder: Builder<apiModels.CardV1, [Card]>;
  readonly #gameCanHoldMoreGameSlotsSpec: GameCanHoldMoreGameSlotsSpec;
  readonly #gameSlotCreateQueryFromGameSlotCreateQueryV1Builder: Builder<
    GameSlotCreateQuery,
    [apiModels.GameIdSlotCreateQueryV1, GameSlotCreateQueryContext]
  >;
  readonly #gameSlotV1FromGameSlotBuilder: Builder<
    apiModels.GameSlotV1,
    [ActiveGameSlot | NonStartedGameSlot]
  >;
  readonly #gameSlotPersistenceOutputPort: GameSlotPersistenceOutputPort;
  readonly #uuidProviderOutputPort: UuidProviderOutputPort;

  constructor(
    @Inject(CardV1FromCardBuilder)
    cardV1FromCardBuilder: Builder<apiModels.CardV1, [Card]>,
    @Inject(GameCanHoldMoreGameSlotsSpec)
    gameCanHoldMoreGameSlotsSpec: GameCanHoldMoreGameSlotsSpec,
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
    @Inject(uuidProviderOutputPortSymbol)
    uuidProviderOutputPort: UuidProviderOutputPort,
  ) {
    this.#cardV1FromCardBuilder = cardV1FromCardBuilder;
    this.#gameCanHoldMoreGameSlotsSpec = gameCanHoldMoreGameSlotsSpec;
    this.#gameSlotCreateQueryFromGameSlotCreateQueryV1Builder =
      gameSlotCreateQueryFromGameSlotCreateQueryV1Builder;
    this.#gameSlotV1FromGameSlotBuilder = gameSlotV1FromGameSlotBuilder;
    this.#gameSlotPersistenceOutputPort = gameSlotPersistenceOutputPort;
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

    return this.#gameSlotV1FromGameSlotBuilder.build(gameSlot);
  }

  public getSlotCards(
    game: Game,
    slotIndex: number,
  ): apiModels.ActiveGameSlotCardsV1 {
    if (!game.active) {
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
      game.slots[slotIndex];

    if (gameSlot === undefined) {
      throw new AppError(
        AppErrorKind.entityNotFound,
        `Game slot at position "${slotIndex}" not found for game "${game.id}"`,
      );
    }

    return gameSlot;
  }
}
