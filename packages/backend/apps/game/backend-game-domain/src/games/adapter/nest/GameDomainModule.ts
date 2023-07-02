import { Module } from '@nestjs/common';

import { GameService } from '../../domain/services/GameService';
import { CardCanBePlayedSpec } from '../../domain/specs/CardCanBePlayedSpec';
import { GameCanHoldMoreGameSlotsSpec } from '../../domain/specs/GameCanHoldMoreGameSlotsSpec';
import { GameCanHoldOnlyOneMoreGameSlotSpec } from '../../domain/specs/GameCanHoldOnlyOneMoreGameSlotSpec';
import { PlayerCanPassTurnSpec } from '../../domain/specs/PlayerCanPassTurnSpec';
import { PlayerCanPlayCardsSpec } from '../../domain/specs/PlayerCanPlayCardsSpec';
import { PlayerCanUpdateGameSpec } from '../../domain/specs/PlayerCanUpdateGameSpec';

@Module({
  exports: [
    GameService,
    GameCanHoldMoreGameSlotsSpec,
    GameCanHoldOnlyOneMoreGameSlotSpec,
    CardCanBePlayedSpec,
    PlayerCanPassTurnSpec,
    PlayerCanPlayCardsSpec,
    PlayerCanUpdateGameSpec,
  ],
  providers: [
    GameService,
    GameCanHoldMoreGameSlotsSpec,
    GameCanHoldOnlyOneMoreGameSlotSpec,
    CardCanBePlayedSpec,
    PlayerCanPassTurnSpec,
    PlayerCanPlayCardsSpec,
    PlayerCanUpdateGameSpec,
  ],
})
export class GameDomainModule {}
