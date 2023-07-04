import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { GameCardSpec, GameSpec } from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';

import { GameCardSpecV1FromGameCardSpecBuilder } from './GameCardSpecV1FromGameCardSpecBuilder';

@Injectable()
export class GameSpecV1FromGameSpecBuilder
  implements Builder<apiModels.GameSpecV1, [GameSpec]>
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

  public build(gameSpec: GameSpec): apiModels.GameSpecV1 {
    return {
      cardSpecs: gameSpec.cards.map((gameCardSpec: GameCardSpec) =>
        this.#gameCardSpecV1FromGameCardSpecBuilder.build(gameCardSpec),
      ),
      gameSlotsAmount: gameSpec.gameSlotsAmount,
    };
  }
}
