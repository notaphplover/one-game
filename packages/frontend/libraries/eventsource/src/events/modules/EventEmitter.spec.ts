import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { EventHandler } from '../handlers/EventHandler';
import { EventEmitter } from './EventEmitter';

describe(EventEmitter.name, () => {
  describe('.add', () => {
    describe('when called, and eventEmitter.emit() is called', () => {
      let eventFixture: Event;

      let handlerMock: EventHandler<unknown, Event>;

      beforeAll(() => {
        eventFixture = new Event('eventType');

        handlerMock = jest.fn();

        const selfFixture: unknown = { foo: 'bar' };

        const eventEmitter: EventEmitter<unknown, Event> = new EventEmitter(
          selfFixture,
        );

        eventEmitter.add('eventType', handlerMock);
        eventEmitter.emit('eventType', eventFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call handler()', () => {
        expect(handlerMock).toHaveBeenCalledTimes(1);
        expect(handlerMock).toHaveBeenCalledWith(eventFixture);
      });
    });
  });

  describe('.emit', () => {
    describe('when called', () => {
      let eventFixture: Event;

      let handlerMock: EventHandler<unknown, Event>;

      beforeAll(() => {
        eventFixture = new Event('eventType');

        handlerMock = jest.fn();

        const selfFixture: unknown = { foo: 'bar' };

        const eventEmitter: EventEmitter<unknown, Event> = new EventEmitter(
          selfFixture,
        );

        eventEmitter.add('eventType', handlerMock);
        eventEmitter.emit('eventType', eventFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call handler()', () => {
        expect(handlerMock).toHaveBeenCalledTimes(1);
        expect(handlerMock).toHaveBeenCalledWith(eventFixture);
      });
    });
  });

  describe('.remove', () => {
    describe('when called, and eventEmitter.emit() is called', () => {
      let eventFixture: Event;

      let handlerMock: EventHandler<unknown, Event>;

      beforeAll(() => {
        eventFixture = new Event('eventType');

        handlerMock = jest.fn();

        const selfFixture: unknown = { foo: 'bar' };

        const eventEmitter: EventEmitter<unknown, Event> = new EventEmitter(
          selfFixture,
        );

        eventEmitter.add('eventType', handlerMock);
        eventEmitter.remove('eventType', handlerMock);
        eventEmitter.emit('eventType', eventFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should not call handler()', () => {
        expect(handlerMock).not.toHaveBeenCalled();
      });
    });
  });
});
