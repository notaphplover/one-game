import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Builder, Handler, Left, Right } from '@cornie-js/backend-common';

import { Request } from '../models/Request';
import { RequestWithBody } from '../models/RequestWithBody';
import { Response } from '../models/Response';
import { ResponseWithBody } from '../models/ResponseWithBody';
import { MiddlewarePipeline } from '../modules/MiddlewarePipeline';
import { SsePublisher } from '../modules/SsePublisher';
import { SseTeardownExecutor } from '../modules/SseTeardownExecutor';
import { HttpSseRequestController } from './HttpSseRequestController';

class HttpSseRequestControllerMock<
  TRequest extends Request | RequestWithBody = Request | RequestWithBody,
  TUseCaseParams extends unknown[] = unknown[],
> extends HttpSseRequestController<TRequest, TUseCaseParams> {
  readonly #handleUseCaseMock: jest.Mock<
    (
      publisher: SsePublisher,
      ...useCaseParams: TUseCaseParams
    ) => Promise<[Response, SseTeardownExecutor]>
  >;

  constructor(
    requestParamHandler: Handler<[TRequest], TUseCaseParams>,
    responseFromErrorBuilder: Builder<
      Response | ResponseWithBody<unknown>,
      [unknown]
    >,
    middlewarePipeline: MiddlewarePipeline,
    handleUseCaseMock: jest.Mock<
      (
        publisher: SsePublisher,
        ...useCaseParams: TUseCaseParams
      ) => Promise<[Response, SseTeardownExecutor]>
    >,
  ) {
    super(requestParamHandler, responseFromErrorBuilder, middlewarePipeline);

    this.#handleUseCaseMock = handleUseCaseMock;
  }

  protected override async _handleUseCase(
    publisher: SsePublisher,
    ...useCaseParams: TUseCaseParams
  ): Promise<[Response, SseTeardownExecutor]> {
    return this.#handleUseCaseMock(publisher, ...useCaseParams);
  }
}

describe(HttpSseRequestController.name, () => {
  let requestParamHandlerMock: jest.Mocked<
    Handler<[Request | RequestWithBody], unknown[]>
  >;
  let responseFromErrorBuilderMock: jest.Mocked<
    Builder<Response | ResponseWithBody<unknown>, [unknown]>
  >;
  let middlewarePipelineMock: jest.Mocked<MiddlewarePipeline>;
  let handleUseCaseMock: jest.Mock<
    (
      publisher: SsePublisher,
      ...useCaseParams: unknown[]
    ) => Promise<[Response, SseTeardownExecutor]>
  >;
  let httpSseRequestControllerMock: HttpSseRequestControllerMock;

  beforeAll(() => {
    requestParamHandlerMock = {
      handle: jest.fn(),
    };
    responseFromErrorBuilderMock = {
      build: jest.fn(),
    };
    middlewarePipelineMock = {
      apply: jest.fn(),
    } as Partial<
      jest.Mocked<MiddlewarePipeline>
    > as jest.Mocked<MiddlewarePipeline>;
    handleUseCaseMock = jest.fn();

    httpSseRequestControllerMock = new HttpSseRequestControllerMock(
      requestParamHandlerMock,
      responseFromErrorBuilderMock,
      middlewarePipelineMock,
      handleUseCaseMock,
    );
  });

  describe('.handle', () => {
    let requestFixture: Request | RequestWithBody;
    let ssePublisherFixtures: SsePublisher;

    beforeAll(() => {
      requestFixture = Symbol() as unknown as Request | RequestWithBody;
      ssePublisherFixtures = Symbol() as unknown as SsePublisher;
    });

    describe('when called, and middlewarePipeline.apply() returns a Response', () => {
      let responseFixture: Response | ResponseWithBody<unknown>;
      let result: unknown;

      beforeAll(async () => {
        responseFixture = Symbol() as unknown as
          | Response
          | ResponseWithBody<unknown>;

        middlewarePipelineMock.apply.mockResolvedValueOnce(responseFixture);

        result = await httpSseRequestControllerMock.handle(
          requestFixture,
          ssePublisherFixtures,
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

      it('should return a Left value', () => {
        const expected: Left<Response | ResponseWithBody<unknown>> = {
          isRight: false,
          value: responseFixture,
        };

        expect(result).toStrictEqual(expected);
      });
    });

    describe('when called, and middlewarePipeline.apply() returns undefined', () => {
      let responseFixture: Response;
      let useCaseParamsFixtures: unknown[];
      let sseTeardownExecutorFixture: SseTeardownExecutor;
      let result: unknown;

      beforeAll(async () => {
        responseFixture = Symbol() as unknown as
          | Response
          | ResponseWithBody<unknown>;
        useCaseParamsFixtures = [Symbol()];
        sseTeardownExecutorFixture = Symbol() as unknown as SseTeardownExecutor;

        middlewarePipelineMock.apply.mockResolvedValueOnce(undefined);
        requestParamHandlerMock.handle.mockResolvedValueOnce(
          useCaseParamsFixtures,
        );
        handleUseCaseMock.mockResolvedValueOnce([
          responseFixture,
          sseTeardownExecutorFixture,
        ]);

        result = await httpSseRequestControllerMock.handle(
          requestFixture,
          ssePublisherFixtures,
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

      it('should call handleUseCase()', () => {
        expect(handleUseCaseMock).toHaveBeenCalledTimes(1);
        expect(handleUseCaseMock).toHaveBeenCalledWith(
          ssePublisherFixtures,
          ...useCaseParamsFixtures,
        );
      });

      it('should return a Right value', () => {
        const expected: Right<[Response, SseTeardownExecutor]> = {
          isRight: true,
          value: [responseFixture, sseTeardownExecutorFixture],
        };

        expect(result).toStrictEqual(expected);
      });
    });

    describe('when called, and middlewarePipeline.apply() throws an Error', () => {
      let errorFixture: unknown;
      let responseFixture: Response | ResponseWithBody<unknown>;
      let result: unknown;

      beforeAll(async () => {
        errorFixture = Symbol();
        responseFixture = Symbol() as unknown as
          | Response
          | ResponseWithBody<unknown>;

        middlewarePipelineMock.apply.mockRejectedValueOnce(errorFixture);

        responseFromErrorBuilderMock.build.mockReturnValueOnce(responseFixture);

        result = await httpSseRequestControllerMock.handle(
          requestFixture,
          ssePublisherFixtures,
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

      it('should call responseFromErrorBuilder.build()', () => {
        expect(responseFromErrorBuilderMock.build).toHaveBeenCalledTimes(1);
        expect(responseFromErrorBuilderMock.build).toHaveBeenCalledWith(
          errorFixture,
        );
      });

      it('should return a Left value', () => {
        const expected: Left<Response | ResponseWithBody<unknown>> = {
          isRight: false,
          value: responseFixture,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
