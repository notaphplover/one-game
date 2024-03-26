import { Builder, Publisher } from '@cornie-js/backend-common';
import { GameStatus } from '@cornie-js/backend-game-domain/games';
import {
  MessageEvent,
  SsePublisher,
  SseTeardownExecutor,
} from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

import { GameMessageEventFromStringBuilder } from '../../builders/GameMessageEventFromStringBuilder';
import { MessageEventV1FromGameMessageEventBuilder } from '../../builders/MessageEventV1FromGameMessageEventBuilder';
import { MessageEventV2FromGameMessageEventBuilder } from '../../builders/MessageEventV2FromGameMessageEventBuilder';
import { GameMessageEvent } from '../../models/GameMessageEvent';
import {
  GameEventsSubscriptionOutputPort,
  gameEventsSubscriptionOutputPortSymbol,
} from '../output/GameEventsSubscriptionOutputPort';

@Injectable()
export class GameEventsManagementInputPort {
  readonly #gameEventsSubscriptionOutputPort: GameEventsSubscriptionOutputPort;
  readonly #gameMessageEventFromStringBuilder: Builder<
    GameMessageEvent,
    [string]
  >;
  readonly #messageEventFromGameMessageEventV1Builder: Builder<
    MessageEvent,
    [GameMessageEvent]
  >;
  readonly #messageEventFromGameMessageEventV2Builder: Builder<
    MessageEvent,
    [GameMessageEvent]
  >;

  constructor(
    @Inject(gameEventsSubscriptionOutputPortSymbol)
    gameEventsSubscriptionOutputPort: GameEventsSubscriptionOutputPort,
    @Inject(GameMessageEventFromStringBuilder)
    gameMessageEventFromStringBuilder: Builder<GameMessageEvent, [string]>,
    @Inject(MessageEventV1FromGameMessageEventBuilder)
    messageEventFromGameMessageEventV1Builder: Builder<
      MessageEvent,
      [GameMessageEvent]
    >,
    @Inject(MessageEventV2FromGameMessageEventBuilder)
    messageEventFromGameMessageEventV2Builder: Builder<
      MessageEvent,
      [GameMessageEvent]
    >,
  ) {
    this.#gameEventsSubscriptionOutputPort = gameEventsSubscriptionOutputPort;
    this.#gameMessageEventFromStringBuilder = gameMessageEventFromStringBuilder;
    this.#messageEventFromGameMessageEventV1Builder =
      messageEventFromGameMessageEventV1Builder;
    this.#messageEventFromGameMessageEventV2Builder =
      messageEventFromGameMessageEventV2Builder;
  }

  public async subscribeV1(
    gameId: string,
    ssePublisher: SsePublisher,
  ): Promise<SseTeardownExecutor> {
    const publisher: Publisher<string> = {
      publish: (event: string) => {
        const gameMessageEvent: GameMessageEvent =
          this.#gameMessageEventFromStringBuilder.build(event);

        const messageEvent: MessageEvent =
          this.#messageEventFromGameMessageEventV1Builder.build(
            gameMessageEvent,
          );

        ssePublisher.publish(messageEvent);

        if (gameMessageEvent.game.state.status === GameStatus.finished) {
          ssePublisher.conplete();
        }
      },
    };

    return this.#gameEventsSubscriptionOutputPort.subscribeV1(
      gameId,
      publisher,
    );
  }

  public async subscribeV2(
    gameId: string,
    ssePublisher: SsePublisher,
  ): Promise<SseTeardownExecutor> {
    const publisher: Publisher<string> = {
      publish: (event: string) => {
        const gameMessageEvent: GameMessageEvent =
          this.#gameMessageEventFromStringBuilder.build(event);

        const messageEvent: MessageEvent =
          this.#messageEventFromGameMessageEventV2Builder.build(
            gameMessageEvent,
          );

        ssePublisher.publish(messageEvent);

        if (gameMessageEvent.game.state.status === GameStatus.finished) {
          ssePublisher.conplete();
        }
      },
    };

    return this.#gameEventsSubscriptionOutputPort.subscribeV2(
      gameId,
      publisher,
    );
  }
}
