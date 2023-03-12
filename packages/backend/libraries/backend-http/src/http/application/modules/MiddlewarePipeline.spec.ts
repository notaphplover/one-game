import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Request } from '../models/Request';
import { RequestWithBody } from '../models/RequestWithBody';
import { Response } from '../models/Response';
import { ResponseWithBody } from '../models/ResponseWithBody';
import { Middleware } from './Middleware';
import { MiddlewarePipeline } from './MiddlewarePipeline';

describe(MiddlewarePipeline.name, () => {
  describe('having no middlewares', () => {
    let middlewareFixtures: Middleware[];

    beforeAll(() => {
      middlewareFixtures = [];
    });

    describe('having a MiddlewarePipeline', () => {
      let middlewarePipeline: MiddlewarePipeline;

      beforeAll(() => {
        middlewarePipeline = new MiddlewarePipeline(middlewareFixtures);
      });

      describe('.apply', () => {
        let requestFixture: Request | RequestWithBody;

        beforeAll(() => {
          requestFixture = Symbol() as unknown as Request | RequestWithBody;
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        describe('when called', () => {
          let result: unknown;

          beforeAll(async () => {
            result = await middlewarePipeline.apply(requestFixture);
          });

          it('should return undefined', () => {
            expect(result).toBeUndefined();
          });
        });
      });
    });
  });

  describe('having two middlewares', () => {
    let firstMiddlewareMock: jest.Mocked<Middleware>;
    let secondMiddlewareMock: jest.Mocked<Middleware>;
    let middlewareFixtures: Middleware[];

    beforeAll(() => {
      firstMiddlewareMock = {
        handle: jest.fn(),
      };
      secondMiddlewareMock = {
        handle: jest.fn(),
      };

      middlewareFixtures = [firstMiddlewareMock, secondMiddlewareMock];
    });

    describe('having a MiddlewarePipeline', () => {
      let middlewarePipeline: MiddlewarePipeline;

      beforeAll(() => {
        middlewarePipeline = new MiddlewarePipeline(middlewareFixtures);
      });

      describe('.apply', () => {
        let requestFixture: Request | RequestWithBody;

        beforeAll(() => {
          requestFixture = Symbol() as unknown as Request | RequestWithBody;
        });

        describe('when called', () => {
          let result: unknown;

          beforeAll(async () => {
            result = await middlewarePipeline.apply(requestFixture);
          });

          afterAll(() => {
            jest.clearAllMocks();
          });

          it('should call first middleware.handle()', () => {
            expect(firstMiddlewareMock.handle).toHaveBeenCalledTimes(1);
            expect(firstMiddlewareMock.handle).toHaveBeenCalledWith(
              requestFixture,
              expect.any(Function),
            );
          });

          it('should call second middleware.handle()', () => {
            expect(secondMiddlewareMock.handle).toHaveBeenCalledTimes(1);
            expect(secondMiddlewareMock.handle).toHaveBeenCalledWith(
              requestFixture,
              expect.any(Function),
            );
          });

          it('should return undefined', () => {
            expect(result).toBeUndefined();
          });
        });

        describe('when called, and the first middleware calls halt()', () => {
          let responseFixture: Response | ResponseWithBody<unknown>;

          let result: unknown;

          beforeAll(async () => {
            responseFixture = Symbol() as unknown as
              | Response
              | ResponseWithBody<unknown>;

            firstMiddlewareMock.handle.mockImplementationOnce(
              (
                _request: Request | RequestWithBody,
                halt: (response: Response | ResponseWithBody<unknown>) => void,
              ) => {
                halt(responseFixture);
              },
            );

            result = await middlewarePipeline.apply(requestFixture);
          });

          afterAll(() => {
            jest.clearAllMocks();
          });

          it('should call first middleware.handle()', () => {
            expect(firstMiddlewareMock.handle).toHaveBeenCalledTimes(1);
            expect(firstMiddlewareMock.handle).toHaveBeenCalledWith(
              requestFixture,
              expect.any(Function),
            );
          });

          it('should not call second middleware.handle()', () => {
            expect(secondMiddlewareMock.handle).not.toHaveBeenCalled();
          });

          it('should return a response', () => {
            expect(result).toBe(responseFixture);
          });
        });

        describe('when called, and the second middleware calls halt()', () => {
          let responseFixture: Response | ResponseWithBody<unknown>;

          let result: unknown;

          beforeAll(async () => {
            responseFixture = Symbol() as unknown as
              | Response
              | ResponseWithBody<unknown>;

            secondMiddlewareMock.handle.mockImplementationOnce(
              (
                _request: Request | RequestWithBody,
                halt: (response: Response | ResponseWithBody<unknown>) => void,
              ) => {
                halt(responseFixture);
              },
            );

            result = await middlewarePipeline.apply(requestFixture);
          });

          afterAll(() => {
            jest.clearAllMocks();
          });

          it('should call first middleware.handle()', () => {
            expect(firstMiddlewareMock.handle).toHaveBeenCalledTimes(1);
            expect(firstMiddlewareMock.handle).toHaveBeenCalledWith(
              requestFixture,
              expect.any(Function),
            );
          });

          it('should call second middleware.handle()', () => {
            expect(secondMiddlewareMock.handle).toHaveBeenCalledTimes(1);
            expect(secondMiddlewareMock.handle).toHaveBeenCalledWith(
              requestFixture,
              expect.any(Function),
            );
          });

          it('should return a response', () => {
            expect(result).toBe(responseFixture);
          });
        });
      });
    });
  });
});
