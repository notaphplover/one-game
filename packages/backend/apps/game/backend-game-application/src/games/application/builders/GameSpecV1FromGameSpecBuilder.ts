import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import {
  GameCardSpec,
  GameOptions,
  GameSpec,
} from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';

import { GameCardSpecV1FromGameCardSpecBuilder } from './GameCardSpecV1FromGameCardSpecBuilder';
import { GameOptionsV1FromGameOptionsBuilder } from './GameOptionsV1FromGameOptionsBuilder';

@Injectable()
export class GameSpecV1FromGameSpecBuilder
  implements Builder<apiModels.GameSpecV1, [GameSpec]>
{
  readonly #gameCardSpecV1FromGameCardSpecBuilder: Builder<
    apiModels.GameCardSpecV1,
    [GameCardSpec]
  >;

  readonly #gameOptionsV1FromGameOptionsBuilder: Builder<
    apiModels.GameOptionsV1,
    [GameOptions]
  >;

  constructor(
    @Inject(GameCardSpecV1FromGameCardSpecBuilder)
    gameCardSpecV1FromGameCardSpecBuilder: Builder<
      apiModels.GameCardSpecV1,
      [GameCardSpec]
    >,
    @Inject(GameOptionsV1FromGameOptionsBuilder)
    gameOptionsV1FromGameOptionsBuilder: Builder<
      apiModels.GameOptionsV1,
      [GameOptions]
    >,
  ) {
    this.#gameCardSpecV1FromGameCardSpecBuilder =
      gameCardSpecV1FromGameCardSpecBuilder;
    this.#gameOptionsV1FromGameOptionsBuilder =
      gameOptionsV1FromGameOptionsBuilder;
  }

  public build(gameSpec: GameSpec): apiModels.GameSpecV1 {
    return {
      cardSpecs: gameSpec.cards.map((gameCardSpec: GameCardSpec) =>
        this.#gameCardSpecV1FromGameCardSpecBuilder.build(gameCardSpec),
      ),
      gameSlotsAmount: gameSpec.gameSlotsAmount,
      options: this.#gameOptionsV1FromGameOptionsBuilder.build(
        gameSpec.options,
      ),
    };
  }
}
