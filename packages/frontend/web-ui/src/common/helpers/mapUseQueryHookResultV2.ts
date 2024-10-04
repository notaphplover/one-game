import { SerializableAppError } from '@cornie-js/frontend-api-rtk-query';
import { SerializedError } from '@reduxjs/toolkit';

import { Either } from '../models/Either';

export interface UseQueryStateResultV2<TResult> {
  data?: TResult | undefined;
  error?: SerializableAppError | SerializedError | undefined;
  isFetching?: boolean;
  isLoading: boolean;
  isUninitialized?: boolean;
}

export function mapUseQueryHookResultV2<TResult>(
  result: UseQueryStateResultV2<TResult | undefined>,
): Either<SerializableAppError | SerializedError, TResult> | null {
  return result.isLoading ||
    result.isFetching === true ||
    result.isUninitialized === true
    ? null
    : result.error === undefined
      ? {
          isRight: true,
          value: result.data as TResult,
        }
      : {
          isRight: false,
          value: result.error,
        };
}
