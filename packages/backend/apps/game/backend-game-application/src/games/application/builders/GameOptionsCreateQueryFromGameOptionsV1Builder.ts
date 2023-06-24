import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { GameOptionsCreateQuery } from '@cornie-js/backend-game-domain/games';
import { Injectable } from '@nestjs/common';

import { GameOptionsCreateQueryContext } from '../models/GameOptionsCreateQueryContext';

@Injectable()
export class GameOptionsCreateQueryFromGameOptionsV1Builder
  implements
    Builder<
      GameOptionsCreateQuery,
      [apiModels.GameOptionsV1, GameOptionsCreateQueryContext]
    >
{
  public build(
    gameOptions: apiModels.GameOptionsV1,
    context: GameOptionsCreateQueryContext,
  ): GameOptionsCreateQuery {
    return {
      chainDraw2Draw2Cards: gameOptions.chainDraw2Draw2Cards,
      chainDraw2Draw4Cards: gameOptions.chainDraw2Draw4Cards,
      chainDraw4Draw2Cards: gameOptions.chainDraw4Draw2Cards,
      chainDraw4Draw4Cards: gameOptions.chainDraw4Draw4Cards,
      gameId: context.gameId,
      id: context.uuid,
      playCardIsMandatory: gameOptions.playCardIsMandatory,
      playMultipleSameCards: gameOptions.playMultipleSameCards,
      playWildDraw4IfNoOtherAlternative:
        gameOptions.playWildDraw4IfNoOtherAlternative,
    };
  }
}
