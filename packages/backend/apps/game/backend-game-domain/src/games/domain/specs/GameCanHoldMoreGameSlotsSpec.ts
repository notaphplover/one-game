import { Spec } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';

import { Game } from '../entities/Game';
import { GameStatus } from '../valueObjects/GameStatus';

@Injectable()
export class GameCanHoldMoreGameSlotsSpec implements Spec<[Game]> {
  public isSatisfiedBy(game: Game): boolean {
    return (
      game.state.status === GameStatus.nonStarted &&
      game.state.slots.length < game.spec.gameSlotsAmount
    );
  }
}
