import { Builder } from '@cornie-js/backend-common';
import { GameCardSpec, GameSpec } from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';

import { GameSpecDb } from '../models/GameSpecDb';
import { GameCardSpecArrayFromGameCardSpecArrayDbBuilder } from './GameCardSpecArrayFromGameCardSpecArrayDbBuilder';

@Injectable()
export class GameSpecFromGameSpecDbBuilder
  implements Builder<GameSpec, [GameSpecDb]>
{
  readonly #gameCardSpecArrayFromGameCardSpecArrayDbBuilder: Builder<
    GameCardSpec[],
    [string]
  >;

  constructor(
    @Inject(GameCardSpecArrayFromGameCardSpecArrayDbBuilder)
    gameCardSpecArrayFromGameCardSpecArrayDbBuilder: Builder<
      GameCardSpec[],
      [string]
    >,
  ) {
    this.#gameCardSpecArrayFromGameCardSpecArrayDbBuilder =
      gameCardSpecArrayFromGameCardSpecArrayDbBuilder;
  }

  public build(gameSpecDb: GameSpecDb): GameSpec {
    return {
      cards: this.#gameCardSpecArrayFromGameCardSpecArrayDbBuilder.build(
        gameSpecDb.cardsSpec,
      ),
      gameId: gameSpecDb.gameId,
      gameSlotsAmount: gameSpecDb.gameSlotsAmount,
      options: {
        chainDraw2Draw2Cards: gameSpecDb.chainDraw2Draw2Cards,
        chainDraw2Draw4Cards: gameSpecDb.chainDraw2Draw4Cards,
        chainDraw4Draw2Cards: gameSpecDb.chainDraw4Draw2Cards,
        chainDraw4Draw4Cards: gameSpecDb.chainDraw4Draw4Cards,
        playCardIsMandatory: gameSpecDb.playCardIsMandatory,
        playMultipleSameCards: gameSpecDb.playMultipleSameCards,
        playWildDraw4IfNoOtherAlternative:
          gameSpecDb.playWildDraw4IfNoOtherAlternative,
      },
    };
  }
}
