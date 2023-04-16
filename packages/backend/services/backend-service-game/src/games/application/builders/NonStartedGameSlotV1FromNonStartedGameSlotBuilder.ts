import { Injectable } from '@nestjs/common';
import { models as apiModels } from '@one-game-js/api-models';
import { Builder } from '@one-game-js/backend-common';

import { NonStartedGameSlot } from '../../domain/models/NonStartedGameSlot';

@Injectable()
export class NonStartedGameSlotV1FromNonStartedGameSlotBuilder
  implements Builder<apiModels.NonStartedGameSlotV1, [NonStartedGameSlot]>
{
  public build(
    nonStartedGameSlot: NonStartedGameSlot,
  ): apiModels.NonStartedGameSlotV1 {
    return {
      userId: nonStartedGameSlot.userId,
    };
  }
}
