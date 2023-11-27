import { Converter } from '@cornie-js/backend-common';
import { GameCreateQuery } from '@cornie-js/backend-game-domain/games';
import { Injectable } from '@nestjs/common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { GameDb } from '../models/GameDb';
import { GameStatusDb } from '../models/GameStatusDb';

@Injectable()
export class GameCreateQueryToGameCreateQueryTypeOrmConverter
  implements Converter<GameCreateQuery, QueryDeepPartialEntity<GameDb>>
{
  public convert(
    gameCreateQuery: GameCreateQuery,
  ): QueryDeepPartialEntity<GameDb> {
    const discardPileStringified: string = JSON.stringify([]);

    return {
      currentCard: null,
      currentColor: null,
      currentDirection: null,
      currentPlayingSlotIndex: null,
      currentTurnCardsPlayed: null,
      deck: null,
      discardPile: discardPileStringified,
      gameSlotsAmount: gameCreateQuery.spec.gameSlotsAmount,
      id: gameCreateQuery.id,
      name: gameCreateQuery.name ?? null,
      status: GameStatusDb.nonStarted,
    };
  }
}
