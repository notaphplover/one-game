import { Injectable } from '@nestjs/common';
import { models as apiModels } from '@one-game-js/api-models';
import { Builder } from '@one-game-js/backend-common';

import { ActiveGameSlot } from '../../domain/models/ActiveGameSlot';

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
