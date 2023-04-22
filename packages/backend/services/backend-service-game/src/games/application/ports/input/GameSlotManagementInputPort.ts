import { Inject, Injectable } from '@nestjs/common';
import { models as apiModels } from '@one-game-js/api-models';
import { AppError, AppErrorKind, Builder } from '@one-game-js/backend-common';

import { UuidContext } from '../../../../foundation/common/application/models/UuidContext';
import {
  UuidProviderOutputPort,
  uuidProviderOutputPortSymbol,
} from '../../../../foundation/common/application/ports/output/UuidProviderOutputPort';
import { ActiveGameSlot } from '../../../domain/models/ActiveGameSlot';
import { Game } from '../../../domain/models/Game';
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

  #createGameSlotCreationQueryContext(game: Game): GameSlotCreateQueryContext {
    return {
      game,
      uuid: this.#uuidProviderOutputPort.generateV4(),
    };
  }
}
