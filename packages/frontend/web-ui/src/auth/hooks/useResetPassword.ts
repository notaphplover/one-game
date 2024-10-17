import { models as apiModels } from '@cornie-js/api-models';
import { SerializableAppError } from '@cornie-js/frontend-api-rtk-query';
import { SerializedError } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';

import login from '../../app/store/actions/login';
import { useAppDispatch } from '../../app/store/hooks';
import { isSerializableAppError } from '../../common/helpers/isSerializableAppError';
import { mapUseQueryHookResultV2 } from '../../common/helpers/mapUseQueryHookResultV2';
import { useUrlLikeLocation } from '../../common/hooks/useUrlLikeLocation';
import { cornieApi } from '../../common/http/services/cornieApi';
import { Either } from '../../common/models/Either';
import { UrlLikeLocation } from '../../common/models/UrlLikeLocation';
import { UNEXPECTED_AUTH_ERROR_MESSAGE } from '../helpers/createAuthErrorMessages';
import { getCreateAuthErrorMessage } from '../helpers/getCreateAuthErrorMessage';
import { getUpdateUserMeErrorMessage } from '../helpers/getUpdateUserMeErrorMessage';
import { validateConfirmPassword } from '../helpers/validateConfirmPassword';
import { validatePassword } from '../helpers/validatePassword';
import { UseResetPasswordActions } from '../models/UseResetPasswordActions';
import {
  ResetPasswordFormFields,
  ResetPasswordFormValidationResult,
  UseResetPasswordData,
} from '../models/UseResetPasswordData';
import { UseResetPasswordStatus } from '../models/UseResetPasswordStatus';

const CODE_QUERY_PARAM: string = 'code';
const TYPE_ERROR_MUTATION: string = 'auth';

