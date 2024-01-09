import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import {
  GameSpec,
  GameSpecFindQuery,
} from '@cornie-js/backend-game-domain/games';
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

  public async find(
    gameSpecFindQuery: GameSpecFindQuery,
  ): Promise<apiModels.GameSpecV1[]> {
    const gameSpecs: GameSpec[] =
      await this.#gameSpecPersistenceOutputPort.find(gameSpecFindQuery);

    return gameSpecs.map((gameSpec: GameSpec) =>
      this.#gameSpecV1FromGameSpecBuilder.build(gameSpec),
    );
  }

  public async findOne(
    gameSpecFindQuery: GameSpecFindQuery,
  ): Promise<apiModels.GameSpecV1 | undefined> {
    const gameSpecs: GameSpec | undefined =
      await this.#gameSpecPersistenceOutputPort.findOne(gameSpecFindQuery);

    if (gameSpecs === undefined) {
      return undefined;
    } else {
      return this.#gameSpecV1FromGameSpecBuilder.build(gameSpecs);
    }
  }
}
