import { OneGameApiWorld } from '../../../http/models/OneGameApiWorld';
import { GameOptionsV1Parameter } from '../../models/GameOptionsV1Parameter';

export function getGameOptionsOrFail(
  this: OneGameApiWorld,
  alias: string,
): GameOptionsV1Parameter {
  const gameOptionsV1Parameter: GameOptionsV1Parameter | undefined =
    this.entities.gameOptions.get(alias);

  if (gameOptionsV1Parameter === undefined) {
    throw new Error(`Expected game options "${alias}" to be found`);
  }

  return gameOptionsV1Parameter;
}
