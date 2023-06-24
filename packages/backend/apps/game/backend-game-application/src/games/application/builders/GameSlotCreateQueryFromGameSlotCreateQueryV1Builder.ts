import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { GameSlotCreateQuery } from '@cornie-js/backend-game-domain/games';
import { Injectable } from '@nestjs/common';

import { GameSlotCreateQueryContext } from '../models/GameSlotCreateQueryContext';

@Injectable()
export class GameSlotCreateQueryFromGameSlotCreateQueryV1Builder
  implements
    Builder<
      GameSlotCreateQuery,
      [apiModels.GameIdSlotCreateQueryV1, GameSlotCreateQueryContext]
    >
{
  public build(
    gameSlotCreateQuery: apiModels.GameIdSlotCreateQueryV1,
    context: GameSlotCreateQueryContext,
  ): GameSlotCreateQuery {
    return {
      gameId: context.game.id,
      id: context.uuid,
      position: context.game.state.slots.length,
      userId: gameSlotCreateQuery.userId,
    };
  }
}
