import { OneGameApiWorld } from '../../../http/models/OneGameApiWorld';
import { GameOptionsV1Parameter } from '../../models/GameOptionsV1Parameter';

export function setGameOptions(
  this: OneGameApiWorld,
  alias: string,
  gameOptions: GameOptionsV1Parameter,
): void {
  this.entities.gameOptions.set(alias, gameOptions);
}
