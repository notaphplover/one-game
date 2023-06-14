import { Spec } from '@cornie-js/backend-common';
import { Game } from '@cornie-js/backend-game-domain/games';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GameCanHoldMoreGameSlotsSpec implements Spec<[Game]> {
  public isSatisfiedBy(game: Game): boolean {
    return !game.state.active && game.state.slots.length < game.gameSlotsAmount;
  }
}
