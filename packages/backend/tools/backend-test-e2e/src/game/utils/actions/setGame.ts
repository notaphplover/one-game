import { OneGameApiWorld } from '../../../http/models/OneGameApiWorld';
import { GameV1Parameter } from '../../models/GameV1Parameter';

export function setGame(
  this: OneGameApiWorld,
  alias: string,
  game: GameV1Parameter,
): void {
  this.entities.games.set(alias, game);
}
