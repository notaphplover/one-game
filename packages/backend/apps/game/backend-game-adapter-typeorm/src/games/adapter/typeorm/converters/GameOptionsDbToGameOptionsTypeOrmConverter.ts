import { Converter } from '@cornie-js/backend-common';
import { GameOptions } from '@cornie-js/backend-game-domain/games';
import { Injectable } from '@nestjs/common';

import { GameOptionsDb } from '../models/GameOptionsDb';

@Injectable()
export class GameOptionsDbToGameOptionsTypeOrmConverter
  implements Converter<GameOptionsDb, GameOptions>
{
  public convert(gameOptionsDb: GameOptionsDb): GameOptions {
    return {
      chainDraw2Draw2Cards: gameOptionsDb.chainDraw2Draw2Cards,
      chainDraw2Draw4Cards: gameOptionsDb.chainDraw2Draw4Cards,
      chainDraw4Draw2Cards: gameOptionsDb.chainDraw4Draw2Cards,
      chainDraw4Draw4Cards: gameOptionsDb.chainDraw4Draw4Cards,
      gameId: gameOptionsDb.gameId,
      id: gameOptionsDb.id,
      playCardIsMandatory: gameOptionsDb.playCardIsMandatory,
      playMultipleSameCards: gameOptionsDb.playMultipleSameCards,
      playWildDraw4IfNoOtherAlternative:
        gameOptionsDb.playWildDraw4IfNoOtherAlternative,
    };
  }
}
