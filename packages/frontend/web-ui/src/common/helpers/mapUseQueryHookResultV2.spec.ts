import { beforeAll, describe, expect, it } from '@jest/globals';

import { SerializableAppError } from '@cornie-js/frontend-api-rtk-query';
import { AppErrorKind } from '@cornie-js/frontend-common';
import { SerializedError } from '@reduxjs/toolkit';

import { Either } from '../models/Either';
import {
  mapUseQueryHookResultV2,
  UseQueryStateResultV2,
} from './mapUseQueryHookResultV2';

describe(mapUseQueryHookResultV2.name, () => {
  describe.each<
    [
      string,
      UseQueryStateResultV2<unknown>,
      Either<SerializableAppError | SerializedError, unknown> | null,
    ]
  >([
    [
      'with isFetching true',
      {
        error: undefined,
        isFetching: true,
        isLoading: false,
      },
      null,
    ],
    [
      'with isLoading true',
      {
        error: undefined,
        isFetching: false,
        isLoading: true,
      },
      null,
    ],
    [
      'with isLoading false and result.data.isUninitialized true',
      {
        error: undefined,
        isLoading: false,
        isUninitialized: true,
      },
      null,
    ],
    [
      'with isLoading false and result.data undefined and error undefined',
      {
        data: undefined,
        error: undefined,
        isFetching: false,
        isLoading: false,
      },
      {
        isRight: true,
        value: undefined,
      },
    ],
    [
      'with isLoading false and result.data undefined and error with SerializableAppError',
      {
        data: undefined,
        error: {
          kind: AppErrorKind.contractViolation,
          message: 'message-fixture',
        },
        isFetching: false,
        isLoading: false,
      },
      {
        isRight: false,
        value: {
          kind: AppErrorKind.contractViolation,
          message: 'message-fixture',
        },
      },
    ],
    [
      'with isLoading false and result.data not undefined',
      {
        data: { foo: 'bar' },
        error: undefined,
        isFetching: false,
        isLoading: false,
      },
      {
        isRight: true,
        value: { foo: 'bar' },
      },
    ],
  ])(
    'having a UseQueryStateResult %s',
    (
      _: string,
      useQueryStateResultFixture: UseQueryStateResultV2<unknown>,
      expectedResult: Either<
        SerializableAppError | SerializedError,
        unknown
      > | null,
    ) => {
      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = mapUseQueryHookResultV2(useQueryStateResultFixture);
        });

        it('should return expected result', () => {
          expect(result).toStrictEqual(expectedResult);
        });
      });
    },
  );
});
