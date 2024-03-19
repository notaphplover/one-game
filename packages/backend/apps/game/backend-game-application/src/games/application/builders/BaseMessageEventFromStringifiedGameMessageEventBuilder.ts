import { Builder } from '@cornie-js/backend-common';
import { MessageEvent } from '@nestjs/common';

import { GameMessageEvent } from '../models/GameMessageEvent';

export class BaseMessageEventFromStringifiedMessageBuilder<T>
  implements Builder<MessageEvent, [string]>
{
  readonly #gameMessageEventFromStringifiedMessageBuilder: Builder<
    T,
    [GameMessageEvent]
  >;

  constructor(
    gameMessageEventFromStringifiedMessageBuilder: Builder<
      T,
      [GameMessageEvent]
    >,
  ) {
    this.#gameMessageEventFromStringifiedMessageBuilder =
      gameMessageEventFromStringifiedMessageBuilder;
  }

  public build(stringifiedGameMessageEvent: string): MessageEvent {
    const gameMessageEvent: GameMessageEvent = JSON.parse(
      stringifiedGameMessageEvent,
    ) as GameMessageEvent;

    const messageEvent: T =
      this.#gameMessageEventFromStringifiedMessageBuilder.build(
        gameMessageEvent,
      );

    return {
      data: JSON.stringify(messageEvent),
    };
  }
}
