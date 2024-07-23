import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Client } from 'pulsar-client';

import { PulsarShutdownService } from './PulsarShutdownService';

describe(PulsarShutdownService.name, () => {
  let clientMock: jest.Mocked<Client>;

  let pulsarShutdownService: PulsarShutdownService;

  beforeAll(() => {
    clientMock = {
      close: jest.fn(),
    } as Partial<jest.Mocked<Client>> as jest.Mocked<Client>;

    pulsarShutdownService = new PulsarShutdownService(clientMock);
  });

  describe('.onApplicationShutdown', () => {
    describe('when called', () => {
      let result: unknown;

      beforeAll(async () => {
        result = await pulsarShutdownService.onApplicationShutdown();
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call client.close()', () => {
        expect(clientMock.close).toHaveBeenCalledTimes(1);
        expect(clientMock.close).toHaveBeenCalledWith();
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
