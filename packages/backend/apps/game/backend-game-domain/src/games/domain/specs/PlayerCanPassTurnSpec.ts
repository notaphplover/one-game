import { AppError, AppErrorKind, Spec } from '@cornie-js/backend-common';
import { Inject, Injectable } from '@nestjs/common';

import { ActiveGame } from '../entities/ActiveGame';
import { ActiveGameSlot } from '../valueObjects/ActiveGameSlot';
import { GameOptions } from '../valueObjects/GameOptions';
import { CardCanBePlayedSpec } from './CardCanBePlayedSpec';

@Injectable()
export class PlayerCanPassTurnSpec
  implements Spec<[ActiveGame, GameOptions, number]>
{
  readonly #cardCanBePlayedSpec: CardCanBePlayedSpec;

  constructor(
    @Inject(CardCanBePlayedSpec)
    cardCanBePlayedSpec: CardCanBePlayedSpec,
  ) {
    this.#cardCanBePlayedSpec = cardCanBePlayedSpec;
  }

  public isSatisfiedBy(
    activeGame: ActiveGame,
    gameOptions: GameOptions,
    gameSlotIndex: number,
  ): boolean {
    const gameSlot: ActiveGameSlot | undefined =
      activeGame.state.slots[gameSlotIndex];

    if (gameSlot === undefined) {
      throw new AppError(
        AppErrorKind.unknown,
        `Game slot ${gameSlotIndex.toString()} not found at game ${activeGame.id}`,
      );
    }

    if (activeGame.state.currentTurnCardsPlayed) {
      return true;
    }

    if (!activeGame.state.currentTurnCardsDrawn) {
      return false;
    }

    if (
      !gameOptions.playCardIsMandatory ||
      activeGame.state.currentTurnSingleCardDraw === undefined
    ) {
      return true;
    }

    return !this.#cardCanBePlayedSpec.isSatisfiedBy(
      activeGame.state.currentTurnSingleCardDraw,
      activeGame,
      gameOptions,
    );
  }
}
