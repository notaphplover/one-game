import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { MessageEvent } from '../models/MessageEvent';
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
      let eventFixture: MessageEvent;

      let result: unknown;

      beforeAll(async () => {
        eventFixture = { data: 'event-fixture-data' };

        delayedSseConsumer = new DelayedSseConsumer(sseConsumerMock);

        result = await delayedSseConsumer.consume(eventFixture);
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
      let eventFixture: MessageEvent;

      let result: unknown;

      beforeAll(async () => {
        eventFixture = { data: 'event-fixture-data' };

        delayedSseConsumer = new DelayedSseConsumer(sseConsumerMock);

        await delayedSseConsumer.free();

        result = await delayedSseConsumer.consume(eventFixture);
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
      let eventFixture: MessageEvent;

      let result: unknown;

      beforeAll(async () => {
        eventFixture = { data: 'event-fixture-data' };

        delayedSseConsumer = new DelayedSseConsumer(sseConsumerMock);

        await delayedSseConsumer.consume(eventFixture);
        await delayedSseConsumer.onComplete();

        await delayedSseConsumer.free();
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

  describe('.setPreviousEvents', () => {
    describe('when called', () => {
      let delayedSseConsumer: DelayedSseConsumer;
      let eventFixture: MessageEvent;

      let result: unknown;

      beforeAll(() => {
        eventFixture = { data: 'event-fixture-data' };

        delayedSseConsumer = new DelayedSseConsumer(sseConsumerMock);

        result = delayedSseConsumer.setPreviousEvents([eventFixture]);
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
      let eventFixture: MessageEvent;

      let result: unknown;

      beforeAll(async () => {
        eventFixture = { data: 'event-fixture-data' };

        delayedSseConsumer = new DelayedSseConsumer(sseConsumerMock);

        delayedSseConsumer.setPreviousEvents([eventFixture]);

        await delayedSseConsumer.free();
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

  describe('.onComplete', () => {
    describe('when called', () => {
      let delayedSseConsumer: DelayedSseConsumer;

      let result: unknown;

      beforeAll(async () => {
        delayedSseConsumer = new DelayedSseConsumer(sseConsumerMock);

        result = await delayedSseConsumer.onComplete();
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

      beforeAll(async () => {
        delayedSseConsumer = new DelayedSseConsumer(sseConsumerMock);

        await delayedSseConsumer.free();

        result = await delayedSseConsumer.onComplete();
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
