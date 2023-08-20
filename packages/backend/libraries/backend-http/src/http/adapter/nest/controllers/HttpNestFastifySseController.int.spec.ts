import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Builder, Handler } from '@cornie-js/backend-common';
import { MessageEvent } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Observable, Observer } from 'rxjs';

import { Request } from '../../../application/models/Request';
import { RequestWithBody } from '../../../application/models/RequestWithBody';
import { SsePublisher } from '../../../application/modules/SsePublisher';
import { SseTeardownExecutor } from '../../../application/modules/SseTeardownExecutor';
import { HttpNestFastifySseController } from './HttpNestFastifySseController';

describe(HttpNestFastifySseController.name, () => {
  let requestBuilderMock: jest.Mocked<
    Builder<Request | RequestWithBody, [FastifyRequest]>
  >;
  let requestControllerMock: jest.Mocked<
    Handler<[Request | RequestWithBody, SsePublisher], SseTeardownExecutor>
  >;

  let httpNestFastifySseController: HttpNestFastifySseController;

  beforeAll(() => {
    requestBuilderMock = {
      build: jest.fn(),
    };
    requestControllerMock = {
      handle: jest.fn(),
    };

    httpNestFastifySseController = new HttpNestFastifySseController(
      requestBuilderMock,
      requestControllerMock,
    );
  });

  describe('.handle', () => {
    let fastifyRequestFixture: FastifyRequest;

    beforeAll(() => {
      fastifyRequestFixture = Symbol() as unknown as FastifyRequest;
    });

    describe('when called and requestController.handle() returns a fullfilled promise', () => {
      let requestFixture: Request | RequestWithBody;
      let sseTeardownExecutorMock: jest.Mocked<SseTeardownExecutor>;

      let observableResult: Observable<MessageEvent>;

      beforeAll(() => {
        requestFixture = Symbol() as unknown as Request | RequestWithBody;
        sseTeardownExecutorMock = {
          teardown: jest.fn(),
        };

        requestBuilderMock.build.mockReturnValueOnce(requestFixture);

        observableResult = httpNestFastifySseController.handle(
          fastifyRequestFixture,
        );
      });

      describe('and the observable result is observed and and requestController.handle() returns a fullfilled promise', () => {
        let eventFixture: string;
        let requestControllerHandleMockCalledCallback: (
          value: void | PromiseLike<void>,
        ) => void;
        let requestControllerHandleMockCalled: Promise<void>;
        let observerPublisher: SsePublisher;

        let observerMock: jest.Mocked<Observer<MessageEvent>>;

        beforeAll(async () => {
          eventFixture = 'event-fixture';

          requestControllerHandleMockCalled = new Promise(
            (resolve: (value: void | PromiseLike<void>) => void) => {
              requestControllerHandleMockCalledCallback = resolve;
            },
          );

          requestControllerMock.handle.mockImplementationOnce(
            async (
              _request: Request | RequestWithBody,
              publisher: SsePublisher,
            ): Promise<SseTeardownExecutor> => {
              observerPublisher = publisher;
              requestControllerHandleMockCalledCallback();

              return sseTeardownExecutorMock;
            },
          );

          observerMock = {
            complete: jest.fn(),
            error: jest.fn(),
            next: jest.fn(),
          };

          observableResult.subscribe(observerMock);

          await requestControllerHandleMockCalled;

          observerPublisher.publish(eventFixture);
          observerPublisher.conplete();
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call requestBuilder.build()', () => {
          expect(requestBuilderMock.build).toHaveBeenCalledTimes(1);
          expect(requestBuilderMock.build).toHaveBeenCalledWith(
            fastifyRequestFixture,
          );
        });

        it('should call requestController.handle()', () => {
          expect(requestControllerMock.handle).toHaveBeenCalledTimes(1);
          expect(requestControllerMock.handle).toHaveBeenCalledWith(
            requestFixture,
            expect.any(SsePublisher),
          );
        });

        it('should return an Observable', () => {
          expect(observableResult).toBeInstanceOf(Observable);
        });

        it('should call observer.next()', () => {
          const expected: MessageEvent = {
            data: eventFixture,
          };

          expect(observerMock.next).toHaveBeenCalledTimes(1);
          expect(observerMock.next).toHaveBeenCalledWith(expected);
        });

        it('should call observer.complete()', () => {
          expect(observerMock.complete).toHaveBeenCalledTimes(1);
          expect(observerMock.complete).toHaveBeenCalledWith();
        });

        it('should call sseTeardownExecutor.teardown()', () => {
          expect(sseTeardownExecutorMock.teardown).toHaveBeenCalledTimes(1);
          expect(sseTeardownExecutorMock.teardown).toHaveBeenCalledWith();
        });
      });
    });
  });
});
