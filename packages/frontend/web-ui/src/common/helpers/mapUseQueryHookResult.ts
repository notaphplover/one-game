import { SerializableAppError } from '@cornie-js/frontend-api-rtk-query';
import { SerializedError } from '@reduxjs/toolkit';

import { Either } from '../models/Either';

export interface UseQueryStateResult<TResult> {
  data?: TResult | undefined;
  error?: SerializableAppError | SerializedError | undefined;
  isFetching?: boolean;
  isLoading: boolean;
  isUninitialized?: boolean;
}

export function mapUseQueryHookResult<TResult>(
  result: UseQueryStateResult<TResult | undefined>,
): Either<string, TResult> | null {
  return result.isLoading ||
    result.isFetching === true ||
    result.isUninitialized === true
    ? result.data === undefined
      ? null
      : {
          isRight: true,
          value: result.data as TResult,
        }
    : result.error === undefined
      ? {
          isRight: true,
          value: result.data as TResult,
        }
      : {
          isRight: false,
          value: result.error.message ?? '',
        };
}
