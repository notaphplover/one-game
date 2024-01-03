import { Builder } from '@cornie-js/backend-common';
import {
  GameCardSpec,
  GameSpecCreateQuery,
} from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';
import { DeepPartial } from 'typeorm';

import { GameSpecDb } from '../models/GameSpecDb';
import { GameCardSpecArrayDbFromGameCardSpecArrayBuilder } from './GameCardSpecArrayDbFromGameCardSpecArrayBuilder';

@Injectable()
export class GameSpecCreateQueryTypeormFromGameGameSpecCreateQueryBuilder
  implements Builder<DeepPartial<GameSpecDb>, [GameSpecCreateQuery]>
{
  readonly #gameCardSpecArrayDbFromGameCardSpecArrayBuilder: Builder<
    string,
    [GameCardSpec[]]
  >;

  constructor(
    @Inject(GameCardSpecArrayDbFromGameCardSpecArrayBuilder)
    gameCardSpecArrayDbFromGameCardSpecArrayBuilder: Builder<
      string,
      [GameCardSpec[]]
    >,
  ) {
    this.#gameCardSpecArrayDbFromGameCardSpecArrayBuilder =
      gameCardSpecArrayDbFromGameCardSpecArrayBuilder;
  }

  public build(
    gameSpecCreateQuery: GameSpecCreateQuery,
  ): DeepPartial<GameSpecDb> {
    const gameCardsStringified: string =
      this.#gameCardSpecArrayDbFromGameCardSpecArrayBuilder.build(
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
