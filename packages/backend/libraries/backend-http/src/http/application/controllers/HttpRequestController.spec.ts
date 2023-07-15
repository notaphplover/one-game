import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Builder, Handler } from '@cornie-js/backend-common';

import { Request } from '../models/Request';
import { RequestWithBody } from '../models/RequestWithBody';
import { Response } from '../models/Response';
import { ResponseWithBody } from '../models/ResponseWithBody';
import { MiddlewarePipeline } from '../modules/MiddlewarePipeline';
import { HttpRequestController } from './HttpRequestController';

class HttpRequestControllerMock extends HttpRequestController<
  Request | RequestWithBody,
  unknown[],
  unknown
> {
  readonly #useCaseHandlerMock: jest.Mock<
    (...useCaseParams: unknown[]) => Promise<unknown>
  >;

  constructor(
    requestParamHandler: Handler<[Request | RequestWithBody], unknown[]>,
    responseBuilder: Builder<Response | ResponseWithBody<unknown>, [unknown]>,
    responseFromErrorBuilder: Builder<
      Response | ResponseWithBody<unknown>,
      [unknown]
    >,
    useCaseHandler: jest.Mock<
      (...useCaseParams: unknown[]) => Promise<unknown>
    >,
  ) {
    super(requestParamHandler, responseBuilder, responseFromErrorBuilder);

    this.#useCaseHandlerMock = useCaseHandler;
  }

  protected async _handleUseCase(
    ...useCaseParams: unknown[]
  ): Promise<unknown> {
    return this.#useCaseHandlerMock(...useCaseParams);
  }
}

class HttpRequestControllerWithMiddlewarePipelineMock extends HttpRequestController<
  Request | RequestWithBody,
  unknown[],
  unknown
> {
  readonly #useCaseHandlerMock: jest.Mock<
    (...useCaseParams: unknown[]) => Promise<unknown>
  >;

  constructor(
    requestParamHandler: Handler<[Request | RequestWithBody], unknown[]>,
    responseBuilder: Builder<Response | ResponseWithBody<unknown>, [unknown]>,
    responseFromErrorBuilder: Builder<
      Response | ResponseWithBody<unknown>,
      [unknown]
    >,
    middlewarePipeline: MiddlewarePipeline,
    useCaseHandler: jest.Mock<
      (...useCaseParams: unknown[]) => Promise<unknown>
    >,
  ) {
    super(
      requestParamHandler,
      responseBuilder,
      responseFromErrorBuilder,
      middlewarePipeline,
    );

    this.#useCaseHandlerMock = useCaseHandler;
  }

  protected async _handleUseCase(
    ...useCaseParams: unknown[]
  ): Promise<unknown> {
    return this.#useCaseHandlerMock(...useCaseParams);
  }
}

