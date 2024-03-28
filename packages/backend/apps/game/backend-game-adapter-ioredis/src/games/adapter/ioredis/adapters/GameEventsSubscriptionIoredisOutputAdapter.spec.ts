import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Builder, PublisherAsync } from '@cornie-js/backend-common';
import { GameMessageEvent } from '@cornie-js/backend-game-application/games';
import { SseTeardownExecutor } from '@cornie-js/backend-http';
import { IoredisPublisher } from '@cornie-js/backend-pub-sub';

import { GameEventsIoredisSubscriber } from '../subscribers/GameEventsIoredisSubscriber';
import { GameEventsSubscriptionIoredisOutputAdapter } from './GameEventsSubscriptionIoredisOutputAdapter';

describe(GameEventsSubscriptionIoredisOutputAdapter.name, () => {
  let gameEventsChannelFromGameIdBuilderMock: jest.Mocked<
    Builder<string, [string, number]>
  >;
  let gameEventsIoredisSubscriberMock: jest.Mocked<GameEventsIoredisSubscriber>;
  let ioredisPublisherMock: jest.Mocked<IoredisPublisher>;

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
    ioredisPublisherMock = {
      publish: jest.fn(),
    } as Partial<
      jest.Mocked<IoredisPublisher>
    > as jest.Mocked<IoredisPublisher>;

    gameEventsSubscriptionIoredisOutputAdapter =
      new GameEventsSubscriptionIoredisOutputAdapter(
        gameEventsChannelFromGameIdBuilderMock,
        gameEventsIoredisSubscriberMock,
        ioredisPublisherMock,
      );
  });

  describe('.publishV1', () => {
    let gameIdFixture: string;
    let channelFixture: string;
    let gameMessageEventFixture: GameMessageEvent;

    beforeAll(() => {
      gameIdFixture = 'game id';
      channelFixture = 'channel fixture';
      gameMessageEventFixture = Symbol() as unknown as GameMessageEvent;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(async () => {
        gameEventsChannelFromGameIdBuilderMock.build.mockReturnValueOnce(
          channelFixture,
        );

        result = await gameEventsSubscriptionIoredisOutputAdapter.publishV1(
          gameIdFixture,
          gameMessageEventFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call ioredisPublisher.publish()', () => {
        expect(ioredisPublisherMock.publish).toHaveBeenCalledTimes(1);
        expect(ioredisPublisherMock.publish).toHaveBeenCalledWith(
          channelFixture,
          JSON.stringify(gameMessageEventFixture),
        );
      });

      it('should resolve to undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('.publishV2', () => {
    let gameIdFixture: string;
    let channelFixture: string;
    let gameMessageEventFixture: GameMessageEvent;

    beforeAll(() => {
      gameIdFixture = 'game id';
      channelFixture = 'channel fixture';
      gameMessageEventFixture = Symbol() as unknown as GameMessageEvent;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(async () => {
        gameEventsChannelFromGameIdBuilderMock.build.mockReturnValueOnce(
          channelFixture,
        );

        result = await gameEventsSubscriptionIoredisOutputAdapter.publishV2(
          gameIdFixture,
          gameMessageEventFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call ioredisPublisher.publish()', () => {
        expect(ioredisPublisherMock.publish).toHaveBeenCalledTimes(1);
        expect(ioredisPublisherMock.publish).toHaveBeenCalledWith(
          channelFixture,
          JSON.stringify(gameMessageEventFixture),
        );
      });

      it('should resolve to undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('.subscribeV1', () => {
    let gameIdFixture: string;
    let channelFixture: string;
    let publisherFixture: PublisherAsync<string>;

    beforeAll(() => {
      gameIdFixture = 'game id';
      channelFixture = 'channel fixture';
      publisherFixture = Symbol() as unknown as PublisherAsync<string>;
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

        result = await gameEventsSubscriptionIoredisOutputAdapter.subscribeV1(
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
        ).toHaveBeenCalledWith(gameIdFixture, 1);
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

  describe('.subscribeV2', () => {
    let gameIdFixture: string;
    let channelFixture: string;
    let publisherFixture: PublisherAsync<string>;

    beforeAll(() => {
      gameIdFixture = 'game id';
      channelFixture = 'channel fixture';
      publisherFixture = Symbol() as unknown as PublisherAsync<string>;
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

        result = await gameEventsSubscriptionIoredisOutputAdapter.subscribeV2(
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
        ).toHaveBeenCalledWith(gameIdFixture, 2);
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
