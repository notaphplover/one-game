import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { AppError, AppErrorKind, Publisher } from '@cornie-js/backend-common';
import Redis from 'ioredis';

import { GameEventsIoredisSubscriber } from './GameEventsIoredisSubscriber';

function getMessageHandler(
  redisClientMock: jest.Mocked<Redis>,
): (channel: string, message: string) => void {
  const [onFirstCall]: [string | symbol, (...args: unknown[]) => void][] =
    redisClientMock.on.mock.calls;

  if (onFirstCall === undefined) {
    throw new Error('Unable to get message handler');
  }

  const [, handler]: [string | symbol, (...args: unknown[]) => void] =
    onFirstCall;

  return handler as (channel: string, message: string) => void;
}

describe(GameEventsIoredisSubscriber.name, () => {
  let redisClientMock: jest.Mocked<Redis>;

  beforeAll(() => {
    redisClientMock = {
      on: jest.fn() as unknown,
      subscribe: jest.fn(),
      unsubscribe: jest.fn() as unknown,
    } as Partial<jest.Mocked<Redis>> as jest.Mocked<Redis>;
  });

  describe('.subscribe', () => {
    describe('having a wrong channelId', () => {
      let channelFixture: string;

      beforeAll(() => {
        channelFixture = 'wrong channel fixture';
      });

      describe('when called', () => {
        let publisherMock: jest.Mocked<Publisher<string>>;

        let result: unknown;

        beforeAll(async () => {
          const gameEventsIoredisSubscriber: GameEventsIoredisSubscriber =
            new GameEventsIoredisSubscriber(redisClientMock);

          publisherMock = {
            publish: jest.fn(),
          };

          try {
            await gameEventsIoredisSubscriber.subscribe(
              channelFixture,
              publisherMock,
            );
          } catch (error: unknown) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should throw an AppError', () => {
          const expectedErrorProperties: Partial<AppError> = {
            kind: AppErrorKind.unknown,
            message: `Unexpected "${channelFixture}" channel`,
          };

          expect(result).toStrictEqual(
            expect.objectContaining(expectedErrorProperties),
          );
        });
      });
    });

    describe('when called', () => {
      let gameIdFixture: string;
      let channelFixture: string;
      let publisherMock: jest.Mocked<Publisher<string>>;

      let gameEventsIoredisSubscriber: GameEventsIoredisSubscriber;

      let messageHandler: (channel: string, message: string) => void;

      beforeAll(async () => {
        gameIdFixture = '87d38350-1854-40ab-83ea-9dac0d6bdc43';
        channelFixture = `v1/games/${gameIdFixture}`;
        publisherMock = {
          publish: jest.fn(),
        };

        gameEventsIoredisSubscriber = new GameEventsIoredisSubscriber(
          redisClientMock,
        );

        messageHandler = getMessageHandler(redisClientMock);

        await gameEventsIoredisSubscriber.subscribe(
          channelFixture,
          publisherMock,
        );
      });

      describe('when called messageHandler()', () => {
        let messageFixture: string;

        beforeAll(async () => {
          messageFixture = 'message fixture';
          messageHandler(channelFixture, messageFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call publisher.publish()', () => {
          expect(publisherMock.publish).toHaveBeenCalledTimes(1);
          expect(publisherMock.publish).toHaveBeenCalledWith(messageFixture);
        });
      });

      afterAll(() => {
        jest.clearAllMocks();
      });
    });
  });

  describe('.unsetGamePublisher', () => {
    describe('having two publishers', () => {
      let firstPublisherMock: jest.Mocked<Publisher<string>>;
      let secondPublisherMock: jest.Mocked<Publisher<string>>;

      beforeAll(() => {
        firstPublisherMock = {
          publish: jest.fn(),
        };
        secondPublisherMock = {
          publish: jest.fn(),
        };
      });

      describe('when called, after ioredisSubscriber.subscribe() is called with publishers', () => {
        let gameIdFixture: string;
        let channelFixture: string;

        let gameEventsIoredisSubscriber: GameEventsIoredisSubscriber;

        let messageHandler: (channel: string, message: string) => void;

        beforeAll(async () => {
          gameIdFixture = '87d38350-1854-40ab-83ea-9dac0d6bdc43';
          channelFixture = `v1/games/${gameIdFixture}`;

          gameEventsIoredisSubscriber = new GameEventsIoredisSubscriber(
            redisClientMock,
          );

          messageHandler = getMessageHandler(redisClientMock);

          await gameEventsIoredisSubscriber.subscribe(
            channelFixture,
            firstPublisherMock,
          );
          await gameEventsIoredisSubscriber.subscribe(
            channelFixture,
            secondPublisherMock,
          );
          await gameEventsIoredisSubscriber.unsetGamePublisher(
            channelFixture,
            firstPublisherMock,
          );
        });

        describe('when called messageHandler()', () => {
          let messageFixture: string;

          beforeAll(async () => {
            messageFixture = 'message fixture';
            messageHandler(channelFixture, messageFixture);
          });

          afterAll(() => {
            jest.clearAllMocks();
          });

          it('should not call first publisher.publish()', () => {
            expect(firstPublisherMock.publish).not.toHaveBeenCalled();
          });

          it('should call second publisher.publish()', () => {
            expect(secondPublisherMock.publish).toHaveBeenCalledTimes(1);
            expect(secondPublisherMock.publish).toHaveBeenCalledWith(
              messageFixture,
            );
          });
        });

        afterAll(() => {
          jest.clearAllMocks();
        });
      });
    });
  });

  describe('.unsubscribe', () => {
    describe('when called, after ioredisSubscriber.subscribe() is called', () => {
      let gameIdFixture: string;
      let channelFixture: string;
      let publisherMock: jest.Mocked<Publisher<string>>;

      let gameEventsIoredisSubscriber: GameEventsIoredisSubscriber;

      let messageHandler: (channel: string, message: string) => void;

      beforeAll(async () => {
        gameIdFixture = '87d38350-1854-40ab-83ea-9dac0d6bdc43';
        channelFixture = `v1/games/${gameIdFixture}`;
        publisherMock = {
          publish: jest.fn(),
        };

        gameEventsIoredisSubscriber = new GameEventsIoredisSubscriber(
          redisClientMock,
        );

        messageHandler = getMessageHandler(redisClientMock);

        await gameEventsIoredisSubscriber.subscribe(
          channelFixture,
          publisherMock,
        );
        await gameEventsIoredisSubscriber.unsubscribe(channelFixture);
      });

      describe('when called messageHandler()', () => {
        let messageFixture: string;

        beforeAll(async () => {
          messageFixture = 'message fixture';
          messageHandler(channelFixture, messageFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should not call publisher.publish()', () => {
          expect(publisherMock.publish).not.toHaveBeenCalled();
        });
      });

      afterAll(() => {
        jest.clearAllMocks();
      });
    });
  });
});
