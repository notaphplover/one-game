import {
  GameCardSpec,
  GameCreateQuery,
} from '@cornie-js/backend-app-game-models/games/domain';
import { Converter } from '@cornie-js/backend-common';
import { Inject, Injectable } from '@nestjs/common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { GameDb } from '../models/GameDb';
import { GameCardSpecArrayToGameCardSpecArrayDbConverter } from './GameCardSpecArrayToGameCardSpecArrayDbConverter';

@Injectable()
export class GameCreateQueryToGameCreateQueryTypeOrmConverter
  implements Converter<GameCreateQuery, QueryDeepPartialEntity<GameDb>>
{
  readonly #gameCardSpecArrayToGameCardSpecArrayDbConverter: Converter<
    GameCardSpec[],
    string
  >;

  constructor(
    @Inject(GameCardSpecArrayToGameCardSpecArrayDbConverter)
    gameCardSpecArrayToGameCardSpecArrayDbConverter: Converter<
      GameCardSpec[],
      string
    >,
  ) {
    this.#gameCardSpecArrayToGameCardSpecArrayDbConverter =
      gameCardSpecArrayToGameCardSpecArrayDbConverter;
  }

  public convert(
    gameCreateQuery: GameCreateQuery,
  ): QueryDeepPartialEntity<GameDb> {
    const gameCardsStringified: string =
      this.#gameCardSpecArrayToGameCardSpecArrayDbConverter.convert(
        gameCreateQuery.spec,
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
}
