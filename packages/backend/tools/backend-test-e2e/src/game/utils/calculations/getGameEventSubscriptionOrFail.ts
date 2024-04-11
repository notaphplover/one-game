import { OneGameApiWorld } from '../../../http/models/OneGameApiWorld';
import { GameEventSubscriptionV2Parameter } from '../../models/GameEventSubscriptionV2Parameter';

export function getGameEventSubscriptionOrFail(
  this: OneGameApiWorld,
  alias: string,
): GameEventSubscriptionV2Parameter {
  const gameEventSubscriptionV2Parameter:
    | GameEventSubscriptionV2Parameter
    | undefined = this.entities.gameEventSubscriptions.get(alias);

  if (gameEventSubscriptionV2Parameter === undefined) {
    throw new Error(`Expected game event subscription "${alias}" to be found`);
  }

  return gameEventSubscriptionV2Parameter;
}
