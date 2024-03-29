import { Spec } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';

import { ActiveGame } from '../entities/ActiveGame';
import { ActiveGameSlot } from '../valueObjects/ActiveGameSlot';

@Injectable()
export class PlayerCanUpdateGameSpec
  implements Spec<[ActiveGame, string, number]>
{
  public isSatisfiedBy(
    activeGame: ActiveGame,
    userId: string,
    gameSlotIndex: number,
  ): boolean {
    const userGameSlot: ActiveGameSlot | undefined =
      activeGame.state.slots[gameSlotIndex];

    return (
      userGameSlot !== undefined &&
      userId === userGameSlot.userId &&
      gameSlotIndex === activeGame.state.currentPlayingSlotIndex
    );
  }
}
