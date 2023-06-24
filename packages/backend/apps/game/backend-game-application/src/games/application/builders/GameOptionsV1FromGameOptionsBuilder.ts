import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { GameOptions } from '@cornie-js/backend-game-domain/games';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GameOptionsV1FromGameOptionsBuilder
  implements Builder<apiModels.GameOptionsV1, [GameOptions]>
{
  public build(gameOptions: GameOptions): apiModels.GameOptionsV1 {
    return {
      chainDraw2Draw2Cards: gameOptions.chainDraw2Draw2Cards,
      chainDraw2Draw4Cards: gameOptions.chainDraw2Draw4Cards,
      chainDraw4Draw2Cards: gameOptions.chainDraw4Draw2Cards,
      chainDraw4Draw4Cards: gameOptions.chainDraw4Draw4Cards,
      playCardIsMandatory: gameOptions.playCardIsMandatory,
      playMultipleSameCards: gameOptions.playMultipleSameCards,
      playWildDraw4IfNoOtherAlternative:
        gameOptions.playWildDraw4IfNoOtherAlternative,
    };
  }
}
