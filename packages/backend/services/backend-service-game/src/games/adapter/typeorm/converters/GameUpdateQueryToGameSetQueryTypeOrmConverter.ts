import { Builder, Converter } from '@cornie-js/backend-common';
import { Inject, Injectable } from '@nestjs/common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { CardColorDbBuilder } from '../../../../cards/adapter/typeorm/builders/CardColorDbBuilder';
import { CardDbBuilder } from '../../../../cards/adapter/typeorm/builders/CardDbBuilder';
import { CardColorDb } from '../../../../cards/adapter/typeorm/models/CardColorDb';
import { CardDb } from '../../../../cards/adapter/typeorm/models/CardDb';
import { Card } from '../../../../cards/domain/models/Card';
import { CardColor } from '../../../../cards/domain/models/CardColor';
import { Writable } from '../../../../foundation/common/application/models/Writable';
import { GameCardSpec } from '../../../domain/models/GameCardSpec';
import { GameDirection } from '../../../domain/models/GameDirection';
import { GameUpdateQuery } from '../../../domain/query/GameUpdateQuery';
import { GameDb } from '../models/GameDb';
import { GameDirectionDb } from '../models/GameDirectionDb';
import { GameCardSpecArrayToGameCardSpecArrayDbConverter } from './GameCardSpecArrayToGameCardSpecArrayDbConverter';
import { GameDirectionToGameDirectionDbConverter } from './GameDirectionToGameDirectionDbConverter';

@Injectable()
export class GameUpdateQueryToGameSetQueryTypeOrmConverter
  implements Converter<GameUpdateQuery, QueryDeepPartialEntity<GameDb>>
{
  readonly #cardColorDbBuilder: Builder<CardColorDb, [CardColor]>;
  readonly #cardDbBuilder: Builder<CardDb, [Card]>;
  readonly #gameCardSpecArrayToGameCardSpecArrayDbConverter: Converter<
    GameCardSpec[],
    string
  >;
  readonly #gameDirectionToGameDirectionDbConverter: Converter<
    GameDirection,
    GameDirectionDb
  >;

  constructor(
    @Inject(CardColorDbBuilder)
    cardColorDbBuilder: Builder<CardColorDb, [CardColor]>,
    @Inject(CardDbBuilder)
    cardDbBuilder: Builder<CardDb, [Card]>,
    @Inject(GameCardSpecArrayToGameCardSpecArrayDbConverter)
    gameCardSpecArrayToGameCardSpecArrayDbConverter: Converter<
      GameCardSpec[],
      string
    >,
    @Inject(GameDirectionToGameDirectionDbConverter)
    gameDirectionToGameDirectionDbConverter: Converter<
      GameDirection,
      GameDirectionDb
    >,
  ) {
    this.#cardColorDbBuilder = cardColorDbBuilder;
    this.#cardDbBuilder = cardDbBuilder;
    this.#gameCardSpecArrayToGameCardSpecArrayDbConverter =
      gameCardSpecArrayToGameCardSpecArrayDbConverter;
    this.#gameDirectionToGameDirectionDbConverter =
      gameDirectionToGameDirectionDbConverter;
  }

  public convert(
    gameUpdateQuery: GameUpdateQuery,
  ): QueryDeepPartialEntity<GameDb> {
    const gameSetQueryTypeOrm: Writable<QueryDeepPartialEntity<GameDb>> = {};

    if (gameUpdateQuery.active !== undefined) {
      gameSetQueryTypeOrm.active = gameUpdateQuery.active;
    }

    if (gameUpdateQuery.currentCard !== undefined) {
      gameSetQueryTypeOrm.currentCard = this.#cardDbBuilder.build(
        gameUpdateQuery.currentCard,
      );
    }

    if (gameUpdateQuery.currentColor !== undefined) {
      gameSetQueryTypeOrm.currentColor = this.#cardColorDbBuilder.build(
        gameUpdateQuery.currentColor,
      );
      this.#cardColorDbBuilder.build(gameUpdateQuery.currentColor);
    }

    if (gameUpdateQuery.currentDirection !== undefined) {
      gameSetQueryTypeOrm.currentDirection =
        this.#gameDirectionToGameDirectionDbConverter.convert(
          gameUpdateQuery.currentDirection,
        );
    }

    if (gameUpdateQuery.currentPlayingSlotIndex !== undefined) {
      gameSetQueryTypeOrm.currentPlayingSlotIndex =
        gameUpdateQuery.currentPlayingSlotIndex;
    }

    if (gameUpdateQuery.deck !== undefined) {
      gameSetQueryTypeOrm.deck =
        this.#gameCardSpecArrayToGameCardSpecArrayDbConverter.convert(
          gameUpdateQuery.deck,
        );
    }

    return gameSetQueryTypeOrm;
  }
}
