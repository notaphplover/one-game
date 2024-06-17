import { models as apiModels } from '@cornie-js/api-models';
import { useEffect, useState } from 'react';

import {
  UseQueryStateResult,
  mapUseQueryHookResult,
} from '../../common/helpers/mapUseQueryHookResult';
import { cornieApi } from '../../common/http/services/cornieApi';
import { Either } from '../../common/models/Either';
import { UserInfoStatus } from '../models/UserInfoStatus';

export interface UseUserInfoResult {
  status: UserInfoStatus;
  updateUser: (userMeUpdateQueryV1: apiModels.UserMeUpdateQueryV1) => void;
  usersV1MeResult: Either<string, apiModels.UserV1> | null;
  useGetUsersV1MeQueryResult: UseQueryStateResult<apiModels.UserV1>;
}

export const useUserInfo = (): UseUserInfoResult => {
  const [status, setStatus] = useState<UserInfoStatus>(
    UserInfoStatus.fetchingUser,
  );

  const [triggerUpdateUser] = cornieApi.useUpdateUsersV1MeMutation();

  const useGetUsersV1MeQueryResult = cornieApi.useGetUsersV1MeQuery({
    params: [],
  });

  const usersV1MeResult: Either<string, apiModels.UserV1> | null =
    mapUseQueryHookResult(useGetUsersV1MeQueryResult);

  function updateUser(
    userMeUpdateQueryV1: apiModels.UserMeUpdateQueryV1,
  ): void {
    setStatus(UserInfoStatus.updatingUser);

    void triggerUpdateUser({
      params: [userMeUpdateQueryV1],
    });
  }

  useEffect(() => {
    if (usersV1MeResult !== null) {
      if (usersV1MeResult.isRight) {
        setStatus(UserInfoStatus.idle);
      } else {
        setStatus(UserInfoStatus.userFetchError);
      }
    }
  }, [useGetUsersV1MeQueryResult]);

  return {
    status,
    updateUser,
    useGetUsersV1MeQueryResult,
    usersV1MeResult,
  };
};
