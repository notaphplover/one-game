import { Builder } from '@cornie-js/backend-common';
import { Card } from '@cornie-js/backend-game-domain/cards';
import {
  ActiveGameSlot,
  FinishedGameSlot,
  NonStartedGameSlot,
} from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';

import { CardArrayFromCardDbStringifiedArrayBuilder } from '../../../../cards/adapter/typeorm/builders/CardArrayFromCardDbStringifiedArrayBuilder';
import { GameSlotDb } from '../models/GameSlotDb';

@Injectable()
export class GameSlotFromGameSlotDbBuilder
  implements
    Builder<
      ActiveGameSlot | FinishedGameSlot | NonStartedGameSlot,
      [GameSlotDb]
    >
{
  readonly #cardArrayFromCardDbStringifiedArrayBuilder: Builder<
    Card[],
    [string]
  >;

  constructor(
    @Inject(CardArrayFromCardDbStringifiedArrayBuilder)
    cardArrayFromCardDbStringifiedArrayBuilder: Builder<Card[], [string]>,
  ) {
    this.#cardArrayFromCardDbStringifiedArrayBuilder =
      cardArrayFromCardDbStringifiedArrayBuilder;
  }

  public build(
    gameSlotDb: GameSlotDb,
  ): ActiveGameSlot | FinishedGameSlot | NonStartedGameSlot {
    if (gameSlotDb.cards === null) {
      return this.#buildNonStartedGameSlot(gameSlotDb);
    } else {
      return this.#buildActiveOrFinishedGameSlots(gameSlotDb);
    }
  }

  #buildActiveOrFinishedGameSlots(
    gameSlotDb: GameSlotDb,
  ): ActiveGameSlot | FinishedGameSlot {
    return {
      cards: this.#cardArrayFromCardDbStringifiedArrayBuilder.build(
        gameSlotDb.cards as string,
      ),
      position: gameSlotDb.position,
      userId: gameSlotDb.userId,
    };
  }

  #buildNonStartedGameSlot(gameSlotDb: GameSlotDb): NonStartedGameSlot {
    return {
      position: gameSlotDb.position,
      userId: gameSlotDb.userId,
    };
  }
}
