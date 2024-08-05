import { beforeAll, describe, expect, it } from '@jest/globals';

import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import { HttpStatus } from '@nestjs/common';

import { HttpStatusCodeFromErrorBuilder } from './HttpStatusCodeFromErrorBuilder';

describe(HttpStatusCodeFromErrorBuilder.name, () => {
  let httpStatusCodeFromErrorBuilder: HttpStatusCodeFromErrorBuilder;

  beforeAll(() => {
    httpStatusCodeFromErrorBuilder = new HttpStatusCodeFromErrorBuilder();
  });

  describe.each<[AppErrorKind, number]>([
    [AppErrorKind.contractViolation, HttpStatus.BAD_REQUEST],
    [AppErrorKind.entityNotFound, HttpStatus.NOT_FOUND],
    [AppErrorKind.entityConflict, HttpStatus.CONFLICT],
    [AppErrorKind.invalidCredentials, HttpStatus.FORBIDDEN],
    [AppErrorKind.missingCredentials, HttpStatus.UNAUTHORIZED],
    [AppErrorKind.unknown, HttpStatus.INTERNAL_SERVER_ERROR],
    [AppErrorKind.unprocessableOperation, HttpStatus.UNPROCESSABLE_ENTITY],
  ])(
    'having an error with "%s" kind',
    (appErrorKind: AppErrorKind, expectedResult: number) => {
      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = httpStatusCodeFromErrorBuilder.build(
            new AppError(appErrorKind),
          );
        });

        it(`should return "${expectedResult.toString()}" HTTP status code`, () => {
          expect(result).toBe(expectedResult);
        });
      });
    },
  );
});
