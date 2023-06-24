import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import {
  GameOptions,
  GameOptionsFindQuery,
} from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';

import { GameOptionsV1FromGameOptionsBuilder } from '../../builders/GameOptionsV1FromGameOptionsBuilder';
import {
  GameOptionsPersistenceOutputPort,
  gameOptionsPersistenceOutputPortSymbol,
} from '../../ports/output/GameOptionsPersistenceOutputPort';

@Injectable()
export class GameOptionsManagementInputPort {
  readonly #gameOptionsPersistenceOutputPort: GameOptionsPersistenceOutputPort;
  readonly #gameOptionsV1FromGameOptionsBuilder: Builder<
    apiModels.GameOptionsV1,
    [GameOptions]
  >;

  constructor(
    @Inject(gameOptionsPersistenceOutputPortSymbol)
    gameOptionsPersistenceOutputPort: GameOptionsPersistenceOutputPort,
    @Inject(GameOptionsV1FromGameOptionsBuilder)
    gameOptionsV1FromGameOptionsBuilder: Builder<
      apiModels.GameOptionsV1,
      [GameOptions]
    >,
  ) {
    this.#gameOptionsV1FromGameOptionsBuilder =
      gameOptionsV1FromGameOptionsBuilder;
    this.#gameOptionsPersistenceOutputPort = gameOptionsPersistenceOutputPort;
  }

  public async findOne(
    gameOptionsFindQuery: GameOptionsFindQuery,
  ): Promise<apiModels.GameOptionsV1 | undefined> {
    const gameOptions: GameOptions | undefined =
      await this.#gameOptionsPersistenceOutputPort.findOne(
        gameOptionsFindQuery,
      );

    if (gameOptions === undefined) {
      return undefined;
    }

    return this.#gameOptionsV1FromGameOptionsBuilder.build(gameOptions);
  }
}