describe(HttpRequestController.name, () => {
  describe('having no MiddlewarePipeline', () => {
    let requestParamHandlerMock: jest.Mocked<
      Handler<[Request | RequestWithBody], unknown[]>
    >;
    let responseBuilderMock: jest.Mocked<
      Builder<Response | ResponseWithBody<unknown>, [unknown | undefined]>
    >;

    let responseFromErrorBuilderMock: jest.Mocked<
      Builder<Response | ResponseWithBody<unknown>, [unknown]>
    >;

    let useCaseHandlerMock: jest.Mock<
      (...useCaseParams: unknown[]) => Promise<unknown>
    >;

    let httpRequestController: HttpRequestControllerMock;

    beforeAll(() => {
      requestParamHandlerMock = {
        handle: jest.fn(),
      };
      responseBuilderMock = {
        build: jest.fn(),
      };
      responseFromErrorBuilderMock = {
        build: jest.fn(),
      };
      useCaseHandlerMock = jest.fn();

      httpRequestController = new HttpRequestControllerMock(
        requestParamHandlerMock,
        responseBuilderMock,
        responseFromErrorBuilderMock,
        useCaseHandlerMock,
      );
    });

    describe('.handle', () => {
      let requestFixture: Request | RequestWithBody;

      beforeAll(() => {
        requestFixture = Symbol() as unknown as Request | RequestWithBody;
      });

      describe('when called', () => {
        let result: unknown;

        let useCaseParamsFixture: unknown[];
        let modelFixture: unknown;
        let responseFixture: Response | ResponseWithBody<unknown>;

        beforeAll(async () => {
          useCaseParamsFixture = [Symbol()];
          modelFixture = Symbol();
          responseFixture = Symbol() as unknown as
            | Response
            | ResponseWithBody<unknown>;

          requestParamHandlerMock.handle.mockResolvedValueOnce(
            useCaseParamsFixture,
          );
          useCaseHandlerMock.mockResolvedValueOnce(modelFixture);
          responseBuilderMock.build.mockReturnValueOnce(responseFixture);

          result = await httpRequestController.handle(requestFixture);
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
          expect(useCaseHandlerMock).toHaveBeenCalledTimes(1);
          expect(useCaseHandlerMock).toHaveBeenCalledWith(
            ...useCaseParamsFixture,
          );
        });

        it('should call responseBuilder.build()', () => {
          expect(responseBuilderMock.build).toHaveBeenCalledTimes(1);
          expect(responseBuilderMock.build).toHaveBeenCalledWith(modelFixture);
        });

        it('should return a response', () => {
          expect(result).toBe(responseFixture);
        });
      });

      describe('when called, and an error is thrown', () => {
        let result: unknown;

        let errorFixture: Error;
        let responseFixture: Response | ResponseWithBody<unknown>;

        beforeAll(async () => {
          errorFixture = new Error('Sample error');
          responseFixture = Symbol() as unknown as
            | Response
            | ResponseWithBody<unknown>;

          requestParamHandlerMock.handle.mockRejectedValueOnce(errorFixture);
          responseFromErrorBuilderMock.build.mockReturnValueOnce(
            responseFixture,
          );

          result = await httpRequestController.handle(requestFixture);
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

        it('should call responseFromErrorBuilder.build()', () => {
          expect(responseFromErrorBuilderMock.build).toHaveBeenCalledTimes(1);
          expect(responseFromErrorBuilderMock.build).toHaveBeenCalledWith(
            errorFixture,
          );
        });

        it('should return a response', () => {
          expect(result).toBe(responseFixture);
        });
      });
    });
  });

  describe('having a MiddlewarePipeline', () => {
    let requestParamHandlerMock: jest.Mocked<
      Handler<[Request | RequestWithBody], unknown[]>
    >;
    let responseBuilderMock: jest.Mocked<
      Builder<Response | ResponseWithBody<unknown>, [unknown | undefined]>
    >;

    let responseFromErrorBuilderMock: jest.Mocked<
      Builder<Response | ResponseWithBody<unknown>, [unknown]>
    >;

    let middlewarePipelineMock: jest.Mocked<MiddlewarePipeline>;

    let useCaseHandlerMock: jest.Mock<
      (...useCaseParams: unknown[]) => Promise<unknown>
    >;

    let httpRequestController: HttpRequestControllerWithMiddlewarePipelineMock;

    beforeAll(() => {
      requestParamHandlerMock = {
        handle: jest.fn(),
      };
      responseBuilderMock = {
        build: jest.fn(),
      };
      responseFromErrorBuilderMock = {
        build: jest.fn(),
      };
      middlewarePipelineMock = {
        apply: jest.fn(),
      } as Partial<
        jest.Mocked<MiddlewarePipeline>
      > as jest.Mocked<MiddlewarePipeline>;
      useCaseHandlerMock = jest.fn();

      httpRequestController =
        new HttpRequestControllerWithMiddlewarePipelineMock(
          requestParamHandlerMock,
          responseBuilderMock,
          responseFromErrorBuilderMock,
          middlewarePipelineMock,
          useCaseHandlerMock,
        );
    });

    describe('.handle', () => {
      let requestFixture: Request | RequestWithBody;

      beforeAll(() => {
        requestFixture = Symbol() as unknown as Request | RequestWithBody;
      });

      describe('when called, and middlewarePipeline.handle() resolves to undefined', () => {
        let result: unknown;

        let useCaseParamsFixture: unknown[];
        let modelFixture: unknown;
        let responseFixture: Response | ResponseWithBody<unknown>;

        beforeAll(async () => {
          useCaseParamsFixture = [Symbol()];
          modelFixture = Symbol();
          responseFixture = Symbol() as unknown as
            | Response
            | ResponseWithBody<unknown>;

          middlewarePipelineMock.apply.mockResolvedValueOnce(undefined);

          requestParamHandlerMock.handle.mockResolvedValueOnce(
            useCaseParamsFixture,
          );
          useCaseHandlerMock.mockResolvedValueOnce(modelFixture);
          responseBuilderMock.build.mockReturnValueOnce(responseFixture);

          result = await httpRequestController.handle(requestFixture);
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
          expect(useCaseHandlerMock).toHaveBeenCalledTimes(1);
          expect(useCaseHandlerMock).toHaveBeenCalledWith(
            ...useCaseParamsFixture,
          );
        });

        it('should call responseBuilder.build()', () => {
          expect(responseBuilderMock.build).toHaveBeenCalledTimes(1);
          expect(responseBuilderMock.build).toHaveBeenCalledWith(modelFixture);
        });

        it('should return a response', () => {
          expect(result).toBe(responseFixture);
        });
      });

      describe('when called, and middlewarePipeline.handle() resolves to a response', () => {
        let result: unknown;

        let responseFixture: Response | ResponseWithBody<unknown>;

        beforeAll(async () => {
          responseFixture = Symbol() as unknown as
            | Response
            | ResponseWithBody<unknown>;

          middlewarePipelineMock.apply.mockResolvedValueOnce(responseFixture);

          result = await httpRequestController.handle(requestFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should not call requestParamHandler.handle()', () => {
          expect(requestParamHandlerMock.handle).not.toHaveBeenCalled();
        });

        it('should not call useCaseHandler.handle()', () => {
          expect(useCaseHandlerMock).not.toHaveBeenCalled();
        });

        it('should not call responseBuilder.build()', () => {
          expect(responseBuilderMock.build).not.toHaveBeenCalled();
        });

        it('should return a response', () => {
          expect(result).toBe(responseFixture);
        });
      });
    });
  });
});
