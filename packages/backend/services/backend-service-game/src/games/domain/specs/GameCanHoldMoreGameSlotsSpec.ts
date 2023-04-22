import { Injectable } from '@nestjs/common';
import { Spec } from '@one-game-js/backend-common';

import { Game } from '../models/Game';

@Injectable()
export class GameCanHoldMoreGameSlotsSpec implements Spec<[Game]> {
  public isSatisfiedBy(game: Game): boolean {
    return !game.active && game.slots.length < game.gameSlotsAmount;
  }
}
