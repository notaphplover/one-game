import { OneGameApiWorld } from '../../../http/models/OneGameApiWorld';
import { GameEventSubscriptionV2Parameter } from '../../models/GameEventSubscriptionV2Parameter';

export function setGameEventSubscription(
  this: OneGameApiWorld,
  alias: string,
  gameEventSubscription: GameEventSubscriptionV2Parameter,
): void {
  this.entities.gameEventSubscriptions.set(alias, gameEventSubscription);
}
