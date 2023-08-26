import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { DelayedSseConsumer } from './DelayedSseConsumer';
import { SseConsumer } from './SseConsumer';

describe(DelayedSseConsumer.name, () => {
  let sseConsumerMock: jest.Mocked<SseConsumer>;

  beforeAll(() => {
    sseConsumerMock = {
      consume: jest.fn(),
      onComplete: jest.fn(),
    };
  });

  describe('.consume', () => {
    describe('when called', () => {
      let delayedSseConsumer: DelayedSseConsumer;
      let eventFixture: string;

      let result: unknown;

      beforeAll(() => {
        eventFixture = 'event-fixture';

        delayedSseConsumer = new DelayedSseConsumer(sseConsumerMock);

        result = delayedSseConsumer.consume(eventFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should not call innerConsumer.consume()', () => {
        expect(sseConsumerMock.consume).not.toHaveBeenCalled();
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when called, after free() is called', () => {
      let delayedSseConsumer: DelayedSseConsumer;
      let eventFixture: string;

      let result: unknown;

      beforeAll(() => {
        eventFixture = 'event-fixture';

        delayedSseConsumer = new DelayedSseConsumer(sseConsumerMock);

        delayedSseConsumer.free();

        result = delayedSseConsumer.consume(eventFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call innerConsumer.consume()', () => {
        expect(sseConsumerMock.consume).toHaveBeenCalledTimes(1);
        expect(sseConsumerMock.consume).toHaveBeenCalledWith(eventFixture);
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('.free', () => {
    describe('when called, after consume() and onComplete() have been called', () => {
      let delayedSseConsumer: DelayedSseConsumer;
      let eventFixture: string;

      let result: unknown;

      beforeAll(() => {
        eventFixture = 'event-fixture';

        delayedSseConsumer = new DelayedSseConsumer(sseConsumerMock);

        delayedSseConsumer.consume(eventFixture);
        delayedSseConsumer.onComplete();

        delayedSseConsumer.free();
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call innerConsumer.consume()', () => {
        expect(sseConsumerMock.consume).toHaveBeenCalledTimes(1);
        expect(sseConsumerMock.consume).toHaveBeenCalledWith(eventFixture);
      });

      it('should call innerConsumer.onComplete()', () => {
        expect(sseConsumerMock.onComplete).toHaveBeenCalledTimes(1);
        expect(sseConsumerMock.onComplete).toHaveBeenCalledWith();
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('.onComplete', () => {
    describe('when called', () => {
      let delayedSseConsumer: DelayedSseConsumer;

      let result: unknown;

      beforeAll(() => {
        delayedSseConsumer = new DelayedSseConsumer(sseConsumerMock);

        result = delayedSseConsumer.onComplete();
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should not call innerConsumer.onComplete()', () => {
        expect(sseConsumerMock.onComplete).not.toHaveBeenCalled();
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when called, after free() is called', () => {
      let delayedSseConsumer: DelayedSseConsumer;

      let result: unknown;

      beforeAll(() => {
        delayedSseConsumer = new DelayedSseConsumer(sseConsumerMock);

        delayedSseConsumer.free();

        result = delayedSseConsumer.onComplete();
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call innerConsumer.onComplete()', () => {
        expect(sseConsumerMock.onComplete).toHaveBeenCalledTimes(1);
        expect(sseConsumerMock.onComplete).toHaveBeenCalledWith();
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
