import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { Inject, Injectable } from '@nestjs/common';

import { UuidContext } from '../../../foundation/common/application/models/UuidContext';
import { GameCardSpec } from '../../domain/models/GameCardSpec';
import { GameCreateQuery } from '../../domain/query/GameCreateQuery';
import { GameCardSpecsFromGameSpecV1Builder } from './GameCardSpecsFromGameSpecV1Builder';

@Injectable()
export class GameCreateQueryFromGameCreateQueryV1Builder
  implements
    Builder<GameCreateQuery, [apiModels.GameCreateQueryV1, UuidContext]>
{
  readonly #gameCardSpecsFromGameSpecV1Builder: Builder<
    GameCardSpec[],
    [apiModels.GameSpecV1]
  >;

  constructor(
    @Inject(GameCardSpecsFromGameSpecV1Builder)
    gameCardSpecsFromGameSpecV1Builder: Builder<
      GameCardSpec[],
      [apiModels.GameSpecV1]
    >,
  ) {
    this.#gameCardSpecsFromGameSpecV1Builder =
      gameCardSpecsFromGameSpecV1Builder;
  }

  public build(
    gameCreateQueryV1: apiModels.GameCreateQueryV1,
    context: UuidContext,
  ): GameCreateQuery {
    return {
      gameSlotsAmount: gameCreateQueryV1.gameSlotsAmount,
      id: context.uuid,
      spec: this.#gameCardSpecsFromGameSpecV1Builder.build(
        gameCreateQueryV1.gameSpec,
      ),
    };
  }
}
