import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import { HttpStatus } from '@nestjs/common';

import { ResponseWithBody } from '../models/ResponseWithBody';
import { ErrorV1ResponseFromErrorBuilder } from './ErrorV1ResponseFromErrorBuilder';

describe(ErrorV1ResponseFromErrorBuilder, () => {
  let httpStatusCodeFromErrorBuilderMock: jest.Mocked<
    Builder<number, [AppError]>
  >;

  let responseFromErrorBuilder: ErrorV1ResponseFromErrorBuilder;

  beforeAll(() => {
    httpStatusCodeFromErrorBuilderMock = {
      build: jest.fn(),
    };

    responseFromErrorBuilder = new ErrorV1ResponseFromErrorBuilder(
      httpStatusCodeFromErrorBuilderMock,
    );
  });

  describe('.build()', () => {
    describe('having a non error input', () => {
      let inputFixture: unknown;

      beforeAll(() => {
        inputFixture = Symbol();
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = responseFromErrorBuilder.build(inputFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a ResponseWithBody', () => {
          const expected: ResponseWithBody<unknown> = {
            body: {
              description: expect.any(String),
            },
            headers: expect.anything() as unknown as Record<string, string>,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having an non AppError error input', () => {
      let errorDescriptionFixture: string;
      let errorFixture: Error;

      beforeAll(() => {
        errorDescriptionFixture = 'Error description';
        errorFixture = new Error(errorDescriptionFixture);
      });

      describe('when called', () => {
        let statusCodeFixture: number;

        let result: unknown;

        beforeAll(() => {
          statusCodeFixture = HttpStatus.BAD_REQUEST;

          httpStatusCodeFromErrorBuilderMock.build.mockReturnValueOnce(
            statusCodeFixture,
          );

          result = responseFromErrorBuilder.build(errorFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a ResponseWithBody', () => {
          const expected: ResponseWithBody<unknown> = {
            body: {
              description: errorDescriptionFixture,
            },
            headers: expect.anything() as unknown as Record<string, string>,
            statusCode: statusCodeFixture,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having an AppError error input', () => {
      let statusCodeFixture: number;
      let errorDescriptionFixture: string;
      let errorFixture: AppError;

      beforeAll(() => {
        statusCodeFixture = HttpStatus.BAD_REQUEST;
        errorDescriptionFixture = 'Error description';
        errorFixture = new AppError(
          AppErrorKind.contractViolation,
          errorDescriptionFixture,
        );
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          httpStatusCodeFromErrorBuilderMock.build.mockReturnValueOnce(
            statusCodeFixture,
          );

          result = responseFromErrorBuilder.build(errorFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpStatusCodeFromErrorBuilder.build()', () => {
          expect(
            httpStatusCodeFromErrorBuilderMock.build,
          ).toHaveBeenCalledTimes(1);
          expect(httpStatusCodeFromErrorBuilderMock.build).toHaveBeenCalledWith(
            errorFixture,
          );
        });

        it('should return a ResponseWithBody', () => {
          const expected: ResponseWithBody<unknown> = {
            body: {
              description: errorDescriptionFixture,
            },
            headers: expect.anything() as unknown as Record<string, string>,
            statusCode: statusCodeFixture,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });
});
