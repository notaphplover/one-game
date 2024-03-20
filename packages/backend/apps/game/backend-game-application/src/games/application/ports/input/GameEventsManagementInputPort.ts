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
  readonly #messageEventFromStringifiedGameMessageEventV1Builder: Builder<
    MessageEvent,
    [string]
  >;

  constructor(
    @Inject(gameEventsSubscriptionOutputPortSymbol)
    gameEventsSubscriptionOutputPort: GameEventsSubscriptionOutputPort,
    @Inject(MessageEventFromStringifiedGameMessageEventV1Builder)
    messageEventFromStringifiedGameMessageEventV1Builder: Builder<
      MessageEvent,
      [string]
    >,
  ) {
    this.#gameEventsSubscriptionOutputPort = gameEventsSubscriptionOutputPort;
    this.#messageEventFromStringifiedGameMessageEventV1Builder =
      messageEventFromStringifiedGameMessageEventV1Builder;
  }

  public async subscribeV1(
    gameId: string,
    ssePublisher: SsePublisher,
  ): Promise<SseTeardownExecutor> {
    const publisher: Publisher<string> = {
      publish: (event: string) => {
        const messageEvent: MessageEvent =
          this.#messageEventFromStringifiedGameMessageEventV1Builder.build(
            event,
          );

        ssePublisher.publish(messageEvent);
      },
    };

    return this.#gameEventsSubscriptionOutputPort.subscribeV1(
      gameId,
      publisher,
    );
  }
}
