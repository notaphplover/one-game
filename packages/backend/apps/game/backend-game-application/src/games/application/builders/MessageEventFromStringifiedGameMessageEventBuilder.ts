import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { Inject, Injectable, MessageEvent } from '@nestjs/common';

import { GameMessageEvent } from '../models/GameMessageEvent';
import { GameMessageEventV1FromGameMessageEventBuilder } from './GameMessageEventV1FromGameMessageEventBuilder';

@Injectable()
export class MessageEventFromStringifiedGameMessageEventBuilder
  implements Builder<MessageEvent, [string]>
{
  readonly #gameMessageEventV1FromGameMessageEventBuilder: Builder<
    apiModels.GameMessageEventV1,
    [GameMessageEvent]
  >;

  constructor(
    @Inject(GameMessageEventV1FromGameMessageEventBuilder)
    gameMessageEventV1FromGameMessageEventBuilder: Builder<
      apiModels.GameMessageEventV1,
      [GameMessageEvent]
    >,
  ) {
    this.#gameMessageEventV1FromGameMessageEventBuilder =
      gameMessageEventV1FromGameMessageEventBuilder;
  }

  public build(stringifiedGameMessageEvent: string): MessageEvent {
    const gameMessageEvent: GameMessageEvent = JSON.parse(
      stringifiedGameMessageEvent,
    ) as GameMessageEvent;

    const gameMessageEventV1: apiModels.GameMessageEventV1 =
      this.#gameMessageEventV1FromGameMessageEventBuilder.build(
        gameMessageEvent,
      );

    return {
      data: JSON.stringify(gameMessageEventV1),
    };
  }
}
