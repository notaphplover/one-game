import { Module } from '@nestjs/common';

import { GameService } from '../../domain/services/GameService';
import { GameCanHoldMoreGameSlotsSpec } from '../../domain/specs/GameCanHoldMoreGameSlotsSpec';
import { GameCanHoldOnlyOneMoreGameSlotSpec } from '../../domain/specs/GameCanHoldOnlyOneMoreGameSlotSpec';

@Module({
  providers: [
    GameService,
    GameCanHoldMoreGameSlotsSpec,
    GameCanHoldOnlyOneMoreGameSlotSpec,
  ],
})
export class GameDomainModule {}
