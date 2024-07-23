import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Consumer, Message } from 'pulsar-client';

import { PulsarConsumer } from './PulsarConsumer';

class PulsarConsumerTest extends PulsarConsumer<unknown> {
  readonly #handleMessageMock: jest.Mock<(message: unknown) => Promise<void>>;

  constructor(
    consumer: Consumer,
    handleMessageMock: jest.Mock<(message: unknown) => Promise<void>>,
  ) {
    super(consumer);

    this.#handleMessageMock = handleMessageMock;
  }

  protected override async _handleMessage(message: unknown): Promise<void> {
    return this.#handleMessageMock(message);
  }
}

describe(PulsarConsumer.name, () => {
  let consumerMock: jest.Mocked<Consumer>;
  let handleMessageMock: jest.Mock<(message: unknown) => Promise<void>>;

  let pulsarConsumer: PulsarConsumerTest;

  beforeAll(() => {
    consumerMock = {
      acknowledge: jest.fn(),
      isConnected: jest.fn(),
      negativeAcknowledge: jest.fn(),
      receive: jest.fn(),
    } as Partial<jest.Mocked<Consumer>> as jest.Mocked<Consumer>;

    handleMessageMock = jest.fn();

    pulsarConsumer = new PulsarConsumerTest(consumerMock, handleMessageMock);
  });

  describe('.handleMessages', () => {
    describe('when called, and consumer.isConnected() returns false', () => {
      let result: unknown;

      beforeAll(async () => {
        consumerMock.isConnected.mockReturnValueOnce(false);

        result = await pulsarConsumer.handleMessages();
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call consumer.isConnected()', () => {
        expect(consumerMock.isConnected).toHaveBeenCalledTimes(1);
        expect(consumerMock.isConnected).toHaveBeenCalledWith();
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when called, and consumer.isConnected() returns true and then false', () => {
      let messageContentFixture: unknown;
      let pulsarMessageMock: jest.Mocked<Message>;

      let result: unknown;

      beforeAll(async () => {
        messageContentFixture = {
          foo: 'bar',
        };
        pulsarMessageMock = {
          getData: jest
            .fn()
            .mockReturnValueOnce(
              Buffer.from(JSON.stringify(messageContentFixture)),
            ),
        } as Partial<jest.Mocked<Message>> as jest.Mocked<Message>;

        consumerMock.isConnected
          .mockReturnValueOnce(true)
          .mockReturnValueOnce(false);

        consumerMock.receive.mockResolvedValueOnce(pulsarMessageMock);

        result = await pulsarConsumer.handleMessages();
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call consumer.isConnected()', () => {
        expect(consumerMock.isConnected).toHaveBeenCalledTimes(2);
        expect(consumerMock.isConnected).toHaveBeenCalledWith();
      });

      it('should call consumer.receive()', () => {
        expect(consumerMock.receive).toHaveBeenCalledTimes(1);
        expect(consumerMock.receive).toHaveBeenCalledWith();
      });

      it('should call pulsarMessage.getData()', () => {
        expect(pulsarMessageMock.getData).toHaveBeenCalledTimes(1);
        expect(pulsarMessageMock.getData).toHaveBeenCalledWith();
      });

      it('should call handleMessage()', () => {
        expect(handleMessageMock).toHaveBeenCalledTimes(1);
        expect(handleMessageMock).toHaveBeenCalledWith(messageContentFixture);
      });

      it('should call consumer.acknowledge()', () => {
        expect(consumerMock.acknowledge).toHaveBeenCalledTimes(1);
        expect(consumerMock.acknowledge).toHaveBeenCalledWith(
          pulsarMessageMock,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when called, and consumer.isConnected() returns true and then false and handleMessage() throws an Error', () => {
      let errorFixture: Error;
      let messageContentFixture: unknown;
      let pulsarMessageMock: jest.Mocked<Message>;

      let result: unknown;

      beforeAll(async () => {
        errorFixture = new Error('Error fixture');
        messageContentFixture = {
          foo: 'bar',
        };
        pulsarMessageMock = {
          getData: jest
            .fn()
            .mockReturnValueOnce(
              Buffer.from(JSON.stringify(messageContentFixture)),
            ),
        } as Partial<jest.Mocked<Message>> as jest.Mocked<Message>;

        consumerMock.isConnected
          .mockReturnValueOnce(true)
          .mockReturnValueOnce(false);

        consumerMock.receive.mockResolvedValueOnce(pulsarMessageMock);

        handleMessageMock.mockRejectedValueOnce(errorFixture);

        result = await pulsarConsumer.handleMessages();
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call consumer.isConnected()', () => {
        expect(consumerMock.isConnected).toHaveBeenCalledTimes(2);
        expect(consumerMock.isConnected).toHaveBeenCalledWith();
      });

      it('should call consumer.receive()', () => {
        expect(consumerMock.receive).toHaveBeenCalledTimes(1);
        expect(consumerMock.receive).toHaveBeenCalledWith();
      });

      it('should call pulsarMessage.getData()', () => {
        expect(pulsarMessageMock.getData).toHaveBeenCalledTimes(1);
        expect(pulsarMessageMock.getData).toHaveBeenCalledWith();
      });

      it('should call handleMessage()', () => {
        expect(handleMessageMock).toHaveBeenCalledTimes(1);
        expect(handleMessageMock).toHaveBeenCalledWith(messageContentFixture);
      });

      it('should call consumer.negativeAcknowledge()', () => {
        expect(consumerMock.negativeAcknowledge).toHaveBeenCalledTimes(1);
        expect(consumerMock.negativeAcknowledge).toHaveBeenCalledWith(
          pulsarMessageMock,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
