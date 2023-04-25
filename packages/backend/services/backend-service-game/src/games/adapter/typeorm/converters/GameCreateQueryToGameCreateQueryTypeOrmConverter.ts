import { Inject, Injectable } from '@nestjs/common';
import { Builder, Converter } from '@one-game-js/backend-common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { CardDbBuilder } from '../../../../cards/adapter/typeorm/builders/CardDbBuilder';
import { CardDb } from '../../../../cards/adapter/typeorm/models/CardDb';
import { Card } from '../../../../cards/domain/models/Card';
import { GameCardSpec } from '../../../domain/models/GameCardSpec';
import { GameCreateQuery } from '../../../domain/query/GameCreateQuery';
import { GameCardSpecDb } from '../models/GameCardSpecDb';
import { GameDb } from '../models/GameDb';

@Injectable()
export class GameCreateQueryToGameCreateQueryTypeOrmConverter
  implements Converter<GameCreateQuery, QueryDeepPartialEntity<GameDb>>
{
  readonly #cardDbBuilder: Builder<CardDb, [Card]>;

  constructor(
    @Inject(CardDbBuilder)
    cardDbBuilder: Builder<CardDb, [Card]>,
  ) {
    this.#cardDbBuilder = cardDbBuilder;
  }

  public convert(
    gameCreateQuery: GameCreateQuery,
  ): QueryDeepPartialEntity<GameDb> {
    const gameCardsStringified: string = JSON.stringify(
      this.#buildCardSpecsDb(gameCreateQuery.spec),
    );

    return {
      active: false,
      currentCard: null,
      currentColor: null,
      currentDirection: null,
      currentPlayingSlotIndex: null,
      deck: gameCardsStringified,
      gameSlotsAmount: gameCreateQuery.gameSlotsAmount,
      id: gameCreateQuery.id,
      spec: gameCardsStringified,
    };
  }

  #buildCardSpecDb(cardSpec: GameCardSpec): GameCardSpecDb {
    return {
      amount: cardSpec.amount,
      card: this.#cardDbBuilder.build(cardSpec.card),
    };
  }

  #buildCardSpecsDb(cardSpecs: GameCardSpec[]): GameCardSpecDb[] {
    return cardSpecs.map(
      (cardSpec: GameCardSpec): GameCardSpecDb =>
        this.#buildCardSpecDb(cardSpec),
    );
  }
}
