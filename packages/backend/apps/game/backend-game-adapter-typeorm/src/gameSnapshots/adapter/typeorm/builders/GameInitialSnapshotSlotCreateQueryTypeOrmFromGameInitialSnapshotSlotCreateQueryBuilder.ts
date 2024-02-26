import { Builder } from '@cornie-js/backend-common';
import { Card } from '@cornie-js/backend-game-domain/cards';
import { GameInitialSnapshotSlotCreateQuery } from '@cornie-js/backend-game-domain/gameSnapshots';
import { Inject, Injectable } from '@nestjs/common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { CardDbBuilder } from '../../../../cards/adapter/typeorm/builders/CardDbBuilder';
import { CardDb } from '../../../../cards/adapter/typeorm/models/CardDb';
import { GameInitialSnapshotSlotDb } from '../models/GameInitialSnapshotSlotDb';

@Injectable()
export class GameInitialSnapshotSlotCreateQueryTypeOrmFromGameInitialSnapshotSlotCreateQueryBuilder
  implements
    Builder<
      QueryDeepPartialEntity<GameInitialSnapshotSlotDb>,
      [GameInitialSnapshotSlotCreateQuery]
    >
{
  readonly #cardDbBuilder: Builder<CardDb, [Card]>;

  constructor(@Inject(CardDbBuilder) cardDbBuilder: Builder<CardDb, [Card]>) {
    this.#cardDbBuilder = cardDbBuilder;
  }

  public build(
    gameInitialSnapshotSlotCreateQuery: GameInitialSnapshotSlotCreateQuery,
  ): QueryDeepPartialEntity<GameInitialSnapshotSlotDb> {
    return {
      cards: JSON.stringify(
        gameInitialSnapshotSlotCreateQuery.cards.map((card: Card) =>
          this.#cardDbBuilder.build(card),
        ),
      ),
      gameInitialSnapshot: {
        id: gameInitialSnapshotSlotCreateQuery.gameInitialSnapshotId,
      },
      id: gameInitialSnapshotSlotCreateQuery.id,
      position: gameInitialSnapshotSlotCreateQuery.position,
      userId: gameInitialSnapshotSlotCreateQuery.userId,
    };
  }
}
