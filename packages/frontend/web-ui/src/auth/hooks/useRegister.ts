import { models as apiModels } from '@cornie-js/api-models';
import { useEffect, useState } from 'react';

import { mapUseQueryHookResult } from '../../common/helpers/mapUseQueryHookResult';
import { cornieApi } from '../../common/http/services/cornieApi';
import { Either } from '../../common/models/Either';
import { validateUsername } from '../../user/helpers/validateUsername';
import { validateConfirmPassword } from '../helpers/validateConfirmPassword';
import { validateEmail } from '../helpers/validateEmail';
import { validatePassword } from '../helpers/validatePassword';
import { UseRegisterActions } from '../models/UseRegisterActions';
import {
  RegisterFormFields,
  RegisterFormValidationResult,
  UseRegisterData,
} from '../models/UseRegisterData';
import { UseRegisterStatus } from '../models/UseRegisterStatus';

export const useRegister = (): [UseRegisterData, UseRegisterActions] => {
  const [registerData, setRegisterData] = useState<UseRegisterData>({
    form: {
      fields: {
        confirmPassword: '',
        email: '',
        name: '',
        password: '',
      },
      validation: {},
    },
    status: UseRegisterStatus.idle,
  });

  const [triggerCreateUser, createUserResult] =
    cornieApi.useCreateUsersV1Mutation();
  const [triggerCreateUserCode, createUserCodeResult] =
    cornieApi.useCreateUsersV1EmailCodeMutation();

  const userCreatedResult: Either<string, apiModels.UserV1> | null =
    mapUseQueryHookResult(createUserResult);

  const userCodeCreatedResult: Either<string, undefined> | null =
    mapUseQueryHookResult(createUserCodeResult);

  const updateForm = (fields: RegisterFormFields): void => {
    const updatedRegisterData: UseRegisterData = { ...registerData };

    updatedRegisterData.form = {
      fields,
      validation: { ...registerData.form.validation },
    };

    setRegisterData(updatedRegisterData);
  };

  const onConfirmPasswordChanged = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    updateForm({
      ...registerData.form.fields,
      confirmPassword: event.currentTarget.value,
    });
  };

  const onEmailChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateForm({
      ...registerData.form.fields,
      email: event.currentTarget.value,
    });
  };

  function onNameChanged(event: React.ChangeEvent<HTMLInputElement>): void {
    updateForm({
      ...registerData.form.fields,
      name: event.currentTarget.value,
    });
  }

  function onPasswordChanged(event: React.ChangeEvent<HTMLInputElement>): void {
    updateForm({
      ...registerData.form.fields,
      password: event.currentTarget.value,
    });
  }

  function buildValidation(): RegisterFormValidationResult {
    const formValidation: RegisterFormValidationResult = {};

    const confirmPasswordValidation: Either<string[], undefined> =
      validateConfirmPassword(
        registerData.form.fields.password,
        registerData.form.fields.confirmPassword,
      );

    if (!confirmPasswordValidation.isRight) {
      formValidation.confirmPassword =
        confirmPasswordValidation.value.join(' ');
    }

    const emailValidation: Either<string, undefined> = validateEmail(
      registerData.form.fields.email,
    );

    if (!emailValidation.isRight) {
      formValidation.email = emailValidation.value;
    }

    const nameValidation: Either<string, undefined> = validateUsername(
      registerData.form.fields.name,
    );

    if (!nameValidation.isRight) {
      formValidation.name = nameValidation.value;
    }

    const passwordValidation: Either<string, undefined> = validatePassword(
      registerData.form.fields.password,
    );

    if (!passwordValidation.isRight) {
      formValidation.password = passwordValidation.value;
    }

    return formValidation;
  }

  function createUser(): void {
    setRegisterData({
      form: {
        fields: {
          ...registerData.form.fields,
        },
        validation: { ...registerData.form.validation },
      },
      status: UseRegisterStatus.creatingUser,
    });

    void triggerCreateUser({
      params: [
        {
          email: registerData.form.fields.email,
          name: registerData.form.fields.name,
          password: registerData.form.fields.password,
        },
      ],
    });
  }

  function createUserCode(): void {
    setRegisterData({
      form: {
        fields: {
          ...registerData.form.fields,
        },
        validation: { ...registerData.form.validation },
      },
      status: UseRegisterStatus.creatingUserCode,
    });

    void triggerCreateUserCode({
      params: [
        {
          email: registerData.form.fields.email,
        },
        {
          kind: 'registerConfirm',
        },
      ],
    });
  }

  function onSubmit(event: React.FormEvent): void {
    event.preventDefault();

    if (registerData.status !== UseRegisterStatus.idle) {
      return;
    }

    const formValidation: RegisterFormValidationResult = buildValidation();

    if (Object.keys(formValidation).length === 0) {
      setRegisterData({
        form: {
          fields: {
            ...registerData.form.fields,
          },
          validation: formValidation,
        },
        status: registerData.status,
      });

      createUser();
    } else {
      setRegisterData({
        form: {
          fields: {
            ...registerData.form.fields,
          },
          validation: formValidation,
        },
        status: UseRegisterStatus.idle,
      });
    }
  }

  useEffect(() => {
    if (userCreatedResult !== null) {
      if (userCreatedResult.isRight) {
        createUserCode();
      } else {
        setRegisterData({
          form: {
            fields: {
              ...registerData.form.fields,
            },
            validation: { ...registerData.form.validation },
          },
          status: UseRegisterStatus.backendError,
        });
      }
    }
  }, [createUserResult]);

  useEffect(() => {
    if (userCodeCreatedResult !== null) {
      if (userCodeCreatedResult.isRight) {
        setRegisterData({
          form: {
            fields: {
              ...registerData.form.fields,
            },
            validation: { ...registerData.form.validation },
          },
          status: UseRegisterStatus.success,
        });
      } else {
        setRegisterData({
          form: {
            fields: {
              ...registerData.form.fields,
            },
            validation: { ...registerData.form.validation },
          },
          status: UseRegisterStatus.backendError,
        });
      }
    }
  }, [createUserCodeResult]);

  return [
    registerData,
    {
      handlers: {
        onConfirmPasswordChanged,
        onEmailChanged,
        onNameChanged,
        onPasswordChanged,
        onSubmit,
      },
    },
  ];
};
