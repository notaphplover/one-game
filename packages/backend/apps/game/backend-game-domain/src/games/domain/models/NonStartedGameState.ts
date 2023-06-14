import { NonStartedGameSlot } from './NonStartedGameSlot';

export interface NonStartedGameState {
  readonly active: false;
  readonly slots: NonStartedGameSlot[];
}
