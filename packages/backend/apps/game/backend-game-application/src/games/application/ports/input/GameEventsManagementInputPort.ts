import {
  AppError,
  AppErrorKind,
  Builder,
  PublisherAsync,
} from '@cornie-js/backend-common';
import {
  Game,
  GameEventsCanBeObservedSpec,
  GameStatus,
} from '@cornie-js/backend-game-domain/games';
import {
  MessageEvent,
  SsePublisher,
  SseTeardownExecutor,
} from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

import { GameMessageEventFromStringBuilder } from '../../builders/GameMessageEventFromStringBuilder';
import { MessageEventV2FromGameMessageEventBuilder } from '../../builders/MessageEventV2FromGameMessageEventBuilder';
import { GameMessageEvent } from '../../models/GameMessageEvent';
import {
  GameEventsSubscriptionOutputPort,
  gameEventsSubscriptionOutputPortSymbol,
} from '../output/GameEventsSubscriptionOutputPort';

@Injectable()
export class GameEventsManagementInputPort {
  readonly #gameEventsCanBeObservedSpec: GameEventsCanBeObservedSpec;
  readonly #gameEventsSubscriptionOutputPort: GameEventsSubscriptionOutputPort;
  readonly #gameMessageEventFromStringBuilder: Builder<
    GameMessageEvent,
    [string]
  >;
  readonly #messageEventFromGameMessageEventV2Builder: Builder<
    MessageEvent,
    [GameMessageEvent]
  >;

  constructor(
    @Inject(GameEventsCanBeObservedSpec)
    gameEventsCanBeObservedSpec: GameEventsCanBeObservedSpec,
    @Inject(gameEventsSubscriptionOutputPortSymbol)
    gameEventsSubscriptionOutputPort: GameEventsSubscriptionOutputPort,
    @Inject(GameMessageEventFromStringBuilder)
    gameMessageEventFromStringBuilder: Builder<GameMessageEvent, [string]>,
    @Inject(MessageEventV2FromGameMessageEventBuilder)
    messageEventFromGameMessageEventV2Builder: Builder<
      MessageEvent,
      [GameMessageEvent]
    >,
  ) {
    this.#gameEventsCanBeObservedSpec = gameEventsCanBeObservedSpec;
    this.#gameEventsSubscriptionOutputPort = gameEventsSubscriptionOutputPort;
    this.#gameMessageEventFromStringBuilder = gameMessageEventFromStringBuilder;
    this.#messageEventFromGameMessageEventV2Builder =
      messageEventFromGameMessageEventV2Builder;
  }

  public async subscribeV2(
    game: Game,
    ssePublisher: SsePublisher,
  ): Promise<SseTeardownExecutor> {
    this.#assertGameEventsCanBeObserved(game);

    const publisher: PublisherAsync<string> = {
      publish: async (event: string): Promise<void> => {
        const gameMessageEvent: GameMessageEvent =
          this.#gameMessageEventFromStringBuilder.build(event);

        const messageEvent: MessageEvent =
          this.#messageEventFromGameMessageEventV2Builder.build(
            gameMessageEvent,
          );

        await ssePublisher.publish(messageEvent);

        if (gameMessageEvent.game.state.status === GameStatus.finished) {
          await ssePublisher.conplete();
        }
      },
    };

    return this.#gameEventsSubscriptionOutputPort.subscribeV2(
      game.id,
      publisher,
    );
  }

  #assertGameEventsCanBeObserved(game: Game): void {
    if (!this.#gameEventsCanBeObservedSpec.isSatisfiedBy(game)) {
      throw new AppError(
        AppErrorKind.unprocessableOperation,
        `Game "${game.id}" events cannot be observed`,
      );
    }
  }
}
