import { Builder, Publisher } from '@cornie-js/backend-common';
import {
  MessageEvent,
  SsePublisher,
  SseTeardownExecutor,
} from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

import { MessageEventFromStringifiedGameMessageEventBuilder } from '../../builders/MessageEventFromStringifiedGameMessageEventBuilder';
import { GameMessageEvent } from '../../models/GameMessageEvent';
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
    @Inject(MessageEventFromStringifiedGameMessageEventBuilder)
    messageEventFromStringifiedGameMessageEventBuilder: Builder<
      MessageEvent,
      [string]
    >,
  ) {
    this.#gameEventsSubscriptionOutputPort = gameEventsSubscriptionOutputPort;
    this.#messageEventFromStringifiedGameMessageEventBuilder =
      messageEventFromStringifiedGameMessageEventBuilder;
  }

  public async publish(
    gameId: string,
    gameMessageEvent: GameMessageEvent,
  ): Promise<void> {
    return this.#gameEventsSubscriptionOutputPort.publish(
      gameId,
      gameMessageEvent,
    );
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
