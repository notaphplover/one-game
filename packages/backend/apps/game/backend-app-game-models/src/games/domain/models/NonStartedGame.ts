import { BaseGame } from './BaseGame';
import { NonStartedGameSlot } from './NonStartedGameSlot';

export interface NonStartedGame extends BaseGame {
  readonly active: false;
  readonly slots: NonStartedGameSlot[];
}
