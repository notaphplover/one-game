import { models as apiModels } from '@cornie-js/api-models';
import {
  GamePersistenceOutputPort,
  gamePersistenceOutputPortSymbol,
} from '@cornie-js/backend-app-game-models/games/application';
import {
  Game,
  GameCreateQuery,
  GameFindQuery,
} from '@cornie-js/backend-app-game-models/games/domain';
import {
  UuidProviderOutputPort,
  uuidProviderOutputPortSymbol,
} from '@cornie-js/backend-app-uuid';
import { Builder } from '@cornie-js/backend-common';
import { Inject, Injectable } from '@nestjs/common';

import { UuidContext } from '../../../../foundation/common/application/models/UuidContext';
import { GameCreateQueryFromGameCreateQueryV1Builder } from '../../builders/GameCreateQueryFromGameCreateQueryV1Builder';
import { GameV1FromGameBuilder } from '../../builders/GameV1FromGameBuilder';

@Injectable()
export class GameManagementInputPort {
  readonly #gameCreateQueryFromGameCreateQueryV1Builder: Builder<
    GameCreateQuery,
    [apiModels.GameCreateQueryV1, UuidContext]
  >;

  readonly #gameV1FromGameBuilder: Builder<apiModels.GameV1, [Game]>;

  readonly #gamePersistenceOutputPort: GamePersistenceOutputPort;

  readonly #uuidProviderOutputPort: UuidProviderOutputPort;

  constructor(
    @Inject(GameCreateQueryFromGameCreateQueryV1Builder)
    gameCreateQueryFromGameCreateQueryV1Builder: Builder<
      GameCreateQuery,
      [apiModels.GameCreateQueryV1, UuidContext]
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
        this.#createGameCreationQueryContext(),
      );

    const game: Game = await this.#gamePersistenceOutputPort.create(
      gameCreateQuery,
    );

    return this.#gameV1FromGameBuilder.build(game);
  }

  public async findOne(id: string): Promise<apiModels.GameV1 | undefined> {
    const gameFindQuery: GameFindQuery = {
      id,
    };

    const game: Game | undefined =
      await this.#gamePersistenceOutputPort.findOne(gameFindQuery);

    if (game === undefined) {
      return undefined;
    } else {
      return this.#gameV1FromGameBuilder.build(game);
    }
  }

  #createGameCreationQueryContext(): UuidContext {
    return {
      uuid: this.#uuidProviderOutputPort.generateV4(),
    };
  }
}
