import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Builder, Handler } from '@one-game-js/backend-common';

import { Request } from '../../models/application/Request';
import { RequestWithBody } from '../../models/application/RequestWithBody';
import { Response } from '../../models/application/Response';
import { ResponseWithBody } from '../../models/application/ResponseWithBody';
import { SingleEntityHttpRequestController } from './SingleEntityHttpRequestController';

class SingleEntityHttpRequestControllerMock extends SingleEntityHttpRequestController<
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
    useCaseHandler: jest.Mock<
      (...useCaseParams: unknown[]) => Promise<unknown>
    >,
  ) {
    super(requestParamHandler, responseBuilder);

    this.#useCaseHandlerMock = useCaseHandler;
  }

  protected async _handleUseCase(
    ...useCaseParams: unknown[]
  ): Promise<unknown> {
    return this.#useCaseHandlerMock(...useCaseParams);
  }
}

describe(SingleEntityHttpRequestController.name, () => {
  let requestParamHandlerMock: jest.Mocked<
    Handler<[Request | RequestWithBody], unknown[]>
  >;
  let responseBuilderMock: jest.Mocked<
    Builder<Response | ResponseWithBody<unknown>, [unknown | undefined]>
  >;

  let useCaseHandlerMock: jest.Mock<
    (...useCaseParams: unknown[]) => Promise<unknown>
  >;

  let singleEntityHttpRequestController: SingleEntityHttpRequestControllerMock;

  beforeAll(() => {
    requestParamHandlerMock = {
      handle: jest.fn(),
    };
    useCaseHandlerMock = jest.fn();
    responseBuilderMock = {
      build: jest.fn(),
    };

    singleEntityHttpRequestController =
      new SingleEntityHttpRequestControllerMock(
        requestParamHandlerMock,
        responseBuilderMock,
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
  });
});
