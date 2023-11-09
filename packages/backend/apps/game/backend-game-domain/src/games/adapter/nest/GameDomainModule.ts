import { Module } from '@nestjs/common';

import { CardDomainModule } from '../../../cards/adapter/nest/CardDomainModule';
import { GameDrawService } from '../../domain/services/GameDrawService';
import { GameService } from '../../domain/services/GameService';
import { CardCanBePlayedSpec } from '../../domain/specs/CardCanBePlayedSpec';
import { CurrentPlayerCanPlayCardsSpec } from '../../domain/specs/CurrentPlayerCanPlayCardsSpec';
import { GameCanHoldMoreGameSlotsSpec } from '../../domain/specs/GameCanHoldMoreGameSlotsSpec';
import { GameCanHoldOnlyOneMoreGameSlotSpec } from '../../domain/specs/GameCanHoldOnlyOneMoreGameSlotSpec';
import { IsGameFinishedSpec } from '../../domain/specs/IsGameFinishedSpec';
import { IsValidGameCreateQuerySpec } from '../../domain/specs/IsValidGameCreateQuerySpec';
import { PlayerCanPassTurnSpec } from '../../domain/specs/PlayerCanPassTurnSpec';
import { PlayerCanUpdateGameSpec } from '../../domain/specs/PlayerCanUpdateGameSpec';

@Module({
  exports: [
    GameService,
    GameCanHoldMoreGameSlotsSpec,
    GameCanHoldOnlyOneMoreGameSlotSpec,
    IsValidGameCreateQuerySpec,
    CardCanBePlayedSpec,
    PlayerCanPassTurnSpec,
    CurrentPlayerCanPlayCardsSpec,
    PlayerCanUpdateGameSpec,
  ],
  imports: [CardDomainModule],
  providers: [
    GameDrawService,
    GameService,
    GameCanHoldMoreGameSlotsSpec,
    GameCanHoldOnlyOneMoreGameSlotSpec,
    IsGameFinishedSpec,
    IsValidGameCreateQuerySpec,
    CardCanBePlayedSpec,
    PlayerCanPassTurnSpec,
    CurrentPlayerCanPlayCardsSpec,
    PlayerCanUpdateGameSpec,
  ],
})
export class GameDomainModule {}
