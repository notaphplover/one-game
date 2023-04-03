import { Inject, Injectable } from '@nestjs/common';
import { models as apiModels } from '@one-game-js/api-models';
import { Builder } from '@one-game-js/backend-common';

import { GameCardSpecFromGameCardSpecV1Builder } from '../../../cards/application/converters/GameCardSpecFromGameCardSpecV1Builder';
import { GameCardSpec } from '../../domain/models/GameCardSpec';

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
