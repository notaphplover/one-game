import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { Game } from '@cornie-js/backend-game-domain/games';
import { Injectable } from '@nestjs/common';

import { GameMessageEvent } from '../models/GameMessageEvent';

@Injectable()
export class GameMessageEventV1FromGameMessageEventBuilder
  implements Builder<apiModels.GameMessageEventV1, [GameMessageEvent]>
{
  readonly #gameV1FromGameBuilder: Builder<apiModels.GameV1, [Game]>;

  constructor(gameV1FromGameBuilder: Builder<apiModels.GameV1, [Game]>) {
    this.#gameV1FromGameBuilder = gameV1FromGameBuilder;
  }

  public build(
    gameMessageEvent: GameMessageEvent,
  ): apiModels.GameMessageEventV1 {
    return {
      game: this.#gameV1FromGameBuilder.build(gameMessageEvent.game),
      kind: 'game-updated',
    };
  }
}
