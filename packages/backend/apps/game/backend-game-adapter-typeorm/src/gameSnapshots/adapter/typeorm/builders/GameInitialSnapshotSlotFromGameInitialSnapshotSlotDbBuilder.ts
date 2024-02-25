import { Builder } from '@cornie-js/backend-common';
import { Card } from '@cornie-js/backend-game-domain/cards';
import { GameInitialSnapshotSlot } from '@cornie-js/backend-game-domain/gameSnapshots';
import { Inject, Injectable } from '@nestjs/common';

import { CardArrayFromCardDbStringifiedArrayBuilder } from '../../../../cards/adapter/typeorm/builders/CardArrayFromCardDbStringifiedArrayBuilder';
import { GameInitialSnapshotSlotDb } from '../models/GameInitialSnapshotSlotDb';

@Injectable()
export class GameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilder
  implements Builder<GameInitialSnapshotSlot, [GameInitialSnapshotSlotDb]>
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
    gameInitialSnapshotSlotDb: GameInitialSnapshotSlotDb,
  ): GameInitialSnapshotSlot {
    return {
      cards: this.#cardArrayFromCardDbStringifiedArrayBuilder.build(
        gameInitialSnapshotSlotDb.cards,
      ),
      position: gameInitialSnapshotSlotDb.position,
      userId: gameInitialSnapshotSlotDb.userId,
    };
  }
}
