import { AppError, AppErrorKind, Spec } from '@cornie-js/backend-common';
import { Inject, Injectable } from '@nestjs/common';

import { Card } from '../../../cards/domain/valueObjects/Card';
import { ActiveGame } from '../entities/ActiveGame';
import { ActiveGameSlot } from '../valueObjects/ActiveGameSlot';
import { GameOptions } from '../valueObjects/GameOptions';
import { CardCanBePlayedSpec } from './CardCanBePlayedSpec';

@Injectable()
export class PlayerCanDrawCardsSpec
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
        `Game slot ${gameSlotIndex} not found at game ${activeGame.id}`,
      );
    }

    if (activeGame.state.currentTurnCardsPlayed) {
      return false;
    }

    if (!gameOptions.playCardIsMandatory) {
      return true;
    }

    return gameSlot.cards.every(
      (card: Card): boolean =>
        !this.#cardCanBePlayedSpec.isSatisfiedBy(card, activeGame, gameOptions),
    );
  }
}
