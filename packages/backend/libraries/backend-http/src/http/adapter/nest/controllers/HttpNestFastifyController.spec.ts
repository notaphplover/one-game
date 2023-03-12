import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Builder, Handler } from '@one-game-js/backend-common';
import { FastifyReply, FastifyRequest } from 'fastify';

import { Request } from '../../../application/models/Request';
import { RequestWithBody } from '../../../application/models/RequestWithBody';
import { Response } from '../../../application/models/Response';
import { ResponseWithBody } from '../../../application/models/ResponseWithBody';
import { MiddlewarePipeline } from '../../../application/modules/MiddlewarePipeline';
import { HttpNestFastifyController } from './HttpNestFastifyController';

describe(HttpNestFastifyController.name, () => {
  describe('having no MiddlewarePipeline', () => {
    let requestBuilderMock: jest.Mocked<
      Builder<Request | RequestWithBody, [FastifyRequest]>
    >;
    let requestControllerMock: jest.Mocked<
      Handler<[Request | RequestWithBody], Response | ResponseWithBody<unknown>>
    >;
    let resultBuilderMock: jest.Mocked<
      Builder<
        FastifyReply,
        [Response | ResponseWithBody<unknown>, FastifyReply]
      >
    >;

    let httpController: HttpNestFastifyController<Request | RequestWithBody>;

    beforeAll(() => {
      requestBuilderMock = {
        build: jest.fn(),
      };
      requestControllerMock = {
        handle: jest.fn(),
      };
      resultBuilderMock = {
        build: jest.fn(),
      };

      httpController = new HttpNestFastifyController(
        requestBuilderMock,
        requestControllerMock,
        resultBuilderMock,
      );
    });

    describe('.handle', () => {
      describe('when called', () => {
        let fastifyRequestFixture: FastifyRequest;
        let requestFixture: Request | RequestWithBody;
        let responseFixture: Response | ResponseWithBody<unknown>;
        let fastifyReplyFixture: FastifyReply;

        let result: unknown;

        beforeAll(async () => {
          fastifyRequestFixture = Symbol() as unknown as FastifyRequest;
          requestFixture = Symbol() as unknown as Request | RequestWithBody;
          responseFixture = Symbol() as unknown as
            | Response
            | ResponseWithBody<unknown>;
          fastifyReplyFixture = Symbol() as unknown as FastifyReply;

          requestBuilderMock.build.mockReturnValueOnce(requestFixture);
          requestControllerMock.handle.mockResolvedValueOnce(responseFixture);
          resultBuilderMock.build.mockReturnValueOnce(fastifyReplyFixture);

          result = await httpController.handle(
            fastifyRequestFixture,
            fastifyReplyFixture,
          );
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
    });
  });

  describe('having a MiddlewarePipeline', () => {
    let requestBuilderMock: jest.Mocked<
      Builder<Request | RequestWithBody, [FastifyRequest]>
    >;
    let requestControllerMock: jest.Mocked<
      Handler<[Request | RequestWithBody], Response | ResponseWithBody<unknown>>
    >;
    let resultBuilderMock: jest.Mocked<
      Builder<
        FastifyReply,
        [Response | ResponseWithBody<unknown>, FastifyReply]
      >
    >;
    let middlewarePipelineMock: jest.Mocked<MiddlewarePipeline>;

    let httpController: HttpNestFastifyController<Request | RequestWithBody>;

    beforeAll(() => {
      requestBuilderMock = {
        build: jest.fn(),
      };
      requestControllerMock = {
        handle: jest.fn(),
      };
      resultBuilderMock = {
        build: jest.fn(),
      };
      middlewarePipelineMock = {
        apply: jest.fn(),
      } as Partial<
        jest.Mocked<MiddlewarePipeline>
      > as jest.Mocked<MiddlewarePipeline>;

      httpController = new HttpNestFastifyController(
        requestBuilderMock,
        requestControllerMock,
        resultBuilderMock,
        middlewarePipelineMock,
      );
    });

    describe('.handle', () => {
      describe('when called, and middlewarePipelineMock.apply resolves to undefined', () => {
        let fastifyRequestFixture: FastifyRequest;
        let requestFixture: Request | RequestWithBody;
        let responseFixture: Response | ResponseWithBody<unknown>;
        let fastifyReplyFixture: FastifyReply;

        let result: unknown;

        beforeAll(async () => {
          fastifyRequestFixture = Symbol() as unknown as FastifyRequest;
          requestFixture = Symbol() as unknown as Request | RequestWithBody;
          responseFixture = Symbol() as unknown as
            | Response
            | ResponseWithBody<unknown>;
          fastifyReplyFixture = Symbol() as unknown as FastifyReply;

          requestBuilderMock.build.mockReturnValueOnce(requestFixture);
          requestControllerMock.handle.mockResolvedValueOnce(responseFixture);
          resultBuilderMock.build.mockReturnValueOnce(fastifyReplyFixture);
          middlewarePipelineMock.apply.mockResolvedValueOnce(undefined);

          result = await httpController.handle(
            fastifyRequestFixture,
            fastifyReplyFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call middlewarePipeline.apply()', () => {
          expect(middlewarePipelineMock.apply).toHaveBeenCalledTimes(1);
          expect(middlewarePipelineMock.apply).toHaveBeenCalledWith(
            requestFixture,
          );
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

      describe('when called, and middlewarePipelineMock.apply resolves to a Response', () => {
        let fastifyRequestFixture: FastifyRequest;
        let requestFixture: Request | RequestWithBody;
        let responseFixture: Response | ResponseWithBody<unknown>;
        let fastifyReplyFixture: FastifyReply;

        let result: unknown;

        beforeAll(async () => {
          fastifyRequestFixture = Symbol() as unknown as FastifyRequest;
          requestFixture = Symbol() as unknown as Request | RequestWithBody;
          responseFixture = Symbol() as unknown as
            | Response
            | ResponseWithBody<unknown>;
          fastifyReplyFixture = Symbol() as unknown as FastifyReply;

          requestBuilderMock.build.mockReturnValueOnce(requestFixture);
          resultBuilderMock.build.mockReturnValueOnce(fastifyReplyFixture);
          middlewarePipelineMock.apply.mockResolvedValueOnce(responseFixture);

          result = await httpController.handle(
            fastifyRequestFixture,
            fastifyReplyFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call middlewarePipeline.apply()', () => {
          expect(middlewarePipelineMock.apply).toHaveBeenCalledTimes(1);
          expect(middlewarePipelineMock.apply).toHaveBeenCalledWith(
            requestFixture,
          );
        });

        it('should call requestBuilder.build()', () => {
          expect(requestBuilderMock.build).toHaveBeenCalledTimes(1);
          expect(requestBuilderMock.build).toHaveBeenCalledWith(
            fastifyRequestFixture,
          );
        });

        it('should not call requestController.handle()', () => {
          expect(requestControllerMock.handle).not.toHaveBeenCalled();
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
    });
  });
});
