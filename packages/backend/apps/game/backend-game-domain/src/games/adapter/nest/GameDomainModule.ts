import { Module } from '@nestjs/common';

import { CardDomainModule } from '../../../cards/adapter/nest/CardDomainModule';
import { GameService } from '../../domain/services/GameService';
import { CardCanBePlayedSpec } from '../../domain/specs/CardCanBePlayedSpec';
import { CurrentPlayerCanPlayCardsSpec } from '../../domain/specs/CurrentPlayerCanPlayCardsSpec';
import { GameCanHoldMoreGameSlotsSpec } from '../../domain/specs/GameCanHoldMoreGameSlotsSpec';
import { GameCanHoldOnlyOneMoreGameSlotSpec } from '../../domain/specs/GameCanHoldOnlyOneMoreGameSlotSpec';
import { IsGameFinishedSpec } from '../../domain/specs/IsGameFinishedSpec';
import { PlayerCanPassTurnSpec } from '../../domain/specs/PlayerCanPassTurnSpec';
import { PlayerCanUpdateGameSpec } from '../../domain/specs/PlayerCanUpdateGameSpec';

@Module({
  exports: [
    GameService,
    GameCanHoldMoreGameSlotsSpec,
    GameCanHoldOnlyOneMoreGameSlotSpec,
    CardCanBePlayedSpec,
    PlayerCanPassTurnSpec,
    CurrentPlayerCanPlayCardsSpec,
    PlayerCanUpdateGameSpec,
  ],
  imports: [CardDomainModule],
  providers: [
    GameService,
    GameCanHoldMoreGameSlotsSpec,
    GameCanHoldOnlyOneMoreGameSlotSpec,
    IsGameFinishedSpec,
    CardCanBePlayedSpec,
    PlayerCanPassTurnSpec,
    CurrentPlayerCanPlayCardsSpec,
    PlayerCanUpdateGameSpec,
  ],
})
export class GameDomainModule {}
