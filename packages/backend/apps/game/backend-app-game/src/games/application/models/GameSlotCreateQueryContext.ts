import { Game } from '@cornie-js/backend-game-domain/games';

import { UuidContext } from '../../../foundation/common/application/models/UuidContext';

export interface GameSlotCreateQueryContext extends UuidContext {
  game: Game;
}
