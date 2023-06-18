import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import {
  ActiveGameSlot,
  NonStartedGameSlot,
} from '@cornie-js/backend-game-domain/games';
import { Inject } from '@nestjs/common';

import { ActiveGameSlotV1FromActiveGameSlotBuilder } from './ActiveGameSlotV1FromActiveGameSlotBuilder';
import { NonStartedGameSlotV1FromNonStartedGameSlotBuilder } from './NonStartedGameSlotV1FromNonStartedGameSlotBuilder';

export class GameSlotV1FromGameSlotBuilder
  implements
    Builder<apiModels.GameSlotV1, [ActiveGameSlot | NonStartedGameSlot]>
{
  readonly #activeGameSlotV1FromActiveGameSlotBuilder: Builder<
    apiModels.ActiveGameSlotV1,
    [ActiveGameSlot]
  >;

  readonly #nonStartedGameSlotV1FromNonStartedGameSlotBuilder: Builder<
    apiModels.NonStartedGameSlotV1,
    [NonStartedGameSlot]
  >;

  constructor(
    @Inject(ActiveGameSlotV1FromActiveGameSlotBuilder)
    activeGameSlotV1FromActiveGameSlotBuilder: Builder<
      apiModels.ActiveGameSlotV1,
      [ActiveGameSlot]
    >,
    @Inject(NonStartedGameSlotV1FromNonStartedGameSlotBuilder)
    nonStartedGameSlotV1FromNonStartedGameSlotBuilder: Builder<
      apiModels.NonStartedGameSlotV1,
      [NonStartedGameSlot]
    >,
  ) {
    this.#activeGameSlotV1FromActiveGameSlotBuilder =
      activeGameSlotV1FromActiveGameSlotBuilder;
    this.#nonStartedGameSlotV1FromNonStartedGameSlotBuilder =
      nonStartedGameSlotV1FromNonStartedGameSlotBuilder;
  }

  public build(
    gameSlot: ActiveGameSlot | NonStartedGameSlot,
  ): apiModels.GameSlotV1 {
    return this.#isActiveGameSlot(gameSlot)
      ? this.#activeGameSlotV1FromActiveGameSlotBuilder.build(gameSlot)
      : this.#nonStartedGameSlotV1FromNonStartedGameSlotBuilder.build(gameSlot);
  }

  #isActiveGameSlot(
    gameSlot: ActiveGameSlot | NonStartedGameSlot,
  ): gameSlot is ActiveGameSlot {
    return (gameSlot as Partial<ActiveGameSlot>).cards !== undefined;
  }
}
