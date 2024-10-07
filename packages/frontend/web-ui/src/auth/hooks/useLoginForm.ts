import { models as apiModels } from '@cornie-js/api-models';
import { SerializableAppError } from '@cornie-js/frontend-api-rtk-query';
import { SerializedError } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import login from '../../app/store/actions/login';
import { useAppDispatch } from '../../app/store/hooks';
import { isSerializableAppError } from '../../common/helpers/isSerializableAppError';
import { mapUseQueryHookResultV2 } from '../../common/helpers/mapUseQueryHookResultV2';
import { useRedirectAuthorized } from '../../common/hooks/useRedirectAuthorized';
import { cornieApi } from '../../common/http/services/cornieApi';
import { Either } from '../../common/models/Either';
import { getCreateAuthErrorMessage } from '../helpers/getCreateAuthErrorMessage';
import { validateEmail } from '../helpers/validateEmail';
import { validatePassword } from '../helpers/validatePassword';
import { FormValidationResult } from '../models/FormValidationResult';
import {
  UseLoginFormParams,
  UseLoginFormResult,
} from '../models/UseLoginFormResult';
import { LoginStatus } from './../models/LoginStatus';

const useRedirectAuthorizedIfNoQuery: () => string | null = ():
  | string
  | null => {
  const location = useLocation();

  const getRedirectTo = (): string | null => {
    return new URL(
      `${location.pathname}${location.search}`,
      window.location.href,
    ).searchParams.get('redirectTo');
  };

  const redirectTo: string | null = getRedirectTo();

  const shouldSkipRedirection: boolean = redirectTo !== null;

  useRedirectAuthorized(shouldSkipRedirection);

  return redirectTo;
};

export const useLoginForm = (
  params: UseLoginFormParams,
): UseLoginFormResult => {
  const [formFields, setFormFields] = useState<UseLoginFormParams>(params);
  const [formStatus, setFormStatus] = useState<LoginStatus>(
    LoginStatus.initial,
  );
  const [backendError, setBackendError] = useState<string | null>(null);
  const [formValidation, setFormValidation] = useState<FormValidationResult>(
    {},
  );

  const redirectTo: string | null = useRedirectAuthorizedIfNoQuery();

  const dispatch = useAppDispatch();

  const [triggerCreateAuthV2, createAuthV2Result] =
    cornieApi.useCreateAuthV2Mutation();

  const createAuthResult: Either<
    SerializableAppError | SerializedError,
    apiModels.AuthV2
  > | null = mapUseQueryHookResultV2(createAuthV2Result);

  const authUser = async () => {
    if (formStatus !== LoginStatus.pendingBackend) {
      throw new Error('Unexpected state when creating auth');
    }

    void triggerCreateAuthV2({
      authCreateQuery: {
        email: formFields.email,
        kind: 'login',
        password: formFields.password,
      },
    });

    setFormStatus(LoginStatus.creatingAuth);
  };

  useEffect(() => {
    switch (formStatus) {
      case LoginStatus.pendingValidation:
        validateFormFields();
        break;
      case LoginStatus.pendingBackend:
        void authUser();
        break;
      default:
    }
  }, [formFields, formStatus]);

  const setFormField = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (
      formStatus !== LoginStatus.initial &&
      formStatus !== LoginStatus.validationKO &&
      formStatus !== LoginStatus.backendKO
    ) {
      throw new Error('Unexpected form state at setFormField');
    }

    const { name, value } = event.currentTarget;
    setFormFields({
      ...formFields,
      [name]: value,
    });
  };

  const notifyFormFieldsFilled = () => {
    setFormStatus(LoginStatus.pendingValidation);
    setBackendError(null);
  };

  const validateFormFields = () => {
    if (formStatus !== LoginStatus.pendingValidation) {
      throw new Error('Unexpected form state at validateFormFields');
    }

    const formValidationValue: FormValidationResult = {};

    const emailValidation: Either<string, undefined> = validateEmail(
      formFields.email,
    );

    if (!emailValidation.isRight) {
      formValidationValue.email = emailValidation.value;
    }

    const passwordValidation: Either<string, undefined> = validatePassword(
      formFields.password,
    );

    if (!passwordValidation.isRight) {
      formValidationValue.password = passwordValidation.value;
    }

    setFormValidation(formValidationValue);

    if (Object.values(formValidationValue).length === 0) {
      setFormStatus(LoginStatus.pendingBackend);
    } else {
      setFormStatus(LoginStatus.validationKO);
    }
  };

  useEffect(() => {
    if (createAuthResult !== null) {
      if (createAuthResult.isRight) {
        setFormStatus(LoginStatus.backendOK);
        dispatch(login(createAuthResult.value));
        if (redirectTo !== null) {
          window.location.href = redirectTo;
        }
      } else {
        setFormStatus(LoginStatus.backendKO);
        if (isSerializableAppError(createAuthResult.value)) {
          setBackendError(
            getCreateAuthErrorMessage(createAuthResult.value.kind),
          );
        } else {
          setBackendError(getCreateAuthErrorMessage(undefined));
        }
      }
    }
  }, [createAuthV2Result]);

  return {
    backendError,
    formFields,
    formStatus,
    formValidation,
    notifyFormFieldsFilled,
    setFormField,
  };
};
