import { Module } from '@nestjs/common';

import { GameService } from '../../domain/services/GameService';
import { GameCanHoldMoreGameSlotsSpec } from '../../domain/specs/GameCanHoldMoreGameSlotsSpec';
import { GameCanHoldOnlyOneMoreGameSlotSpec } from '../../domain/specs/GameCanHoldOnlyOneMoreGameSlotSpec';
import { IsCardPlayableSpec } from '../../domain/specs/IsCardPlayableSpec';

@Module({
  exports: [
    GameService,
    GameCanHoldMoreGameSlotsSpec,
    GameCanHoldOnlyOneMoreGameSlotSpec,
    IsCardPlayableSpec,
  ],
  providers: [
    GameService,
    GameCanHoldMoreGameSlotsSpec,
    GameCanHoldOnlyOneMoreGameSlotSpec,
    IsCardPlayableSpec,
  ],
})
export class GameDomainModule {}
