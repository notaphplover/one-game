import { OneGameApiWorld } from '../../../http/models/OneGameApiWorld';
import { GameV1Parameter } from '../../models/GameV1Parameter';

export function getGameOrFail(
  this: OneGameApiWorld,
  alias: string,
): GameV1Parameter {
  const gameV1Parameter: GameV1Parameter | undefined =
    this.entities.games.get(alias);

  if (gameV1Parameter === undefined) {
    throw new Error(`Expected game "${alias}" to be found`);
  }

  return gameV1Parameter;
}
