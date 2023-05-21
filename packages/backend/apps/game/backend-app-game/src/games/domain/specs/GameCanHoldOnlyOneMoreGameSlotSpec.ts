import { Game } from '@cornie-js/backend-app-game-models/games/domain';
import { Spec } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GameCanHoldOnlyOneMoreGameSlotSpec implements Spec<[Game]> {
  public isSatisfiedBy(game: Game): boolean {
    return !game.active && game.slots.length === game.gameSlotsAmount - 1;
  }
}
