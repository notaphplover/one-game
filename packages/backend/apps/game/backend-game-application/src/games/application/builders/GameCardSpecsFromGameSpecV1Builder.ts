import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { GameCardSpec } from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';

import { GameCardSpecFromGameCardSpecV1Builder } from './GameCardSpecFromGameCardSpecV1Builder';

@Injectable()
export class GameCardSpecsFromGameSpecV1Builder
  implements Builder<GameCardSpec[], [apiModels.GameSpecV1]>
{
  readonly #gameCardSpecFromGameCardSpecV1Builder: Builder<
    GameCardSpec,
    [apiModels.GameCardSpecV1]
  >;

  constructor(
    @Inject(GameCardSpecFromGameCardSpecV1Builder)
    gameCardSpecFromGameCardSpecV1Builder: Builder<
      GameCardSpec,
      [apiModels.GameCardSpecV1]
    >,
  ) {
    this.#gameCardSpecFromGameCardSpecV1Builder =
      gameCardSpecFromGameCardSpecV1Builder;
  }

  public build(gameSpecV1: apiModels.GameSpecV1): GameCardSpec[] {
    return gameSpecV1.cardSpecs.map(
      (gameCardSpecV1: apiModels.GameCardSpecV1): GameCardSpec =>
        this.#gameCardSpecFromGameCardSpecV1Builder.build(gameCardSpecV1),
    );
  }
}
