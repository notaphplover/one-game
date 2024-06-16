import { SerializableAppError } from '@cornie-js/frontend-api-rtk-query';
import { SerializedError } from '@reduxjs/toolkit';

import { Either } from '../models/Either';

export interface UseQueryStateResult<TResult> {
  data?: TResult;
  error?: SerializableAppError | SerializedError | undefined;
  isLoading: boolean;
}

export function mapUseQueryHookResult<TResult>(
  result: UseQueryStateResult<TResult | undefined>,
): Either<string, TResult> | null {
  return result.isLoading
    ? null
    : result.data === undefined
      ? {
          isRight: false,
          value: result.error?.message ?? '',
        }
      : {
          isRight: true,
          value: result.data,
        };
}
