import { Builder, Publisher } from '@cornie-js/backend-common';
import {
  MessageEvent,
  SsePublisher,
  SseTeardownExecutor,
} from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

import { MessageEventFromStringifiedGameMessageEventV1Builder } from '../../builders/MessageEventFromStringifiedGameMessageEventV1Builder';
import {
  GameEventsSubscriptionOutputPort,
  gameEventsSubscriptionOutputPortSymbol,
} from '../output/GameEventsSubscriptionOutputPort';

@Injectable()
export class GameEventsManagementInputPort {
  readonly #gameEventsSubscriptionOutputPort: GameEventsSubscriptionOutputPort;
  readonly #messageEventFromStringifiedGameMessageEventBuilder: Builder<
    MessageEvent,
    [string]
  >;

  constructor(
    @Inject(gameEventsSubscriptionOutputPortSymbol)
    gameEventsSubscriptionOutputPort: GameEventsSubscriptionOutputPort,
    @Inject(MessageEventFromStringifiedGameMessageEventV1Builder)
    messageEventFromStringifiedGameMessageEventBuilder: Builder<
      MessageEvent,
      [string]
    >,
  ) {
    this.#gameEventsSubscriptionOutputPort = gameEventsSubscriptionOutputPort;
    this.#messageEventFromStringifiedGameMessageEventBuilder =
      messageEventFromStringifiedGameMessageEventBuilder;
  }

  public async subscribe(
    gameId: string,
    ssePublisher: SsePublisher,
  ): Promise<SseTeardownExecutor> {
    const publisher: Publisher<string> = {
      publish: (event: string) => {
        const messageEvent: MessageEvent =
          this.#messageEventFromStringifiedGameMessageEventBuilder.build(event);

        ssePublisher.publish(messageEvent);
      },
    };

    return this.#gameEventsSubscriptionOutputPort.subscribe(gameId, publisher);
  }
}
