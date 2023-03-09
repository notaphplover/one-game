import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Builder, Handler } from '@one-game-js/backend-common';
import {
  Request,
  RequestWithBody,
  Response,
  ResponseWithBody,
} from '@one-game-js/backend-http';
import { FastifyReply, FastifyRequest } from 'fastify';

import { HttpNestController } from './HttpNestController';

describe(HttpNestController.name, () => {
  let requestBuilderMock: jest.Mocked<
    Builder<Request | RequestWithBody, [FastifyRequest]>
  >;
  let requestControllerMock: jest.Mocked<
    Handler<[Request | RequestWithBody], Response | ResponseWithBody<unknown>>
  >;
  let resultBuilderMock: jest.Mocked<
    Builder<FastifyReply, [Response | ResponseWithBody<unknown>, FastifyReply]>
  >;

  let httpController: HttpNestController<Request | RequestWithBody>;

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

    httpController = new HttpNestController(
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
