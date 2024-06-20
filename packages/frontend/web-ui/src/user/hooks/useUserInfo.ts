import { models as apiModels } from '@cornie-js/api-models';
import { useEffect, useState } from 'react';

import { mapUseQueryHookResult } from '../../common/helpers/mapUseQueryHookResult';
import { cornieApi } from '../../common/http/services/cornieApi';
import { Either } from '../../common/models/Either';
import { UserInfoStatus } from '../models/UserInfoStatus';
import { UseUserInfoResult } from '../models/UseUserInfoResult';

export const useUserInfo = (): UseUserInfoResult => {
  const [result, setResult] = useState<UseUserInfoResult>({
    status: UserInfoStatus.fetchingUser,
    updateUser,
    userDetailV1: null,
    userV1: null,
  });

  const [triggerUpdateUser] = cornieApi.useUpdateUsersV1MeMutation();

  const useGetUsersV1MeDetailQueryResult = cornieApi.useGetUsersV1MeDetailQuery(
    {
      params: [],
    },
  );

  const useGetUsersV1MeQueryResult = cornieApi.useGetUsersV1MeQuery({
    params: [],
  });

  const usersV1MeDetailResult: Either<string, apiModels.UserDetailV1> | null =
    mapUseQueryHookResult(useGetUsersV1MeDetailQueryResult);

  const usersV1MeResult: Either<string, apiModels.UserV1> | null =
    mapUseQueryHookResult(useGetUsersV1MeQueryResult);

  function updateUser(
    userMeUpdateQueryV1: apiModels.UserMeUpdateQueryV1,
  ): void {
    setResult({
      status: UserInfoStatus.updatingUser,
      updateUser,
      userDetailV1: result.userDetailV1,
      userV1: result.userV1,
    });

    void triggerUpdateUser({
      params: [userMeUpdateQueryV1],
    });
  }

  useEffect(() => {
    if (usersV1MeResult !== null && usersV1MeDetailResult !== null) {
      if (usersV1MeResult.isRight && usersV1MeDetailResult.isRight) {
        setResult({
          status: UserInfoStatus.idle,
          updateUser,
          userDetailV1: usersV1MeDetailResult.value,
          userV1: usersV1MeResult.value,
        });
      } else {
        setResult({
          status: UserInfoStatus.userFetchError,
          updateUser,
          userDetailV1: null,
          userV1: null,
        });
      }
    }
  }, [useGetUsersV1MeQueryResult, useGetUsersV1MeDetailQueryResult]);

  return result;
};
