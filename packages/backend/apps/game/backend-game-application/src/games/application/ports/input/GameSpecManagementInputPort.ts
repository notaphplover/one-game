import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { GameSpec } from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';

import { GameSpecV1FromGameSpecBuilder } from '../../builders/GameSpecV1FromGameSpecBuilder';
import {
  GameSpecPersistenceOutputPort,
  gameSpecPersistenceOutputPortSymbol,
} from '../../ports/output/GameSpecPersistenceOutputPort';

@Injectable()
export class GameSpecManagementInputPort {
  readonly #gameSpecPersistenceOutputPort: GameSpecPersistenceOutputPort;
  readonly #gameSpecV1FromGameSpecBuilder: Builder<
    apiModels.GameSpecV1,
    [GameSpec]
  >;

  constructor(
    @Inject(gameSpecPersistenceOutputPortSymbol)
    gameSpecPersistenceOutputPort: GameSpecPersistenceOutputPort,
    @Inject(GameSpecV1FromGameSpecBuilder)
    gameSpecV1FromGameSpecBuilder: Builder<apiModels.GameSpecV1, [GameSpec]>,
  ) {
    this.#gameSpecPersistenceOutputPort = gameSpecPersistenceOutputPort;
    this.#gameSpecV1FromGameSpecBuilder = gameSpecV1FromGameSpecBuilder;
  }

  public async findOne(
    gameId: string,
  ): Promise<apiModels.GameSpecV1 | undefined> {
    const game: GameSpec | undefined =
      await this.#gameSpecPersistenceOutputPort.findOne({
        gameId,
      });

    if (game === undefined) {
      return undefined;
    } else {
      return this.#gameSpecV1FromGameSpecBuilder.build(game);
    }
  }
}
