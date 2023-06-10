import { GameDomainModule } from './adapter/nest/GameDomainModule';
import { GameService } from './services/GameService';
import { GameCanHoldMoreGameSlotsSpec } from './specs/GameCanHoldMoreGameSlotsSpec';
import { GameCanHoldOnlyOneMoreGameSlotSpec } from './specs/GameCanHoldOnlyOneMoreGameSlotSpec';

export {
  GameCanHoldMoreGameSlotsSpec,
  GameCanHoldOnlyOneMoreGameSlotSpec,
  GameDomainModule,
  GameService,
};
