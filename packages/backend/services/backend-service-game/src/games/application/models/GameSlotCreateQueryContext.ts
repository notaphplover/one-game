import { UuidContext } from '../../../foundation/common/application/models/UuidContext';
import { Game } from '../../domain/models/Game';

export interface GameSlotCreateQueryContext extends UuidContext {
  game: Game;
}
