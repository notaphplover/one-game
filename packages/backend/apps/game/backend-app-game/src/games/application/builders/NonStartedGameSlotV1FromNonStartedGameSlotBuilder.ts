import { models as apiModels } from '@cornie-js/api-models';
import { NonStartedGameSlot } from '@cornie-js/backend-app-game-domain/games/domain';
import { Builder } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';

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
