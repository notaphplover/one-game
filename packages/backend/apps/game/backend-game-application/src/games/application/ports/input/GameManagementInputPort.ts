import { models as apiModels } from '@cornie-js/api-models';
import {
  UuidProviderOutputPort,
  uuidProviderOutputPortSymbol,
} from '@cornie-js/backend-app-uuid';
import { Builder } from '@cornie-js/backend-common';
import {
  Game,
  GameCreateQuery,
  GameFindQuery,
} from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';

import { GameCreateQueryFromGameCreateQueryV1Builder } from '../../builders/GameCreateQueryFromGameCreateQueryV1Builder';
import { GameV1FromGameBuilder } from '../../builders/GameV1FromGameBuilder';
import { GameCreateQueryContext } from '../../models/GameCreateQueryContext';
import {
  GamePersistenceOutputPort,
  gamePersistenceOutputPortSymbol,
} from '../../ports/output/GamePersistenceOutputPort';

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

  #createGameCreationQueryContext(): GameCreateQueryContext {
    return {
      gameOptionsId: this.#uuidProviderOutputPort.generateV4(),
      uuid: this.#uuidProviderOutputPort.generateV4(),
    };
  }
}
