import { Builder, Writable } from '@cornie-js/backend-common';
import { Card } from '@cornie-js/backend-game-domain/cards';
import { GameSlotUpdateQuery } from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { CardDbBuilder } from '../../../../cards/adapter/typeorm/builders/CardDbBuilder';
import { CardDb } from '../../../../cards/adapter/typeorm/models/CardDb';
import { GameSlotDb } from '../models/GameSlotDb';

@Injectable()
export class GameSlotSetQueryTypeOrmFromGameSlotUpdateQueryBuilder
  implements Builder<QueryDeepPartialEntity<GameSlotDb>, [GameSlotUpdateQuery]>
{
  readonly #cardDbBuilder: Builder<CardDb, [Card]>;

  constructor(
    @Inject(CardDbBuilder)
    cardDbBuilder: Builder<CardDb, [Card]>,
  ) {
    this.#cardDbBuilder = cardDbBuilder;
  }

  public build(
    gameSlotUpdateQuery: GameSlotUpdateQuery,
  ): QueryDeepPartialEntity<GameSlotDb> {
    const gameSlotSetTypeOrmQuery: Writable<
      QueryDeepPartialEntity<GameSlotDb>
    > = {};

    if (gameSlotUpdateQuery.cards !== undefined) {
      gameSlotSetTypeOrmQuery.cards = JSON.stringify(
        gameSlotUpdateQuery.cards.map((card: Card) =>
          this.#cardDbBuilder.build(card),
        ),
      );
    }

    return gameSlotSetTypeOrmQuery;
  }
}
