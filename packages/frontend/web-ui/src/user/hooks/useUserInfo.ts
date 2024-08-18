import { models as apiModels } from '@cornie-js/api-models';
import { useEffect, useState } from 'react';

import { validateConfirmPassword } from '../../auth/helpers/validateConfirmPassword';
import { validatePassword } from '../../auth/helpers/validatePassword';
import { mapUseQueryHookResult } from '../../common/helpers/mapUseQueryHookResult';
import { cornieApi } from '../../common/http/services/cornieApi';
import { Either } from '../../common/models/Either';
import { validateUsername } from '../helpers/validateUsername';
import { UserInfoStatus } from '../models/UserInfoStatus';
import { UseUserInfoActions } from '../models/UseUserInfoActions';
import {
  BaseUserInfoFormFields,
  UseUserInfoData,
} from '../models/UseUserInfoData';
import { UserInfoFormValidationResult } from '../pages/UserInfo';

export const useUserInfo = (): [UseUserInfoData, UseUserInfoActions] => {
  const [userV1, setUserV1] = useState<apiModels.UserV1 | null>(null);

  const [userInfoData, setUserInfoData] = useState<UseUserInfoData>({
    form: {
      fields: {
        confirmPassword: null,
        email: null,
        name: null,
        password: null,
      },
      validation: {},
    },
    status: UserInfoStatus.fetchingUser,
  });

  const updateForm = (fields: BaseUserInfoFormFields): void => {
    const updatedUserInfoData: UseUserInfoData = { ...userInfoData };

    updatedUserInfoData.form = {
      fields,
      validation: { ...userInfoData.form.validation },
    };

    setUserInfoData(updatedUserInfoData);
  };

  const onConfirmPasswordChanged = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    updateForm({
      ...userInfoData.form.fields,
      confirmPassword: event.currentTarget.value,
    });
  };

  function onNameChanged(event: React.ChangeEvent<HTMLInputElement>): void {
    updateForm({
      ...userInfoData.form.fields,
      name: event.currentTarget.value,
    });
  }

  function onPasswordChanged(event: React.ChangeEvent<HTMLInputElement>): void {
    updateForm({
      ...userInfoData.form.fields,
      password: event.currentTarget.value,
    });
  }

  function onSubmit(event: React.FormEvent): void {
    event.preventDefault();

    if (userInfoData.status !== UserInfoStatus.idle) {
      return;
    }

    const formValidation: UserInfoFormValidationResult = {};

    const userMeUpdateQueryV1: apiModels.UserMeUpdateQueryV1 = {};

    if (userInfoData.form.fields.confirmPassword !== null) {
      const passwordValidation: Either<string[], undefined> =
        validateConfirmPassword(
          userInfoData.form.fields.password,
          userInfoData.form.fields.confirmPassword,
        );

      if (!passwordValidation.isRight) {
        formValidation.confirmPassword = passwordValidation.value.join(' ');
      }
    }

    const nameValidation: Either<string, undefined> = validateUsername(
      userInfoData.form.fields.name,
    );

    if (nameValidation.isRight) {
      userMeUpdateQueryV1.name = userInfoData.form.fields.name;
    } else {
      formValidation.name = nameValidation.value;
    }

    if (userInfoData.form.fields.password !== null) {
      const passwordValidation: Either<string, undefined> = validatePassword(
        userInfoData.form.fields.password,
      );

      if (passwordValidation.isRight) {
        userMeUpdateQueryV1.password = userInfoData.form.fields.password;
      } else {
        formValidation.password = passwordValidation.value;
      }
    }

    if (Object.keys(formValidation).length === 0) {
      setUserInfoData({
        form: {
          fields: {
            ...userInfoData.form.fields,
          },
          validation: formValidation,
        },
        status: userInfoData.status,
      });

      updateUser(userMeUpdateQueryV1);
    } else {
      setUserInfoData({
        form: {
          fields: {
            ...userInfoData.form.fields,
          },
          validation: formValidation,
        },
        status: UserInfoStatus.idle,
      });
    }
  }

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
    setUserInfoData({
      form: {
        fields: { ...userInfoData.form.fields },
        validation: { ...userInfoData.form.validation },
      },
      status: UserInfoStatus.updatingUser,
    });

    void triggerUpdateUser({
      params: [userMeUpdateQueryV1],
    });
  }

  useEffect(() => {
    if (usersV1MeResult !== null && usersV1MeDetailResult !== null) {
      if (usersV1MeResult.isRight && usersV1MeDetailResult.isRight) {
        setUserInfoData({
          form: {
            fields: {
              ...userInfoData.form.fields,
              email: usersV1MeDetailResult.value.email,
              name: usersV1MeResult.value.name,
            },
            validation: { ...userInfoData.form.validation },
          },
          status: UserInfoStatus.idle,
        });
        setUserV1(usersV1MeResult.value);
      } else {
        setUserInfoData({
          form: {
            fields: { ...userInfoData.form.fields },
            validation: { ...userInfoData.form.validation },
          },
          status: UserInfoStatus.userFetchError,
        });
        setUserV1(null);
      }
    }
  }, [useGetUsersV1MeQueryResult, useGetUsersV1MeDetailQueryResult]);

  useEffect(() => {
    if (userInfoData.status === UserInfoStatus.idle && userV1 !== null) {
      setUserInfoData({
        form: {
          fields: { ...userInfoData.form.fields, name: userV1.name },
          validation: { ...userInfoData.form.validation },
        },
        status: userInfoData.status,
      });
    }
  }, [userV1]);

  return [
    userInfoData,
    {
      handlers: {
        onConfirmPasswordChanged,
        onNameChanged,
        onPasswordChanged,
        onSubmit,
      },
    },
  ];
};
