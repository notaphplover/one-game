import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { Game } from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';

import { GameMessageEvent } from '../models/GameMessageEvent';
import { GameV1FromGameBuilder } from './GameV1FromGameBuilder';

@Injectable()
export class GameMessageEventV1FromGameMessageEventBuilder
  implements
    Builder<[string | null, apiModels.GameMessageEventV1], [GameMessageEvent]>
{
  readonly #gameV1FromGameBuilder: Builder<apiModels.GameV1, [Game]>;

  constructor(
    @Inject(GameV1FromGameBuilder)
    gameV1FromGameBuilder: Builder<apiModels.GameV1, [Game]>,
  ) {
    this.#gameV1FromGameBuilder = gameV1FromGameBuilder;
  }

  public build(
    gameMessageEvent: GameMessageEvent,
  ): [string | null, apiModels.GameMessageEventV1] {
    return [
      null,
      {
        game: this.#gameV1FromGameBuilder.build(gameMessageEvent.game),
        kind: 'game-updated',
      },
    ];
  }
}
