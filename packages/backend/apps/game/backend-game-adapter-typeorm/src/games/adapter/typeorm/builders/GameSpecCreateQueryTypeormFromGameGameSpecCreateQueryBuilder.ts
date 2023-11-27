import { Builder, Converter } from '@cornie-js/backend-common';
import {
  GameCardSpec,
  GameSpecCreateQuery,
} from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';
import { DeepPartial } from 'typeorm';

import { GameCardSpecArrayToGameCardSpecArrayDbConverter } from '../converters/GameCardSpecArrayToGameCardSpecArrayDbConverter';
import { GameSpecDb } from '../models/GameSpecDb';

@Injectable()
export class GameSpecCreateQueryTypeormFromGameGameSpecCreateQueryBuilder
  implements Builder<DeepPartial<GameSpecDb>, [GameSpecCreateQuery]>
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

  public build(
    gameSpecCreateQuery: GameSpecCreateQuery,
  ): DeepPartial<GameSpecDb> {
    const gameCardsStringified: string =
      this.#gameCardSpecArrayToGameCardSpecArrayDbConverter.convert(
        gameSpecCreateQuery.cards,
      );

    return {
      cardsSpec: gameCardsStringified,
      chainDraw2Draw2Cards: gameSpecCreateQuery.options.chainDraw2Draw2Cards,
      chainDraw2Draw4Cards: gameSpecCreateQuery.options.chainDraw2Draw4Cards,
      chainDraw4Draw2Cards: gameSpecCreateQuery.options.chainDraw4Draw2Cards,
      chainDraw4Draw4Cards: gameSpecCreateQuery.options.chainDraw4Draw4Cards,
      game: {
        id: gameSpecCreateQuery.gameId,
      },
      gameSlotsAmount: gameSpecCreateQuery.gameSlotsAmount,
      id: gameSpecCreateQuery.id,
      playCardIsMandatory: gameSpecCreateQuery.options.playCardIsMandatory,
      playMultipleSameCards: gameSpecCreateQuery.options.playMultipleSameCards,
      playWildDraw4IfNoOtherAlternative:
        gameSpecCreateQuery.options.playWildDraw4IfNoOtherAlternative,
    };
  }
}
