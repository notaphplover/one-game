import { Spec } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';

import { Game } from '../models/Game';

@Injectable()
export class GameCanHoldOnlyOneMoreGameSlotSpec implements Spec<[Game]> {
  public isSatisfiedBy(game: Game): boolean {
    return !game.active && game.slots.length === game.gameSlotsAmount - 1;
  }
}
