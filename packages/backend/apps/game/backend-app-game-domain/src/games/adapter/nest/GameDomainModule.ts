import { Module } from '@nestjs/common';

import { GameService } from '../../services/GameService';
import { GameCanHoldMoreGameSlotsSpec } from '../../specs/GameCanHoldMoreGameSlotsSpec';
import { GameCanHoldOnlyOneMoreGameSlotSpec } from '../../specs/GameCanHoldOnlyOneMoreGameSlotSpec';

@Module({
  providers: [
    GameService,
    GameCanHoldMoreGameSlotsSpec,
    GameCanHoldOnlyOneMoreGameSlotSpec,
  ],
})
export class GameDomainModule {}
