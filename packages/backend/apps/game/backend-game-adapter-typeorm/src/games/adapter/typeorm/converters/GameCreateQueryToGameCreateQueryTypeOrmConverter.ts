import { Converter } from '@cornie-js/backend-common';
import {
  GameCardSpec,
  GameCreateQuery,
} from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { GameDb } from '../models/GameDb';
import { GameStatusDb } from '../models/GameStatusDb';
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
        gameCreateQuery.spec.cards,
      );

    const discardPileStringified: string = JSON.stringify([]);

    return {
      currentCard: null,
      currentColor: null,
      currentDirection: null,
      currentPlayingSlotIndex: null,
      currentTurnCardsPlayed: null,
      deck: gameCardsStringified,
      discardPile: discardPileStringified,
      gameSlotsAmount: gameCreateQuery.spec.gameSlotsAmount,
      id: gameCreateQuery.id,
      spec: gameCardsStringified,
      status: GameStatusDb.nonStarted,
    };
  }
}
