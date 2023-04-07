import { Inject, Injectable } from '@nestjs/common';
import { models as apiModels } from '@one-game-js/api-models';
import { Builder } from '@one-game-js/backend-common';

import {
  UuidProviderOutputPort,
  uuidProviderOutputPortSymbol,
} from '../../../../foundation/common/application/ports/output/UuidProviderOutputPort';
import { Game } from '../../../domain/models/Game';
import { GameCreateQuery } from '../../../domain/query/GameCreateQuery';
import { GameCreateQueryFromGameCreateQueryV1Builder } from '../../builders/GameCreateQueryFromGameCreateQueryV1Builder';
import { GameV1FromGameBuilder } from '../../builders/GameV1FromGameBuilder';
import { GameCreateQueryContext } from '../../models/GameCreateQueryContext';
import {
  GamePersistenceOutputPort,
  gamePersistenceOutputPortSymbol,
} from '../output/GamePersistenceOutputPort';

@Injectable()
export class GameManagementInputPort {
  readonly #gameCreateQueryFromGameCreateQueryV1Builder: Builder<
    GameCreateQuery,
    [apiModels.GameCreateQueryV1, GameCreateQueryContext]
  >;

  readonly #gameV1FromGameBuilder: Builder<apiModels.GameV1, [Game]>;

  readonly #gamePersistenceOutputPort: GamePersistenceOutputPort;

  readonly #uuidProviderOutputPort: UuidProviderOutputPort;

  constructor(
    @Inject(GameCreateQueryFromGameCreateQueryV1Builder)
    gameCreateQueryFromGameCreateQueryV1Builder: Builder<
      GameCreateQuery,
      [apiModels.GameCreateQueryV1, GameCreateQueryContext]
    >,
    @Inject(GameV1FromGameBuilder)
    gameV1FromGameBuilder: Builder<apiModels.GameV1, [Game]>,
    @Inject(gamePersistenceOutputPortSymbol)
    gamePersistenceOutputPort: GamePersistenceOutputPort,
    @Inject(uuidProviderOutputPortSymbol)
    uuidProviderOutputPort: UuidProviderOutputPort,
  ) {
    this.#gameCreateQueryFromGameCreateQueryV1Builder =
      gameCreateQueryFromGameCreateQueryV1Builder;
    this.#gameV1FromGameBuilder = gameV1FromGameBuilder;
    this.#gamePersistenceOutputPort = gamePersistenceOutputPort;
    this.#uuidProviderOutputPort = uuidProviderOutputPort;
  }

  public async create(
    gameCreateQueryV1: apiModels.GameCreateQueryV1,
  ): Promise<apiModels.GameV1> {
    const gameCreateQuery: GameCreateQuery =
      this.#gameCreateQueryFromGameCreateQueryV1Builder.build(
        gameCreateQueryV1,
        this.#createGameCreationQueryContext(gameCreateQueryV1),
      );

    const game: Game = await this.#gamePersistenceOutputPort.create(
      gameCreateQuery,
    );

    return this.#gameV1FromGameBuilder.build(game);
  }

  #createGameCreationQueryContext(
    gameCreateQueryV1: apiModels.GameCreateQueryV1,
  ): GameCreateQueryContext {
    return {
      gameSlotUuids: this.#createUuidArrayOfElements(
        gameCreateQueryV1.gameSlotsAmount,
      ),
      uuid: this.#uuidProviderOutputPort.generateV4(),
    };
  }

  #createUuidArrayOfElements(elements: number): string[] {
    const uuidArray: string[] = new Array<string>(elements);

    for (let i: number = 0; i < elements; ++i) {
      uuidArray[i] = this.#uuidProviderOutputPort.generateV4();
    }

    return uuidArray;
  }
}
