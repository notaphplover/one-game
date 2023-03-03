import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Builder, Handler } from '@one-game-js/backend-common';

import { Request } from '../../models/application/Request';
import { RequestWithBody } from '../../models/application/RequestWithBody';
import { Response } from '../../models/application/Response';
import { ResponseWithBody } from '../../models/application/ResponseWithBody';
import { SingleEntityHttpRequestController } from './SingleEntityHttpRequestController';

describe(SingleEntityHttpRequestController.name, () => {
  let requestParamHandlerMock: jest.Mocked<
    Handler<[Request | RequestWithBody], unknown[]>
  >;
  let useCaseHandlerMock: jest.Mocked<Handler<unknown[], unknown | undefined>>;
  let apiModelBuilderMock: jest.Mocked<Builder<unknown, [unknown]>>;
  let responseBuilderMock: jest.Mocked<
    Builder<Response | ResponseWithBody<unknown>, [unknown | undefined]>
  >;

  let singleEntityHttpRequestController: SingleEntityHttpRequestController<
    Request | RequestWithBody,
    unknown[],
    unknown,
    unknown
  >;

  beforeAll(() => {
    requestParamHandlerMock = {
      handle: jest.fn(),
    };
    useCaseHandlerMock = {
      handle: jest.fn(),
    };
    apiModelBuilderMock = {
      build: jest.fn(),
    };
    responseBuilderMock = {
      build: jest.fn(),
    };

    singleEntityHttpRequestController = new SingleEntityHttpRequestController(
      requestParamHandlerMock,
      useCaseHandlerMock,
      apiModelBuilderMock,
      responseBuilderMock,
    );
  });

  describe('when called handler() and useCaseHandler.handle() returns a model', () => {
    let result: unknown;

    let requestFixture: Request | RequestWithBody;
    let useCaseParamsFixture: unknown[];
    let modelFixture: unknown;
    let modelApiFixture: unknown;
    let responseFixture: Response | ResponseWithBody<unknown>;

    beforeAll(async () => {
      requestFixture = Symbol() as unknown as Request | RequestWithBody;
      useCaseParamsFixture = [Symbol()];
      modelFixture = Symbol();
      modelApiFixture = Symbol();
      responseFixture = Symbol() as unknown as
        | Response
        | ResponseWithBody<unknown>;

      requestParamHandlerMock.handle.mockResolvedValueOnce(
        useCaseParamsFixture,
      );
      useCaseHandlerMock.handle.mockResolvedValueOnce(modelFixture);
      apiModelBuilderMock.build.mockReturnValueOnce(modelApiFixture);
      responseBuilderMock.build.mockReturnValueOnce(responseFixture);

      result = await singleEntityHttpRequestController.handle(requestFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call requestParamHandler.handle()', () => {
      expect(requestParamHandlerMock.handle).toHaveBeenCalledTimes(1);
      expect(requestParamHandlerMock.handle).toHaveBeenCalledWith(
        requestFixture,
      );
    });

    it('should call useCaseHandler.handle()', () => {
      expect(useCaseHandlerMock.handle).toHaveBeenCalledTimes(1);
      expect(useCaseHandlerMock.handle).toHaveBeenCalledWith(
        ...useCaseParamsFixture,
      );
    });

    it('should call apiModelBuilder.build()', () => {
      expect(apiModelBuilderMock.build).toHaveBeenCalledTimes(1);
      expect(apiModelBuilderMock.build).toHaveBeenCalledWith(modelFixture);
    });

    it('should call responseBuilder.build()', () => {
      expect(responseBuilderMock.build).toHaveBeenCalledTimes(1);
      expect(responseBuilderMock.build).toHaveBeenCalledWith(modelApiFixture);
    });

    it('should return a response', () => {
      expect(result).toBe(responseFixture);
    });
  });

  describe('when called and useCaseHandler.handle() returns undefined', () => {
    let result: unknown;

    let requestFixture: Request | RequestWithBody;
    let useCaseParamsFixture: unknown[];
    let modelFixture: unknown;
    let responseFixture: Response | ResponseWithBody<unknown>;

    beforeAll(async () => {
      requestFixture = Symbol() as unknown as Request | RequestWithBody;
      useCaseParamsFixture = [Symbol()];
      modelFixture = undefined;
      responseFixture = Symbol() as unknown as
        | Response
        | ResponseWithBody<unknown>;

      requestParamHandlerMock.handle.mockResolvedValueOnce(
        useCaseParamsFixture,
      );
      useCaseHandlerMock.handle.mockResolvedValueOnce(modelFixture);
      responseBuilderMock.build.mockReturnValueOnce(responseFixture);

      result = await singleEntityHttpRequestController.handle(requestFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call requestParamHandler.handle()', () => {
      expect(requestParamHandlerMock.handle).toHaveBeenCalledTimes(1);
      expect(requestParamHandlerMock.handle).toHaveBeenCalledWith(
        requestFixture,
      );
    });

    it('should call useCaseHandler.handle()', () => {
      expect(useCaseHandlerMock.handle).toHaveBeenCalledTimes(1);
      expect(useCaseHandlerMock.handle).toHaveBeenCalledWith(
        ...useCaseParamsFixture,
      );
    });

    it('should not call apiModelBuilder.build()', () => {
      expect(apiModelBuilderMock.build).not.toHaveBeenCalled();
    });

    it('should call buildResponse()', () => {
      expect(responseBuilderMock.build).toHaveBeenCalledTimes(1);
      expect(responseBuilderMock.build).toHaveBeenCalledWith(undefined);
    });

    it('should return a response', () => {
      expect(result).toBe(responseFixture);
    });
  });
});
