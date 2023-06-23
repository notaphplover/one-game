import { Converter } from '@cornie-js/backend-common';
import { GameOptionsCreateQuery } from '@cornie-js/backend-game-domain/games';
import { Injectable } from '@nestjs/common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { GameOptionsDb } from '../models/GameOptionsDb';

@Injectable()
export class GameOptionsCreateQueryToGameOptionsCreateQueryTypeOrmConverter
  implements
    Converter<GameOptionsCreateQuery, QueryDeepPartialEntity<GameOptionsDb>>
{
  public convert(
    gameOptionsCreateQuery: GameOptionsCreateQuery,
  ): QueryDeepPartialEntity<GameOptionsDb> {
    return {
      chainDraw2Draw2Cards: gameOptionsCreateQuery.chainDraw2Draw2Cards,
      chainDraw2Draw4Cards: gameOptionsCreateQuery.chainDraw2Draw4Cards,
      chainDraw4Draw2Cards: gameOptionsCreateQuery.chainDraw4Draw2Cards,
      chainDraw4Draw4Cards: gameOptionsCreateQuery.chainDraw4Draw4Cards,
      game: {
        id: gameOptionsCreateQuery.gameId,
      },
      id: gameOptionsCreateQuery.id,
      playCardIsMandatory: gameOptionsCreateQuery.playCardIsMandatory,
      playMultipleSameCards: gameOptionsCreateQuery.playMultipleSameCards,
      playWildDraw4IfNoOtherAlternative:
        gameOptionsCreateQuery.playWildDraw4IfNoOtherAlternative,
    };
  }
}
