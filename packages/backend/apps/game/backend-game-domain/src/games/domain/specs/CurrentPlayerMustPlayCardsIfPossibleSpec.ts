import { Spec } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';

import { ActiveGame } from '../entities/ActiveGame';
import { GameOptions } from '../valueObjects/GameOptions';

@Injectable()
export class CurrentPlayerMustPlayCardsIfPossibleSpec
  implements Spec<[ActiveGame, GameOptions]>
{
  public isSatisfiedBy(
    activeGame: ActiveGame,
    gameOptions: GameOptions,
  ): boolean {
    if (!gameOptions.playCardIsMandatory) {
      return false;
    }

    return !activeGame.state.currentTurnCardsPlayed;
  }
}
