import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { FinishedGameSlot } from '@cornie-js/backend-game-domain/games';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FinishedGameSlotV1FromFinishedGameSlotBuilder
  implements Builder<apiModels.FinishedGameSlotV1, [FinishedGameSlot]>
{
  public build(
    finishedGameSlot: FinishedGameSlot,
  ): apiModels.FinishedGameSlotV1 {
    return {
      cardsAmount: finishedGameSlot.cards.length,
      userId: finishedGameSlot.userId,
    };
  }
}
