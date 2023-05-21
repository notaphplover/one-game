import { models as apiModels } from '@cornie-js/api-models';
import { GameCardSpec } from '@cornie-js/backend-app-game-models/games/domain';
import { Builder } from '@cornie-js/backend-common';
import { Inject, Injectable } from '@nestjs/common';

import { GameCardSpecV1FromGameCardSpecBuilder } from './GameCardSpecV1FromGameCardSpecBuilder';

@Injectable()
export class GameSpecV1FromGameCardSpecsBuilder
  implements Builder<apiModels.GameSpecV1, [GameCardSpec[]]>
{
  readonly #gameCardSpecV1FromGameCardSpecBuilder: Builder<
    apiModels.GameCardSpecV1,
    [GameCardSpec]
  >;

  constructor(
    @Inject(GameCardSpecV1FromGameCardSpecBuilder)
    gameCardSpecV1FromGameCardSpecBuilder: Builder<
      apiModels.GameCardSpecV1,
      [GameCardSpec]
    >,
  ) {
    this.#gameCardSpecV1FromGameCardSpecBuilder =
      gameCardSpecV1FromGameCardSpecBuilder;
  }

  public build(gameCardSpecs: GameCardSpec[]): apiModels.GameSpecV1 {
    return {
      cardSpecs: gameCardSpecs.map((gameCardSpec: GameCardSpec) =>
        this.#gameCardSpecV1FromGameCardSpecBuilder.build(gameCardSpec),
      ),
    };
  }
}
