import { models as apiModels } from '@cornie-js/api-models';
import { ActiveGameSlot } from '@cornie-js/backend-app-game-models/games/domain';
import { Builder } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ActiveGameSlotV1FromActiveGameSlotBuilder
  implements Builder<apiModels.ActiveGameSlotV1, [ActiveGameSlot]>
{
  public build(activeGameSlot: ActiveGameSlot): apiModels.ActiveGameSlotV1 {
    return {
      cardsAmount: activeGameSlot.cards.length,
      userId: activeGameSlot.userId,
    };
  }
}
