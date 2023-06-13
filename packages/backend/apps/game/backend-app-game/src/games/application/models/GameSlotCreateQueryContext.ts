import { Game } from '@cornie-js/backend-app-game-domain/games/domain';

import { UuidContext } from '../../../foundation/common/application/models/UuidContext';

export interface GameSlotCreateQueryContext extends UuidContext {
  game: Game;
}
