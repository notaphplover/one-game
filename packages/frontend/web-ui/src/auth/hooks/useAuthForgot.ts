import { SerializableAppError } from '@cornie-js/frontend-api-rtk-query';
import { SerializedError } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';

import { isSerializableAppError } from '../../common/helpers/isSerializableAppError';
import { mapUseQueryHookResultV2 } from '../../common/helpers/mapUseQueryHookResultV2';
import { cornieApi } from '../../common/http/services/cornieApi';
import { Either } from '../../common/models/Either';
import { getCreateUserCodeErrorMessage } from '../helpers/getCreateUserCodeErrorMessage';
import { validateEmail } from '../helpers/validateEmail';
import { UseAuthForgotActions } from '../models/UseAuthForgotActions';
import {
  AuthForgotFormFields,
  AuthForgotFormValidationResult,
  UseAuthForgotData,
} from '../models/UseAuthForgotData';
import { UseAuthForgotStatus } from '../models/UseAuthForgotStatus';

export const useAuthForgot = (): [UseAuthForgotData, UseAuthForgotActions] => {
  const [authForgotData, setAuthForgotData] = useState<UseAuthForgotData>({
    form: {
      fields: {
        email: '',
      },
      validation: {},
    },
    status: UseAuthForgotStatus.idle,
  });

  const [triggerCreateUserCode, createUserCodeResult] =
    cornieApi.useCreateUsersV1EmailCodeMutation();

  const userCodeCreatedResult: Either<
    SerializableAppError | SerializedError,
    undefined
  > | null = mapUseQueryHookResultV2(createUserCodeResult);

  const updateForm = (fields: AuthForgotFormFields): void => {
    const updatedAuthForgotData: UseAuthForgotData = { ...authForgotData };

    updatedAuthForgotData.form = {
      fields,
      validation: { ...authForgotData.form.validation },
    };

    setAuthForgotData(updatedAuthForgotData);
  };

  const onEmailChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateForm({
      ...authForgotData.form.fields,
      email: event.currentTarget.value,
    });
  };

  function buildValidation(): AuthForgotFormValidationResult {
    const formValidation: AuthForgotFormValidationResult = {};

    const emailValidation: Either<string, undefined> = validateEmail(
      authForgotData.form.fields.email,
    );

    if (!emailValidation.isRight) {
      formValidation.email = emailValidation.value;
    }

    return formValidation;
  }

  function createUserCode(): void {
    setAuthForgotData({
      form: {
        fields: {
          ...authForgotData.form.fields,
        },
        validation: { ...authForgotData.form.validation },
      },
      status: UseAuthForgotStatus.creatingUserCode,
    });

    void triggerCreateUserCode({
      params: [
        {
          email: authForgotData.form.fields.email,
        },
        {
          kind: 'resetPassword',
        },
      ],
    });
  }

  function onSubmit(event: React.FormEvent): void {
    event.preventDefault();

    if (authForgotData.status !== UseAuthForgotStatus.idle) {
      return;
    }

    const formValidation: AuthForgotFormValidationResult = buildValidation();

    if (Object.keys(formValidation).length === 0) {
      setAuthForgotData({
        form: {
          fields: {
            ...authForgotData.form.fields,
          },
          validation: formValidation,
        },
        status: authForgotData.status,
      });

      createUserCode();
    } else {
      setAuthForgotData({
        form: {
          fields: {
            ...authForgotData.form.fields,
          },
          validation: formValidation,
        },
        status: UseAuthForgotStatus.idle,
      });
    }
  }

  function buildErrorMessage(value: unknown): string {
    let errorMessage: string;

    if (isSerializableAppError(value)) {
      errorMessage = getCreateUserCodeErrorMessage(value.kind);
    } else {
      errorMessage = getCreateUserCodeErrorMessage(undefined);
    }
    return errorMessage;
  }

  useEffect(() => {
    if (userCodeCreatedResult !== null) {
      if (userCodeCreatedResult.isRight) {
        setAuthForgotData({
          form: {
            fields: {
              ...authForgotData.form.fields,
            },
            validation: { ...authForgotData.form.validation },
          },
          status: UseAuthForgotStatus.success,
        });
      } else {
        setAuthForgotData({
          form: {
            errorMessage: buildErrorMessage(userCodeCreatedResult.value),
            fields: {
              ...authForgotData.form.fields,
            },
            validation: { ...authForgotData.form.validation },
          },
          status: UseAuthForgotStatus.backendError,
        });
      }
    }
  }, [createUserCodeResult]);

  return [
    authForgotData,
    {
      handlers: {
        onEmailChanged,
        onSubmit,
      },
    },
  ];
};
