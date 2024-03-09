import { Module } from '@nestjs/common';

import { CardDomainModule } from '../../../cards/adapter/nest/CardDomainModule';
import { GameCardsEffectUpdateQueryFromGameBuilder } from '../../domain/builders/GameCardsEffectUpdateQueryFromGameBuilder';
import { GameDrawCardsUpdateQueryFromGameBuilder } from '../../domain/builders/GameDrawCardsUpdateQueryFromGameBuilder';
import { GamePassTurnUpdateQueryFromGameBuilder } from '../../domain/builders/GamePassTurnUpdateQueryFromGameBuilder';
import { GamePlayCardsUpdateQueryFromGameBuilder } from '../../domain/builders/GamePlayCardsUpdateQueryFromGameBuilder';
import { StartGameUpdateQueryFromGameBuilder } from '../../domain/builders/StartGameUpdateQueryFromGameBuilder';
import { GameDrawService } from '../../domain/services/GameDrawService';
import { GameService } from '../../domain/services/GameService';
import { CardCanBePlayedSpec } from '../../domain/specs/CardCanBePlayedSpec';
import { CurrentPlayerCanPlayCardsSpec } from '../../domain/specs/CurrentPlayerCanPlayCardsSpec';
import { GameCanHoldMoreGameSlotsSpec } from '../../domain/specs/GameCanHoldMoreGameSlotsSpec';
import { GameCanHoldOnlyOneMoreGameSlotSpec } from '../../domain/specs/GameCanHoldOnlyOneMoreGameSlotSpec';
import { IsGameFinishedSpec } from '../../domain/specs/IsGameFinishedSpec';
import { IsValidGameCreateQuerySpec } from '../../domain/specs/IsValidGameCreateQuerySpec';
import { PlayerCanDrawCardsSpec } from '../../domain/specs/PlayerCanDrawCardsSpec';
import { PlayerCanPassTurnSpec } from '../../domain/specs/PlayerCanPassTurnSpec';
import { PlayerCanUpdateGameSpec } from '../../domain/specs/PlayerCanUpdateGameSpec';

@Module({
  exports: [
    CardCanBePlayedSpec,
    CurrentPlayerCanPlayCardsSpec,
    GameCanHoldMoreGameSlotsSpec,
    GameCanHoldOnlyOneMoreGameSlotSpec,
    GameCardsEffectUpdateQueryFromGameBuilder,
    GameDrawCardsUpdateQueryFromGameBuilder,
    GameService,
    GamePassTurnUpdateQueryFromGameBuilder,
    GamePlayCardsUpdateQueryFromGameBuilder,
    IsValidGameCreateQuerySpec,
    PlayerCanDrawCardsSpec,
    PlayerCanPassTurnSpec,
    PlayerCanUpdateGameSpec,
    StartGameUpdateQueryFromGameBuilder,
  ],
  imports: [CardDomainModule],
  providers: [
    CardCanBePlayedSpec,
    CurrentPlayerCanPlayCardsSpec,
    GameCanHoldMoreGameSlotsSpec,
    GameCanHoldOnlyOneMoreGameSlotSpec,
    GameCardsEffectUpdateQueryFromGameBuilder,
    GameDrawCardsUpdateQueryFromGameBuilder,
    GameDrawService,
    GamePassTurnUpdateQueryFromGameBuilder,
    GamePlayCardsUpdateQueryFromGameBuilder,
    GameService,
    IsGameFinishedSpec,
    IsValidGameCreateQuerySpec,
    PlayerCanDrawCardsSpec,
    PlayerCanPassTurnSpec,
    PlayerCanUpdateGameSpec,
    StartGameUpdateQueryFromGameBuilder,
  ],
})
export class GameDomainModule {}