export const useResetPassword = (): [
  UseResetPasswordData,
  UseResetPasswordActions,
] => {
  const [resetPasswordData, setResetPasswordData] =
    useState<UseResetPasswordData>({
      form: {
        fields: {
          confirmPassword: '',
          password: '',
        },
        validation: {},
      },
      status: UseResetPasswordStatus.idle,
    });

  const [triggerCreateAuthV2, createAuthV2Result] =
    cornieApi.useCreateAuthV2Mutation();

  const [triggerUpdateUserMeV1, updateUserV1Result] =
    cornieApi.useUpdateUsersV1MeMutation();

  const createAuthResult: Either<
    SerializableAppError | SerializedError,
    apiModels.AuthV2
  > | null = mapUseQueryHookResultV2(createAuthV2Result);

  const updateUserResult: Either<
    SerializableAppError | SerializedError,
    apiModels.UserV1
  > | null = mapUseQueryHookResultV2(updateUserV1Result);

  const dispatch = useAppDispatch();

  const location: UrlLikeLocation = useUrlLikeLocation();
  const codeParam: string | null = location.searchParams.get(CODE_QUERY_PARAM);

  const userMeUpdateQueryV1: apiModels.UserMeUpdateQueryV1 = {};

  const updateForm = (fields: ResetPasswordFormFields): void => {
    const updatedResetPasswordData: UseResetPasswordData = {
      ...resetPasswordData,
    };

    updatedResetPasswordData.form = {
      fields,
      validation: { ...resetPasswordData.form.validation },
    };

    setResetPasswordData(updatedResetPasswordData);
  };

  const onConfirmPasswordChanged = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    updateForm({
      ...resetPasswordData.form.fields,
      confirmPassword: event.currentTarget.value,
    });
  };

  function onPasswordChanged(event: React.ChangeEvent<HTMLInputElement>): void {
    updateForm({
      ...resetPasswordData.form.fields,
      password: event.currentTarget.value,
    });
  }

  function buildValidation(): ResetPasswordFormValidationResult {
    const formValidation: ResetPasswordFormValidationResult = {};

    const passwordValidation: Either<string, undefined> = validatePassword(
      resetPasswordData.form.fields.password,
    );

    if (!passwordValidation.isRight) {
      formValidation.password = passwordValidation.value;
    } else {
      userMeUpdateQueryV1.password = resetPasswordData.form.fields.password;
    }

    const confirmPasswordValidation: Either<string[], undefined> =
      validateConfirmPassword(
        resetPasswordData.form.fields.password,
        resetPasswordData.form.fields.confirmPassword,
      );

    if (!confirmPasswordValidation.isRight) {
      formValidation.confirmPassword =
        confirmPasswordValidation.value.join(' ');
    }

    return formValidation;
  }

  function createAuth(): void {
    if (codeParam !== null) {
      setResetPasswordData({
        form: {
          fields: {
            ...resetPasswordData.form.fields,
          },
          validation: { ...resetPasswordData.form.validation },
        },
        status: UseResetPasswordStatus.creatingAuth,
      });

      void triggerCreateAuthV2({
        authCreateQuery: {
          code: codeParam,
          kind: 'code',
        },
      });
    } else {
      setResetPasswordData({
        form: {
          errorMessage: UNEXPECTED_AUTH_ERROR_MESSAGE,
          fields: {
            ...resetPasswordData.form.fields,
          },
          validation: { ...resetPasswordData.form.validation },
        },
        status: UseResetPasswordStatus.backendError,
      });
    }
  }

  function updateUserMe(): void {
    setResetPasswordData({
      form: {
        fields: {
          ...resetPasswordData.form.fields,
        },
        validation: { ...resetPasswordData.form.validation },
      },
      status: UseResetPasswordStatus.updatingUser,
    });

    void triggerUpdateUserMeV1({
      params: [userMeUpdateQueryV1],
    });
  }

  function onSubmit(event: React.FormEvent): void {
    event.preventDefault();

    if (resetPasswordData.status !== UseResetPasswordStatus.pending) {
      return;
    }

    const formValidation: ResetPasswordFormValidationResult = buildValidation();

    if (Object.keys(formValidation).length === 0) {
      setResetPasswordData({
        form: {
          fields: {
            ...resetPasswordData.form.fields,
          },
          validation: formValidation,
        },
        status: resetPasswordData.status,
      });

      updateUserMe();
    } else {
      setResetPasswordData({
        form: {
          fields: {
            ...resetPasswordData.form.fields,
          },
          validation: formValidation,
        },
        status: UseResetPasswordStatus.pending,
      });
    }
  }

  function buildErrorMessage(
    value: unknown,
    typeError: string | undefined,
  ): string {
    let errorMessage: string;

    if (isSerializableAppError(value)) {
      if (typeError === TYPE_ERROR_MUTATION) {
        errorMessage = getCreateAuthErrorMessage(value.kind);
      } else {
        errorMessage = getUpdateUserMeErrorMessage(value.kind);
      }
    } else {
      if (typeError === TYPE_ERROR_MUTATION) {
        errorMessage = getCreateAuthErrorMessage(undefined);
      } else {
        errorMessage = getUpdateUserMeErrorMessage(undefined);
      }
    }
    return errorMessage;
  }

  useEffect(() => {
    switch (resetPasswordData.status) {
      case UseResetPasswordStatus.idle:
        setResetPasswordData({
          form: {
            fields: {
              ...resetPasswordData.form.fields,
            },
            validation: { ...resetPasswordData.form.validation },
          },
          status: UseResetPasswordStatus.pending,
        });
        createAuth();
        break;
      default:
    }
  }, [resetPasswordData.status]);

  useEffect(() => {
    if (createAuthResult !== null) {
      if (createAuthResult.isRight) {
        setResetPasswordData({
          form: {
            fields: {
              ...resetPasswordData.form.fields,
            },
            validation: { ...resetPasswordData.form.validation },
          },
          status: UseResetPasswordStatus.pending,
        });

        dispatch(login(createAuthResult.value));
      } else {
        setResetPasswordData({
          form: {
            errorMessage: buildErrorMessage(
              createAuthResult.value,
              TYPE_ERROR_MUTATION,
            ),
            fields: {
              ...resetPasswordData.form.fields,
            },
            validation: { ...resetPasswordData.form.validation },
          },
          status: UseResetPasswordStatus.backendError,
        });
      }
    }
  }, [createAuthV2Result]);

  useEffect(() => {
    if (updateUserResult !== null) {
      if (updateUserResult.isRight) {
        setResetPasswordData({
          form: {
            fields: {
              ...resetPasswordData.form.fields,
            },
            validation: { ...resetPasswordData.form.validation },
          },
          status: UseResetPasswordStatus.success,
        });
      } else {
        setResetPasswordData({
          form: {
            errorMessage: buildErrorMessage(updateUserResult.value, undefined),
            fields: {
              ...resetPasswordData.form.fields,
            },
            validation: { ...resetPasswordData.form.validation },
          },
          status: UseResetPasswordStatus.backendError,
        });
      }
    }
  }, [updateUserV1Result]);

  return [
    resetPasswordData,
    {
      handlers: {
        onConfirmPasswordChanged,
        onPasswordChanged,
        onSubmit,
      },
    },
  ];
};
