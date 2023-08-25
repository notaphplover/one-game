import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Builder } from '@cornie-js/backend-common';
import { SsePublisher, SseTeardownExecutor } from '@cornie-js/backend-http';

import { GameEventsIoredisSubscriber } from '../subscribers/GameEventsIoredisSubscriber';
import { GameEventsSubscriptionIoredisOutputAdapter } from './GameEventsSubscriptionIoredisOutputAdapter';

describe(GameEventsSubscriptionIoredisOutputAdapter.name, () => {
  let gameEventsChannelFromGameIdBuilderMock: jest.Mocked<
    Builder<string, [string]>
  >;
  let gameEventsIoredisSubscriberMock: jest.Mocked<GameEventsIoredisSubscriber>;

  let gameEventsSubscriptionIoredisOutputAdapter: GameEventsSubscriptionIoredisOutputAdapter;

  beforeAll(() => {
    gameEventsChannelFromGameIdBuilderMock = {
      build: jest.fn(),
    };
    gameEventsIoredisSubscriberMock = {
      subscribe: jest.fn(),
      unsetGamePublisher: jest.fn(),
    } as Partial<
      jest.Mocked<GameEventsIoredisSubscriber>
    > as jest.Mocked<GameEventsIoredisSubscriber>;

    gameEventsSubscriptionIoredisOutputAdapter =
      new GameEventsSubscriptionIoredisOutputAdapter(
        gameEventsChannelFromGameIdBuilderMock,
        gameEventsIoredisSubscriberMock,
      );
  });

  describe('.subscribe', () => {
    let gameIdFixture: string;
    let channelFixture: string;
    let publisherFixture: SsePublisher;

    beforeAll(() => {
      gameIdFixture = 'game id';
      channelFixture = 'channel fixture';
      publisherFixture = Symbol() as unknown as SsePublisher;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(async () => {
        gameEventsChannelFromGameIdBuilderMock.build.mockReturnValueOnce(
          channelFixture,
        );
        gameEventsIoredisSubscriberMock.subscribe.mockResolvedValueOnce(
          undefined,
        );

        result = await gameEventsSubscriptionIoredisOutputAdapter.subscribe(
          gameIdFixture,
          publisherFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gameEventsChannelFromGameIdBuilder.build()', () => {
        expect(
          gameEventsChannelFromGameIdBuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameEventsChannelFromGameIdBuilderMock.build,
        ).toHaveBeenCalledWith(gameIdFixture);
      });

      it('should call gameEventsIoredisSubscriber.subscribe()', () => {
        expect(gameEventsIoredisSubscriberMock.subscribe).toHaveBeenCalledTimes(
          1,
        );
        expect(gameEventsIoredisSubscriberMock.subscribe).toHaveBeenCalledWith(
          channelFixture,
          publisherFixture,
        );
      });

      it('should return an SseTeardownExecutor', () => {
        const expected: SseTeardownExecutor = {
          teardown: expect.any(Function) as unknown as () => void,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
