import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import {
  MessageDeliveryScheduleKind,
  MessageSendOptions,
} from '@cornie-js/backend-application-messaging';
import { Producer, ProducerMessage } from 'pulsar-client';

import { MessageSendPulsarAdapter } from './MessageSendPulsarAdapter';

describe(MessageSendPulsarAdapter.name, () => {
  let producerMock: jest.Mocked<Producer>;

  let messageSendPulsarAdapter: MessageSendPulsarAdapter;

  beforeAll(() => {
    producerMock = {
      send: jest.fn(),
    } as Partial<jest.Mocked<Producer>> as jest.Mocked<Producer>;

    messageSendPulsarAdapter = new MessageSendPulsarAdapter(producerMock);
  });

  describe('.send', () => {
    describe('having MessageSendOptions with no delivery options', () => {
      let messageSendOptionsFixture: MessageSendOptions<unknown>;

      beforeAll(() => {
        messageSendOptionsFixture = {
          data: { foo: 'bar' },
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(async () => {
          result = await messageSendPulsarAdapter.send(
            messageSendOptionsFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call producer.send()', () => {
          const expected: ProducerMessage = {
            data: expect.any(Buffer) as unknown as Buffer,
          };

          expect(producerMock.send).toHaveBeenCalledTimes(1);
          expect(producerMock.send).toHaveBeenCalledWith(expected);
        });

        it('should return undefined', () => {
          expect(result).toBeUndefined();
        });
      });
    });

    describe('having MessageSendOptions with delay delivery options', () => {
      let messageSendOptionsFixture: MessageSendOptions<unknown>;

      beforeAll(() => {
        messageSendOptionsFixture = {
          data: { foo: 'bar' },
          delivery: {
            schedule: {
              delayMs: 1000,
              kind: MessageDeliveryScheduleKind.delay,
            },
          },
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(async () => {
          result = await messageSendPulsarAdapter.send(
            messageSendOptionsFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call producer.send()', () => {
          const expected: ProducerMessage = {
            data: expect.any(Buffer) as unknown as Buffer,
            deliverAfter: messageSendOptionsFixture.delivery?.schedule
              ?.delayMs as number,
          };

          expect(producerMock.send).toHaveBeenCalledTimes(1);
          expect(producerMock.send).toHaveBeenCalledWith(expected);
        });

        it('should return undefined', () => {
          expect(result).toBeUndefined();
        });
      });
    });
  });
});
