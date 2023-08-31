import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import Redis from 'ioredis';

import { IoredisPublisher } from './IoredisPublisher';

describe(IoredisPublisher.name, () => {
  let redisClientMock: jest.Mocked<Redis>;

  let ioredisPublisher: IoredisPublisher;

  beforeAll(() => {
    redisClientMock = {
      publish: jest.fn(),
    } as Partial<jest.Mocked<Redis>> as jest.Mocked<Redis>;

    ioredisPublisher = new IoredisPublisher(redisClientMock);
  });

  describe('.publish', () => {
    let channelFixture: string;
    let messageFixture: string;

    beforeAll(() => {
      channelFixture = 'channel-fixture';
      messageFixture = 'message-fixture';
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(async () => {
        redisClientMock.publish.mockResolvedValueOnce(0);

        result = await ioredisPublisher.publish(channelFixture, messageFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call redisClient.publish()', () => {
        expect(redisClientMock.publish).toHaveBeenCalledTimes(1);
        expect(redisClientMock.publish).toHaveBeenCalledWith(
          channelFixture,
          messageFixture,
        );
      });

      it('should resolve to undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
