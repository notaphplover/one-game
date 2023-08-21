import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { SsePublisher, SseTeardownExecutor } from '@cornie-js/backend-http';

import { GameEventsIoredisSubscriber } from '../subscribers/GameEventsIoredisSubscriber';
import { GameEventsSubscriptionIoredisOutputAdapter } from './GameEventsSubscriptionIoredisOutputAdapter';

describe(GameEventsSubscriptionIoredisOutputAdapter.name, () => {
  let gameEventsIoredisSubscriberMock: jest.Mocked<GameEventsIoredisSubscriber>;

  let gameEventsSubscriptionIoredisOutputAdapter: GameEventsSubscriptionIoredisOutputAdapter;

  beforeAll(() => {
    gameEventsIoredisSubscriberMock = {
      subscribe: jest.fn(),
      unsetGamePublisher: jest.fn(),
    } as Partial<
      jest.Mocked<GameEventsIoredisSubscriber>
    > as jest.Mocked<GameEventsIoredisSubscriber>;

    gameEventsSubscriptionIoredisOutputAdapter =
      new GameEventsSubscriptionIoredisOutputAdapter(
        gameEventsIoredisSubscriberMock,
      );
  });

  describe('.subscribe', () => {
    let channelFixture: string;
    let publisherFixture: SsePublisher;

    beforeAll(() => {
      channelFixture = 'channel fixture';
      publisherFixture = Symbol() as unknown as SsePublisher;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(async () => {
        gameEventsIoredisSubscriberMock.subscribe.mockResolvedValueOnce(
          undefined,
        );

        result = await gameEventsSubscriptionIoredisOutputAdapter.subscribe(
          channelFixture,
          publisherFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
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
