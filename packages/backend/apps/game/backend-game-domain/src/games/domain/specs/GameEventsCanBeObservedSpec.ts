import { Spec } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';

import { Game } from '../entities/Game';
import { GameStatus } from '../valueObjects/GameStatus';

@Injectable()
export class GameEventsCanBeObservedSpec implements Spec<[Game]> {
  public isSatisfiedBy(game: Game): boolean {
    return game.state.status === GameStatus.active;
  }
}
