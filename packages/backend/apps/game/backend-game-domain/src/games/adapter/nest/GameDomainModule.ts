import { Module } from '@nestjs/common';

import { GameService } from '../../domain/services/GameService';
import { CardCanBePlayedSpec } from '../../domain/specs/CardCanBePlayedSpec';
import { GameCanHoldMoreGameSlotsSpec } from '../../domain/specs/GameCanHoldMoreGameSlotsSpec';
import { GameCanHoldOnlyOneMoreGameSlotSpec } from '../../domain/specs/GameCanHoldOnlyOneMoreGameSlotSpec';
import { PlayerCanPassTurnSpec } from '../../domain/specs/PlayerCanPassTurnSpec';
import { PlayerCanUpdateGameSpec } from '../../domain/specs/PlayerCanUpdateGameSpec';

@Module({
  exports: [
    GameService,
    GameCanHoldMoreGameSlotsSpec,
    GameCanHoldOnlyOneMoreGameSlotSpec,
    CardCanBePlayedSpec,
    PlayerCanPassTurnSpec,
    PlayerCanUpdateGameSpec,
  ],
  providers: [
    GameService,
    GameCanHoldMoreGameSlotsSpec,
    GameCanHoldOnlyOneMoreGameSlotSpec,
    CardCanBePlayedSpec,
    PlayerCanPassTurnSpec,
    PlayerCanUpdateGameSpec,
  ],
})
export class GameDomainModule {}
