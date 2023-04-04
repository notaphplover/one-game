import { Inject, Injectable } from '@nestjs/common';
import { models as apiModels } from '@one-game-js/api-models';
import { AppError, AppErrorKind, Builder } from '@one-game-js/backend-common';

import { GameCardSpec } from '../../domain/models/GameCardSpec';
import { GameCreateQuery } from '../../domain/query/GameCreateQuery';
import { GameCreateQueryContext } from '../models/GameCreateQueryContext';
import { GameCardSpecsFromGameSpecV1Builder } from './GameCardSpecsFromGameSpecV1Builder';

@Injectable()
export class GameCreateQueryFromGameCreateQueryV1Builder
  implements
    Builder<
      GameCreateQuery,
      [apiModels.GameCreateQueryV1, GameCreateQueryContext]
    >
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
    context: GameCreateQueryContext,
  ): GameCreateQuery {
    return {
      gameSlotIds: this.#buildGameSlotIds(gameCreateQueryV1, context),
      id: context.uuid,
      spec: this.#gameCardSpecsFromGameSpecV1Builder.build(
        gameCreateQueryV1.gameSpec,
      ),
    };
  }

  #buildGameSlotIds(
    gameCreateQueryV1: apiModels.GameCreateQueryV1,
    context: GameCreateQueryContext,
  ): string[] {
    if (gameCreateQueryV1.gameSlotsAmount !== context.gameSlotUuids.length) {
      throw new AppError(
        AppErrorKind.unknown,
        'Expecting a GameCreateQueryContext with as many game slot ids as game slots amount',
      );
    }

    return context.gameSlotUuids;
  }
}
