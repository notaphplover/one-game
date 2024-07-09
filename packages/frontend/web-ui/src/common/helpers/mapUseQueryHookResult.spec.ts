import { beforeAll, describe, expect, it } from '@jest/globals';

import { Either } from '../models/Either';
import {
  UseQueryStateResult,
  mapUseQueryHookResult,
} from './mapUseQueryHookResult';

describe(mapUseQueryHookResult.name, () => {
  describe.each<
    [string, UseQueryStateResult<unknown>, Either<string, unknown> | null]
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
