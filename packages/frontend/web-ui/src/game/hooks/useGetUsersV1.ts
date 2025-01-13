import { models as apiModels } from '@cornie-js/api-models';
import {
  GetUsersV1Args,
  SerializableAppError,
} from '@cornie-js/frontend-api-rtk-query';
import { AppErrorKind } from '@cornie-js/frontend-common';
import { SerializedError } from '@reduxjs/toolkit';
import { SubscriptionOptions } from '@reduxjs/toolkit/query';

import { isSerializableAppError } from '../../common/helpers/isSerializableAppError';
import { mapUseQueryHookResultV2 } from '../../common/helpers/mapUseQueryHookResultV2';
import { cornieApi } from '../../common/http/services/cornieApi';
import { Either } from '../../common/models/Either';

export type UseQuerySubscriptionOptions = SubscriptionOptions & {
  skip?: boolean;
  refetchOnMountOrArgChange?: boolean | number;
};
export interface UseGetUsersV1Result {
  result: Either<string, apiModels.MaybeUserArrayV1> | null;
}

function getUsersV1ErrorMessage(
  error: SerializableAppError | SerializedError,
): string {
  if (!isSerializableAppError(error)) {
    return 'An error has ocurred. Is not possible to find any winner user.';
  }

  let resultErrorMessage: string;

  switch (error.kind) {
    case AppErrorKind.missingCredentials:
      resultErrorMessage = 'Missing credentials.';
      break;
    case AppErrorKind.invalidCredentials:
      resultErrorMessage = 'Invalid credentials.';
      break;
    default:
      resultErrorMessage = `An error has ocurred. Is not possible to find any winner user.`;
  }

  return resultErrorMessage;
}

export const useGetUsersV1 = (
  getUsersV1Args: GetUsersV1Args,
  subscriptionOptions: UseQuerySubscriptionOptions,
): UseGetUsersV1Result => {
  let winnerUsers: Either<string, apiModels.MaybeUserArrayV1> | null = null;

  const result = cornieApi.useGetUsersV1Query(
    getUsersV1Args,
    subscriptionOptions,
  );

  const resultMapUseQueryHookResultV2: Either<
    SerializableAppError | SerializedError,
    apiModels.MaybeUserArrayV1
  > | null = mapUseQueryHookResultV2(result);

  if (resultMapUseQueryHookResultV2 !== null) {
    if (resultMapUseQueryHookResultV2.isRight) {
      winnerUsers = {
        isRight: true,
        value: resultMapUseQueryHookResultV2.value,
      };
    } else {
      winnerUsers = {
        isRight: false,
        value: getUsersV1ErrorMessage(resultMapUseQueryHookResultV2.value),
      };
    }
  }

  return { result: winnerUsers };
};
