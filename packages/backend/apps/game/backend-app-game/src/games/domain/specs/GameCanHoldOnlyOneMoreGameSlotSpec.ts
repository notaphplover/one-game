import { Game } from '@cornie-js/backend-app-game-domain/games/domain';
import { Spec } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GameCanHoldOnlyOneMoreGameSlotSpec implements Spec<[Game]> {
  public isSatisfiedBy(game: Game): boolean {
    return (
      !game.state.active && game.state.slots.length === game.gameSlotsAmount - 1
    );
  }
}
