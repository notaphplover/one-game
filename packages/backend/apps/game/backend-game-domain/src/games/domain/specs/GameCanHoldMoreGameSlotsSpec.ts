import { Spec } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';

import { Game } from '../entities/Game';
import { GameSpec } from '../valueObjects/GameSpec';
import { GameStatus } from '../valueObjects/GameStatus';

@Injectable()
export class GameCanHoldMoreGameSlotsSpec implements Spec<[Game, GameSpec]> {
  public isSatisfiedBy(game: Game, gameSpec: GameSpec): boolean {
    return (
      game.state.status === GameStatus.nonStarted &&
      game.state.slots.length < gameSpec.gameSlotsAmount
    );
  }
}
