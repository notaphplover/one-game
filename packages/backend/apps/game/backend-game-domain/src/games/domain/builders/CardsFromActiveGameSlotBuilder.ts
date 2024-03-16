import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';

import { Card } from '../../../cards/domain/valueObjects/Card';
import { ActiveGameSlot } from '../valueObjects/ActiveGameSlot';

@Injectable()
export class CardsFromActiveGameSlotBuilder
  implements Builder<Card[], [ActiveGameSlot, number[]]>
{
  public build(gameSlot: ActiveGameSlot, cardIndexes: number[]): Card[] {
    const nextCurrentCards: Card[] = cardIndexes.map((cardIndex: number) => {
      const card: Card | undefined = gameSlot.cards[cardIndex];

      if (card === undefined) {
        throw new AppError(
          AppErrorKind.unknown,
          'An unexpected error happened while attempting to update game',
        );
      }

      return card;
    });

    return nextCurrentCards;
  }
}
