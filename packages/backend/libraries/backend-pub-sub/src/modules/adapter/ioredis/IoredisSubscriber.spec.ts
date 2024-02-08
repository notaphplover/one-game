import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import Redis from 'ioredis';

import { IoredisSubscriber } from './IoredisSubscriber';

class IoredisSubscriberMock<
  TContext = void,
> extends IoredisSubscriber<TContext> {
  readonly #handleMessageFromChannelMock: jest.Mock<
    (channel: string, message: string) => Promise<void>
  >;

  constructor(
    redisClient: Redis,
    handleMessageFromChannelMock: jest.Mock<
      (channel: string, message: string) => Promise<void>
    >,
  ) {
    super(redisClient);

    this.#handleMessageFromChannelMock = handleMessageFromChannelMock;
  }

  protected override async _handleMessageFromChannel(
    channel: string,
    message: string,
  ): Promise<void> {
    return this.#handleMessageFromChannelMock(channel, message);
  }
}

describe(IoredisSubscriber.name, () => {
  let handleMessageFromChannelMock: jest.Mock<
    (channel: string, message: string) => Promise<void>
  >;
  let redisClientMock: jest.Mocked<Redis>;

  beforeAll(() => {
    handleMessageFromChannelMock = jest.fn();
    redisClientMock = {
      on: jest.fn() as unknown,
      subscribe: jest.fn() as unknown,
      unsubscribe: jest.fn() as unknown,
    } as Partial<jest.Mocked<Redis>> as jest.Mocked<Redis>;
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('.constructor', () => {
    describe('when redisClientMock.on is called', () => {
      beforeAll(() => {
        jest.clearAllMocks();

        new IoredisSubscriberMock<unknown>(
          redisClientMock,
          handleMessageFromChannelMock,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call redisClient.on()', () => {
        expect(redisClientMock.on).toHaveBeenCalledTimes(1);
        expect(redisClientMock.on).toHaveBeenCalledWith(
          'message',
          expect.any(Function),
        );
      });
    });
  });

  describe('.subscribe', () => {
    describe('when called', () => {
      let channelFixture: string;
      let contextFixture: unknown;

      let ioredisSubscriber: IoredisSubscriber<unknown>;

      let result: unknown;

      beforeAll(async () => {
        channelFixture = 'channel fixture';
        contextFixture = Symbol();

        ioredisSubscriber = new IoredisSubscriberMock<unknown>(
          redisClientMock,
          handleMessageFromChannelMock,
        );

        result = await ioredisSubscriber.subscribe(
          channelFixture,
          contextFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call redisClient.subscribe()', () => {
        expect(redisClientMock.subscribe).toHaveBeenCalledTimes(1);
        expect(redisClientMock.subscribe).toHaveBeenCalledWith(channelFixture);
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when called twice', () => {
      let channelFixture: string;
      let contextFixture: unknown;

      let ioredisSubscriber: IoredisSubscriber<unknown>;

      let result: unknown;

      beforeAll(async () => {
        channelFixture = 'channel fixture';
        contextFixture = Symbol();

        ioredisSubscriber = new IoredisSubscriberMock<unknown>(
          redisClientMock,
          handleMessageFromChannelMock,
        );

        await ioredisSubscriber.subscribe(channelFixture, contextFixture);

        result = await ioredisSubscriber.subscribe(
          channelFixture,
          contextFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call redisClient.subscribe()', () => {
        expect(redisClientMock.subscribe).toHaveBeenCalledTimes(1);
        expect(redisClientMock.subscribe).toHaveBeenCalledWith(channelFixture);
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('.unsubscribe', () => {
    describe('when called', () => {
      let channelFixture: string;

      let ioredisSubscriber: IoredisSubscriber<unknown>;

      let result: unknown;

      beforeAll(async () => {
        channelFixture = 'channel fixture';

        ioredisSubscriber = new IoredisSubscriberMock<unknown>(
          redisClientMock,
          handleMessageFromChannelMock,
        );

        result = await ioredisSubscriber.unsubscribe(channelFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call redisClient.unsubscribe()', () => {
        expect(redisClientMock.unsubscribe).not.toHaveBeenCalled();
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when called, after ioredisSubscriber.subscribe() is called', () => {
      let channelFixture: string;
      let contextFixture: unknown;

      let ioredisSubscriber: IoredisSubscriber<unknown>;

      let result: unknown;

      beforeAll(async () => {
        channelFixture = 'channel fixture';
        contextFixture = Symbol();

        ioredisSubscriber = new IoredisSubscriberMock<unknown>(
          redisClientMock,
          handleMessageFromChannelMock,
        );

        await ioredisSubscriber.subscribe(channelFixture, contextFixture);
        result = await ioredisSubscriber.unsubscribe(channelFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call redisClient.unsubscribe()', () => {
        expect(redisClientMock.unsubscribe).toHaveBeenCalledTimes(1);
        expect(redisClientMock.unsubscribe).toHaveBeenCalledWith(
          channelFixture,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when called twice, after ioredisSubscriber.subscribe() is called', () => {
      let channelFixture: string;
      let contextFixture: unknown;

      let ioredisSubscriber: IoredisSubscriber<unknown>;

      let result: unknown;

      beforeAll(async () => {
        channelFixture = 'channel fixture';
        contextFixture = Symbol();

        ioredisSubscriber = new IoredisSubscriberMock<unknown>(
          redisClientMock,
          handleMessageFromChannelMock,
        );

        await ioredisSubscriber.subscribe(channelFixture, contextFixture);
        await ioredisSubscriber.unsubscribe(channelFixture);

        result = await ioredisSubscriber.unsubscribe(channelFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call redisClient.unsubscribe()', () => {
        expect(redisClientMock.unsubscribe).toHaveBeenCalledTimes(1);
        expect(redisClientMock.unsubscribe).toHaveBeenCalledWith(
          channelFixture,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
