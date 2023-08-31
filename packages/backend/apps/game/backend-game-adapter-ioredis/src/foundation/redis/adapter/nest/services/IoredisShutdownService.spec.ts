import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import Redis from 'ioredis';

import { IoredisShutdownService } from './IoredisShutDownService';

describe(IoredisShutdownService.name, () => {
  let redisClientMock: jest.Mocked<Redis>;
  let redisClientSubscriberMock: jest.Mocked<Redis>;
  let ioredisShutdownService: IoredisShutdownService;

  beforeAll(() => {
    redisClientMock = {
      quit: jest.fn(),
    } as Partial<jest.Mocked<Redis>> as jest.Mocked<Redis>;
    redisClientSubscriberMock = {
      quit: jest.fn(),
    } as Partial<jest.Mocked<Redis>> as jest.Mocked<Redis>;

    ioredisShutdownService = new IoredisShutdownService(
      redisClientMock,
      redisClientSubscriberMock,
    );
  });

  describe('.onApplicationShutdown', () => {
    describe('when called', () => {
      let result: unknown;

      beforeAll(async () => {
        result = await ioredisShutdownService.onApplicationShutdown();
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call redisClient.quit()', () => {
        expect(redisClientMock.quit).toHaveBeenCalledTimes(1);
        expect(redisClientMock.quit).toHaveBeenCalledWith();
      });

      it('should call redisClientSubscriber.quit()', () => {
        expect(redisClientSubscriberMock.quit).toHaveBeenCalledTimes(1);
        expect(redisClientSubscriberMock.quit).toHaveBeenCalledWith();
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
