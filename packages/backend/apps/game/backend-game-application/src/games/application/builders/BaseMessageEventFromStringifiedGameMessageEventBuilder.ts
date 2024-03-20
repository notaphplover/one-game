import { Builder } from '@cornie-js/backend-common';
import { MessageEvent } from '@nestjs/common';

import { GameMessageEvent } from '../models/GameMessageEvent';

export class BaseMessageEventFromStringifiedMessageBuilder<T>
  implements Builder<MessageEvent, [string]>
{
  readonly #gameMessageEventFromStringifiedMessageBuilder: Builder<
    [string | null, T],
    [GameMessageEvent]
  >;

  constructor(
    gameMessageEventFromStringifiedMessageBuilder: Builder<
      [string | null, T],
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

    const [id, messageEventData]: [string | null, T] =
      this.#gameMessageEventFromStringifiedMessageBuilder.build(
        gameMessageEvent,
      );

    const messageEvent: MessageEvent = {
      data: JSON.stringify(messageEventData),
    };

    if (id !== null) {
      messageEvent.id = id;
    }

    return messageEvent;
  }
}
