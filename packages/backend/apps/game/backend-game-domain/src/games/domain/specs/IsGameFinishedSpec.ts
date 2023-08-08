import { AppError, AppErrorKind, Spec } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';

import { ActiveGame } from '../entities/ActiveGame';
import { ActiveGameSlot } from '../valueObjects/ActiveGameSlot';

@Injectable()
export class IsGameFinishedSpec implements Spec<[ActiveGame]> {
  public isSatisfiedBy(game: ActiveGame): boolean {
    const currentPlayingSlot: ActiveGameSlot = this.#getGameSlotOrThrow(
      game,
      game.state.currentPlayingSlotIndex,
    );

    return currentPlayingSlot.cards.length === 0;
  }

  #getGameSlotOrThrow(game: ActiveGame, index: number): ActiveGameSlot {
    const gameSlot: ActiveGameSlot | undefined = game.state.slots[index];

    if (gameSlot === undefined) {
      throw new AppError(
        AppErrorKind.unknown,
        `Expecting a game slot at index "${index}", none found instead.`,
      );
    }

    return gameSlot;
  }
}
