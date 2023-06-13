import { models as apiModels } from '@cornie-js/api-models';
import { GameCreateQuery } from '@cornie-js/backend-app-game-domain/games/domain';
import { Builder } from '@cornie-js/backend-common';
import { Inject, Injectable } from '@nestjs/common';

import { UuidContext } from '../../../foundation/common/application/models/UuidContext';
import { GameService } from '../../domain/services/GameService';

@Injectable()
export class GameCreateQueryFromGameCreateQueryV1Builder
  implements
    Builder<GameCreateQuery, [apiModels.GameCreateQueryV1, UuidContext]>
{
  readonly #gameService: GameService;

  constructor(
    @Inject(GameService)
    gameService: GameService,
  ) {
    this.#gameService = gameService;
  }

  public build(
    gameCreateQueryV1: apiModels.GameCreateQueryV1,
    context: UuidContext,
  ): GameCreateQuery {
    return {
      gameSlotsAmount: gameCreateQueryV1.gameSlotsAmount,
      id: context.uuid,
      spec: {
        cards: this.#gameService.getInitialCardsSpec(),
      },
    };
  }
}
