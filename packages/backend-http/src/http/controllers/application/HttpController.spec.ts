import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Builder, Handler } from '@one-game-js/backend-common';

import { Request } from '../../models/application/Request';
import { RequestWithBody } from '../../models/application/RequestWithBody';
import { Response } from '../../models/application/Response';
import { ResponseWithBody } from '../../models/application/ResponseWithBody';
import { HttpController } from './HttpController';

describe(HttpController.name, () => {
  let requestBuilderMock: jest.Mocked<
    Builder<Request | RequestWithBody, unknown[]>
  >;
  let requestControllerMock: jest.Mocked<
    Handler<[Request | RequestWithBody], Response | ResponseWithBody<unknown>>
  >;
  let resultBuilderMock: jest.Mocked<
    Builder<unknown, [Response | ResponseWithBody<unknown>]>
  >;

  let httpController: HttpController<
    unknown[],
    Request | RequestWithBody,
    unknown
  >;

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

    httpController = new HttpController(
      requestBuilderMock,
      requestControllerMock,
      resultBuilderMock,
    );
  });

  describe('.handle', () => {
    describe('when called', () => {
      let handlerParamFixture: unknown;
      let requestFixture: Request | RequestWithBody;
      let responseFixture: Response | ResponseWithBody<unknown>;
      let resultFixture: unknown;

      let result: unknown;

      beforeAll(async () => {
        handlerParamFixture = Symbol();
        requestFixture = Symbol() as unknown as Request | RequestWithBody;
        responseFixture = Symbol() as unknown as
          | Response
          | ResponseWithBody<unknown>;
        resultFixture = Symbol();

        requestBuilderMock.build.mockReturnValueOnce(requestFixture);
        requestControllerMock.handle.mockResolvedValueOnce(responseFixture);
        resultBuilderMock.build.mockReturnValueOnce(resultFixture);

        result = await httpController.handle(handlerParamFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call requestBuilder.build()', () => {
        expect(requestBuilderMock.build).toHaveBeenCalledTimes(1);
        expect(requestBuilderMock.build).toHaveBeenCalledWith(
          handlerParamFixture,
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
        expect(resultBuilderMock.build).toHaveBeenCalledWith(responseFixture);
      });

      it('should return a result', () => {
        expect(result).toBe(resultFixture);
      });
    });
  });
});
