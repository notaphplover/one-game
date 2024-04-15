import { OneGameApiWorld } from '../../models/OneGameApiWorld';

export async function disposeWorld(this: OneGameApiWorld): Promise<void> {
  for (const gameEventSubscription of this.entities.gameEventSubscriptions.values()) {
    gameEventSubscription.eventSource.close();
  }
}
