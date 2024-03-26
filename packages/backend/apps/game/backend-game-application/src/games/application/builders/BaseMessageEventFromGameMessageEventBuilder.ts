import { Builder } from '@cornie-js/backend-common';
import { MessageEvent } from '@cornie-js/backend-http';

import { GameMessageEvent } from '../models/GameMessageEvent';

export class BaseMessageEventFromGameMessageEventBuilder<T>
  implements Builder<MessageEvent, [GameMessageEvent]>
{
  readonly #messageEventFieldsFromGameMessageBuilder: Builder<
    [string | null, T],
    [GameMessageEvent]
  >;

  constructor(
    messageEventFieldsFromGameMessageBuilder: Builder<
      [string | null, T],
      [GameMessageEvent]
    >,
  ) {
    this.#messageEventFieldsFromGameMessageBuilder =
      messageEventFieldsFromGameMessageBuilder;
  }

  public build(gameMessageEvent: GameMessageEvent): MessageEvent {
    const [id, messageEventData]: [string | null, T] =
      this.#messageEventFieldsFromGameMessageBuilder.build(gameMessageEvent);

    const messageEvent: MessageEvent = {
      data: JSON.stringify(messageEventData),
    };

    if (id !== null) {
      messageEvent.id = id;
    }

    return messageEvent;
  }
}
