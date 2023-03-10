import { beforeAll, describe, expect, it } from '@jest/globals';

import { AppError, AppErrorKind } from '@one-game-js/backend-common';

import { ResponseWithBody } from '../models/ResponseWithBody';
import { ErrorV1ResponseFromErrorBuilder } from './ErrorV1ResponseFromErrorBuilder';

describe(ErrorV1ResponseFromErrorBuilder, () => {
  let responseFromErrorBuilder: ErrorV1ResponseFromErrorBuilder;

  beforeAll(() => {
    responseFromErrorBuilder = new ErrorV1ResponseFromErrorBuilder();
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

        it('should return a ResponseWithBody', () => {
          const expected: ResponseWithBody<unknown> = {
            body: {
              description: expect.any(String),
            },
            headers: expect.anything() as unknown as Record<string, string>,
            statusCode: 500,
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
        let result: unknown;

        beforeAll(() => {
          result = responseFromErrorBuilder.build(errorFixture);
        });

        it('should return a ResponseWithBody', () => {
          const expected: ResponseWithBody<unknown> = {
            body: {
              description: errorDescriptionFixture,
            },
            headers: expect.anything() as unknown as Record<string, string>,
            statusCode: 500,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe.each<[AppErrorKind, number]>([
      [AppErrorKind.contractViolation, 400],
      [AppErrorKind.entityConflict, 409],
      [AppErrorKind.unknown, 500],
      [AppErrorKind.unprocessableOperation, 422],
    ])(
      'having a %s AppError error input',
      (errorKind: AppErrorKind, statusCode: number) => {
        let errorDescriptionFixture: string;
        let errorFixture: AppError;

        beforeAll(() => {
          errorDescriptionFixture = 'Error description';
          errorFixture = new AppError(errorKind, errorDescriptionFixture);
        });

        describe('when called', () => {
          let result: unknown;

          beforeAll(() => {
            result = responseFromErrorBuilder.build(errorFixture);
          });

          it('should return a ResponseWithBody', () => {
            const expected: ResponseWithBody<unknown> = {
              body: {
                description: errorDescriptionFixture,
              },
              headers: expect.anything() as unknown as Record<string, string>,
              statusCode,
            };

            expect(result).toStrictEqual(expected);
          });
        });
      },
    );
  });
});
