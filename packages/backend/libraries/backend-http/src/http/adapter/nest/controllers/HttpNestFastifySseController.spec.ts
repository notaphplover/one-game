import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import http from 'node:http';
import net from 'node:net';

import { Builder, Either, Handler } from '@cornie-js/backend-common';
import { FastifyReply, FastifyRequest } from 'fastify';

import { MessageEvent } from '../../../application/models/MessageEvent';
import { Request } from '../../../application/models/Request';
import { RequestWithBody } from '../../../application/models/RequestWithBody';
import { Response } from '../../../application/models/Response';
import { ResponseWithBody } from '../../../application/models/ResponseWithBody';
import { DelayedSseConsumer } from '../../../application/modules/DelayedSseConsumer';
import { SsePublisher } from '../../../application/modules/SsePublisher';
import { SseTeardownExecutor } from '../../../application/modules/SseTeardownExecutor';
import { FastifyReplySseConsumerFromFastifyReplyBuilder } from '../../fastify/builders/FastifyReplySseConsumerFromFastifyReplyBuilder';
import { HttpNestFastifySseController } from './HttpNestFastifySseController';

describe(HttpNestFastifySseController.name, () => {
  let fastifyReplySseConsumerFromFastifyReplyBuilderMock: jest.Mocked<FastifyReplySseConsumerFromFastifyReplyBuilder>;
  let requestBuilderMock: jest.Mocked<
    Builder<Request | RequestWithBody, [FastifyRequest]>
  >;
  let requestControllerMock: jest.Mocked<
    Handler<
      [Request | RequestWithBody, SsePublisher],
      Either<
        Response | ResponseWithBody<unknown>,
        [Response, MessageEvent[], SseTeardownExecutor]
      >
    >
  >;
  let resultBuilderMock: jest.Mocked<
    Builder<FastifyReply, [Response | ResponseWithBody<unknown>, FastifyReply]>
  >;
  let sseResultBuilderMock: jest.Mocked<
    Builder<FastifyReply, [Response, FastifyReply]>
  >;

  let httpNestFastifySseController: HttpNestFastifySseController;

  beforeAll(() => {
    fastifyReplySseConsumerFromFastifyReplyBuilderMock = {
      build: jest.fn(),
    } as Partial<
      jest.Mocked<FastifyReplySseConsumerFromFastifyReplyBuilder>
    > as jest.Mocked<FastifyReplySseConsumerFromFastifyReplyBuilder>;
    requestBuilderMock = {
      build: jest.fn(),
    };
    requestControllerMock = {
      handle: jest.fn(),
    };
    resultBuilderMock = {
      build: jest.fn(),
    };
    sseResultBuilderMock = {
      build: jest.fn(),
    };

    httpNestFastifySseController = new HttpNestFastifySseController(
      fastifyReplySseConsumerFromFastifyReplyBuilderMock,
      requestBuilderMock,
      requestControllerMock,
      resultBuilderMock,
      sseResultBuilderMock,
    );
  });

  describe('.handle', () => {
    let closeGetterMock: jest.Mock<() => boolean>;
    let socketMock: jest.Mocked<net.Socket>;

    let fastifyRequestFixture: FastifyRequest;
    let fastifyReplyFixture: FastifyReply;

    beforeAll(() => {
      closeGetterMock = jest.fn();
      socketMock = {
        setKeepAlive: jest.fn() as unknown,
        setNoDelay: jest.fn() as unknown,
        setTimeout: jest.fn() as unknown,
      } as Partial<jest.Mocked<net.Socket>> as jest.Mocked<net.Socket>;

      fastifyRequestFixture = {
        raw: {
          get closed(): boolean {
            return closeGetterMock();
          },
          on: jest.fn(),
        } as Partial<http.IncomingMessage> as http.IncomingMessage,
        socket: socketMock,
      } as Partial<FastifyRequest> as FastifyRequest;
      fastifyReplyFixture = Symbol() as unknown as FastifyReply;
    });

    describe('when called, and requestController.handle() returns Left', () => {
      let requestFixture: Request | RequestWithBody;
      let responseFixture: Response | ResponseWithBody<unknown>;
      let delayedSseConsumerMock: jest.Mocked<DelayedSseConsumer>;

      let result: unknown;

      beforeAll(async () => {
        requestFixture = Symbol() as unknown as Request | RequestWithBody;
        responseFixture = Symbol() as unknown as
          | Response
          | ResponseWithBody<unknown>;
        delayedSseConsumerMock = {
          onComplete: jest.fn(),
        } as Partial<
          jest.Mocked<DelayedSseConsumer>
        > as jest.Mocked<DelayedSseConsumer>;

        requestBuilderMock.build.mockReturnValueOnce(requestFixture);
        fastifyReplySseConsumerFromFastifyReplyBuilderMock.build.mockReturnValueOnce(
          delayedSseConsumerMock,
        );
        requestControllerMock.handle.mockResolvedValueOnce({
          isRight: false,
          value: responseFixture,
        });

        resultBuilderMock.build.mockReturnValueOnce(fastifyReplyFixture);

        result = await httpNestFastifySseController.handle(
          fastifyRequestFixture,
          fastifyReplyFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call fastifyRequest.socket.setKeepAlive()', () => {
        expect(fastifyRequestFixture.socket.setKeepAlive).toHaveBeenCalledTimes(
          1,
        );
        expect(fastifyRequestFixture.socket.setKeepAlive).toHaveBeenCalledWith(
          true,
        );
      });

      it('should call fastifyRequest.socket.setNoDelay()', () => {
        expect(fastifyRequestFixture.socket.setNoDelay).toHaveBeenCalledTimes(
          1,
        );
        expect(fastifyRequestFixture.socket.setNoDelay).toHaveBeenCalledWith(
          true,
        );
      });

      it('should call fastifyRequest.socket.setTimeout()', () => {
        expect(fastifyRequestFixture.socket.setTimeout).toHaveBeenCalledTimes(
          1,
        );
        expect(fastifyRequestFixture.socket.setTimeout).toHaveBeenCalledWith(0);
      });

      it('should call requestBuilder.build()', () => {
        expect(requestBuilderMock.build).toHaveBeenCalledTimes(1);
        expect(requestBuilderMock.build).toHaveBeenCalledWith(
          fastifyRequestFixture,
        );
      });

      it('should call fastifyReplySseConsumerFromFastifyReplyBuilder.build()', () => {
        expect(
          fastifyReplySseConsumerFromFastifyReplyBuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(
          fastifyReplySseConsumerFromFastifyReplyBuilderMock.build,
        ).toHaveBeenCalledWith(fastifyReplyFixture);
      });

      it('should call requestController.handle()', () => {
        expect(requestControllerMock.handle).toHaveBeenCalledTimes(1);
        expect(requestControllerMock.handle).toHaveBeenCalledWith(
          requestFixture,
          expect.any(SsePublisher),
        );
      });

      it('should call resultBuilder.build()', () => {
        expect(resultBuilderMock.build).toHaveBeenCalledTimes(1);
        expect(resultBuilderMock.build).toHaveBeenCalledWith(
          responseFixture,
          fastifyReplyFixture,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when called, and requestController.handle() returns Right and fastifyRequest.raw.closed returns false', () => {
      let requestFixture: Request | RequestWithBody;
      let responseFixture: Response | ResponseWithBody<unknown>;
      let messageEventsFixture: MessageEvent[];
      let delayedSseConsumerMock: jest.Mocked<DelayedSseConsumer>;
      let sseTeardownExecutorMock: jest.Mocked<SseTeardownExecutor>;

      let result: unknown;

      beforeAll(async () => {
        requestFixture = Symbol() as unknown as Request | RequestWithBody;
        responseFixture = Symbol() as unknown as
          | Response
          | ResponseWithBody<unknown>;
        messageEventsFixture = [Symbol() as unknown as MessageEvent];
        delayedSseConsumerMock = {
          free: jest.fn(),
          onComplete: jest.fn(),
          setPreviousEvents: jest.fn(),
        } as Partial<
          jest.Mocked<DelayedSseConsumer>
        > as jest.Mocked<DelayedSseConsumer>;
        sseTeardownExecutorMock = {
          teardown: jest.fn(),
        };

        requestBuilderMock.build.mockReturnValueOnce(requestFixture);
        fastifyReplySseConsumerFromFastifyReplyBuilderMock.build.mockReturnValueOnce(
          delayedSseConsumerMock,
        );
        requestControllerMock.handle.mockResolvedValueOnce({
          isRight: true,
          value: [
            responseFixture,
            messageEventsFixture,
            sseTeardownExecutorMock,
          ],
        });
        resultBuilderMock.build.mockReturnValueOnce(fastifyReplyFixture);
        closeGetterMock.mockReturnValueOnce(false);

        result = await httpNestFastifySseController.handle(
          fastifyRequestFixture,
          fastifyReplyFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call fastifyRequest.socket.setKeepAlive()', () => {
        expect(fastifyRequestFixture.socket.setKeepAlive).toHaveBeenCalledTimes(
          1,
        );
        expect(fastifyRequestFixture.socket.setKeepAlive).toHaveBeenCalledWith(
          true,
        );
      });

      it('should call fastifyRequest.socket.setNoDelay()', () => {
        expect(fastifyRequestFixture.socket.setNoDelay).toHaveBeenCalledTimes(
          1,
        );
        expect(fastifyRequestFixture.socket.setNoDelay).toHaveBeenCalledWith(
          true,
        );
      });

      it('should call fastifyRequest.socket.setTimeout()', () => {
        expect(fastifyRequestFixture.socket.setTimeout).toHaveBeenCalledTimes(
          1,
        );
        expect(fastifyRequestFixture.socket.setTimeout).toHaveBeenCalledWith(0);
      });

      it('should call requestBuilder.build()', () => {
        expect(requestBuilderMock.build).toHaveBeenCalledTimes(1);
        expect(requestBuilderMock.build).toHaveBeenCalledWith(
          fastifyRequestFixture,
        );
      });

      it('should call fastifyReplySseConsumerFromFastifyReplyBuilder.build()', () => {
        expect(
          fastifyReplySseConsumerFromFastifyReplyBuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(
          fastifyReplySseConsumerFromFastifyReplyBuilderMock.build,
        ).toHaveBeenCalledWith(fastifyReplyFixture);
      });

      it('should call requestController.handle()', () => {
        expect(requestControllerMock.handle).toHaveBeenCalledTimes(1);
        expect(requestControllerMock.handle).toHaveBeenCalledWith(
          requestFixture,
          expect.any(SsePublisher),
        );
      });

      it('should call fastifyRequest.raw.on()', () => {
        expect(fastifyRequestFixture.raw.on).toHaveBeenCalledTimes(1);
        expect(fastifyRequestFixture.raw.on).toHaveBeenCalledWith(
          'close',
          expect.any(Function),
        );
      });

      it('should call delayedSseConsumer.setPreviousEvents()', () => {
        expect(delayedSseConsumerMock.setPreviousEvents).toHaveBeenCalledTimes(
          1,
        );
        expect(delayedSseConsumerMock.setPreviousEvents).toHaveBeenCalledWith(
          messageEventsFixture,
        );
      });

      it('should call sseResultBuilder.build()', () => {
        expect(sseResultBuilderMock.build).toHaveBeenCalledTimes(1);
        expect(sseResultBuilderMock.build).toHaveBeenCalledWith(
          responseFixture,
          fastifyReplyFixture,
        );
      });

      it('should call delayedSseConsumer.free()', () => {
        expect(delayedSseConsumerMock.free).toHaveBeenCalledTimes(1);
        expect(delayedSseConsumerMock.free).toHaveBeenCalledWith();
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when called, and requestController.handle() returns Right and fastifyRequest.raw.closed returns true', () => {
      let requestFixture: Request | RequestWithBody;
      let responseFixture: Response | ResponseWithBody<unknown>;
      let messageEventsFixture: MessageEvent[];
      let delayedSseConsumerMock: jest.Mocked<DelayedSseConsumer>;
      let sseTeardownExecutorMock: jest.Mocked<SseTeardownExecutor>;

      let result: unknown;

      beforeAll(async () => {
        requestFixture = Symbol() as unknown as Request | RequestWithBody;
        responseFixture = Symbol() as unknown as
          | Response
          | ResponseWithBody<unknown>;
        messageEventsFixture = [Symbol() as unknown as MessageEvent];
        delayedSseConsumerMock = {
          free: jest.fn(),
          onComplete: jest.fn(),
          setPreviousEvents: jest.fn(),
        } as Partial<
          jest.Mocked<DelayedSseConsumer>
        > as jest.Mocked<DelayedSseConsumer>;
        sseTeardownExecutorMock = {
          teardown: jest.fn(),
        };

        requestBuilderMock.build.mockReturnValueOnce(requestFixture);
        fastifyReplySseConsumerFromFastifyReplyBuilderMock.build.mockReturnValueOnce(
          delayedSseConsumerMock,
        );
        requestControllerMock.handle.mockResolvedValueOnce({
          isRight: true,
          value: [
            responseFixture,
            messageEventsFixture,
            sseTeardownExecutorMock,
          ],
        });
        resultBuilderMock.build.mockReturnValueOnce(fastifyReplyFixture);
        closeGetterMock.mockReturnValueOnce(true);

        result = await httpNestFastifySseController.handle(
          fastifyRequestFixture,
          fastifyReplyFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call fastifyRequest.socket.setKeepAlive()', () => {
        expect(fastifyRequestFixture.socket.setKeepAlive).toHaveBeenCalledTimes(
          1,
        );
        expect(fastifyRequestFixture.socket.setKeepAlive).toHaveBeenCalledWith(
          true,
        );
      });

      it('should call fastifyRequest.socket.setNoDelay()', () => {
        expect(fastifyRequestFixture.socket.setNoDelay).toHaveBeenCalledTimes(
          1,
        );
        expect(fastifyRequestFixture.socket.setNoDelay).toHaveBeenCalledWith(
          true,
        );
      });

      it('should call fastifyRequest.socket.setTimeout()', () => {
        expect(fastifyRequestFixture.socket.setTimeout).toHaveBeenCalledTimes(
          1,
        );
        expect(fastifyRequestFixture.socket.setTimeout).toHaveBeenCalledWith(0);
      });

      it('should call requestBuilder.build()', () => {
        expect(requestBuilderMock.build).toHaveBeenCalledTimes(1);
        expect(requestBuilderMock.build).toHaveBeenCalledWith(
          fastifyRequestFixture,
        );
      });

      it('should call fastifyReplySseConsumerFromFastifyReplyBuilder.build()', () => {
        expect(
          fastifyReplySseConsumerFromFastifyReplyBuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(
          fastifyReplySseConsumerFromFastifyReplyBuilderMock.build,
        ).toHaveBeenCalledWith(fastifyReplyFixture);
      });

      it('should call requestController.handle()', () => {
        expect(requestControllerMock.handle).toHaveBeenCalledTimes(1);
        expect(requestControllerMock.handle).toHaveBeenCalledWith(
          requestFixture,
          expect.any(SsePublisher),
        );
      });

      it('should call sseTeardownExecutor.teardown()', () => {
        expect(sseTeardownExecutorMock.teardown).toHaveBeenCalledTimes(1);
        expect(sseTeardownExecutorMock.teardown).toHaveBeenCalledWith();
      });

      it('should call delayedSseConsumer.onComplete()', () => {
        expect(delayedSseConsumerMock.onComplete).toHaveBeenCalledTimes(1);
        expect(delayedSseConsumerMock.onComplete).toHaveBeenCalledWith();
      });

      it('should call delayedSseConsumer.setPreviousEvents()', () => {
        expect(delayedSseConsumerMock.setPreviousEvents).toHaveBeenCalledTimes(
          1,
        );
        expect(delayedSseConsumerMock.setPreviousEvents).toHaveBeenCalledWith(
          messageEventsFixture,
        );
      });

      it('should call sseResultBuilder.build()', () => {
        expect(sseResultBuilderMock.build).toHaveBeenCalledTimes(1);
        expect(sseResultBuilderMock.build).toHaveBeenCalledWith(
          responseFixture,
          fastifyReplyFixture,
        );
      });

      it('should call delayedSseConsumer.free()', () => {
        expect(delayedSseConsumerMock.free).toHaveBeenCalledTimes(1);
        expect(delayedSseConsumerMock.free).toHaveBeenCalledWith();
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
