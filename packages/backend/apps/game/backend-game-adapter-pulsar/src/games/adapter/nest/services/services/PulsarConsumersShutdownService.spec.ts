import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Consumer } from 'pulsar-client';

import { PulsarConsumersShutdownService } from './PulsarConsumersShutdownService';

describe(PulsarConsumersShutdownService.name, () => {
  let gameTurnEndSignalConsumerMock: jest.Mocked<Consumer>;

  let pulsarConsumersShutdownService: PulsarConsumersShutdownService;

  beforeAll(() => {
    gameTurnEndSignalConsumerMock = {
      close: jest.fn(),
    } as Partial<jest.Mocked<Consumer>> as jest.Mocked<Consumer>;

    pulsarConsumersShutdownService = new PulsarConsumersShutdownService(
      gameTurnEndSignalConsumerMock,
    );
  });

  describe('.onApplicationShutdown', () => {
    describe('when called', () => {
      let result: unknown;

      beforeAll(async () => {
        result = await pulsarConsumersShutdownService.onApplicationShutdown();
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gameTurnEndSignalConsumer.close()', () => {
        expect(gameTurnEndSignalConsumerMock.close).toHaveBeenCalledTimes(1);
        expect(gameTurnEndSignalConsumerMock.close).toHaveBeenCalledWith();
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
