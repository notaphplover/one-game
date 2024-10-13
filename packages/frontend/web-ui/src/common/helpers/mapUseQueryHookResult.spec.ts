import { beforeAll, describe, expect, it } from '@jest/globals';

import { Either } from '../models/Either';
import {
  mapUseQueryHookResult,
  UseQueryStateResult,
} from './mapUseQueryHookResult';

describe(mapUseQueryHookResult.name, () => {
  describe.each<
    [string, UseQueryStateResult<unknown>, Either<string, unknown> | null]
  >([
    [
      'with isFetching true and no data',
      {
        error: undefined,
        isFetching: true,
        isLoading: false,
      },
      null,
    ],
    [
      'with isFetching true and not undefined data',
      {
        data: 'data-fixture',
        error: undefined,
        isFetching: true,
        isLoading: false,
      },
      {
        isRight: true,
        value: 'data-fixture',
      },
    ],
    [
      'with isLoading true and no data',
      {
        error: undefined,
        isFetching: false,
        isLoading: true,
      },
      null,
    ],
    [
      'with isLoading true and not undefined data',
      {
        data: 'data-fixture',
        error: undefined,
        isFetching: false,
        isLoading: true,
      },
      {
        isRight: true,
        value: 'data-fixture',
      },
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
      'with isLoading false and result.data undefined and error with string',
      {
        data: undefined,
        error: {
          message: 'message-fixture',
        },
        isFetching: false,
        isLoading: false,
      },
      {
        isRight: false,
        value: 'message-fixture',
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
      useQueryStateResultFixture: UseQueryStateResult<unknown>,
      expectedResult: Either<string, unknown> | null,
    ) => {
      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = mapUseQueryHookResult(useQueryStateResultFixture);
        });

        it('should return expected result', () => {
          expect(result).toStrictEqual(expectedResult);
        });
      });
    },
  );
});
