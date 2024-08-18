import { useEffect, useState } from 'react';

import { useAppDispatch } from '../../app/store/hooks';
import { createAuthByCredentials } from '../../app/store/thunk/createAuthByCredentials';
import { isFullfilledPayloadAction } from '../../common/helpers/isFullfilledPayloadAction';
import { OK, UNAUTHORIZED } from '../../common/http/helpers/httpCodes';
import { Either } from '../../common/models/Either';
import { validateEmail } from '../helpers/validateEmail';
import { validatePassword } from '../helpers/validatePassword';
import { FormValidationResult } from '../models/FormValidationResult';
import {
  UseLoginFormParams,
  UseLoginFormResult,
} from '../models/UseLoginFormResult';
import { LoginStatus } from './../models/LoginStatus';

export const UNAUTHORIZED_ERROR_MESSAGE: string = 'Unauthorized.';
const UNEXPECTED_ERROR_MESSAGE: string =
  'Unexpected error occurred while processing the request.';

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

  const dispatch = useAppDispatch();

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

  const authUser = async () => {
    if (formStatus !== LoginStatus.pendingBackend) {
      throw new Error('Unexpected form state at createUser');
    }

    const response = await dispatch(createAuthByCredentials(formFields));

    if (isFullfilledPayloadAction(response)) {
      switch (response.payload.statusCode) {
        case OK:
          setFormStatus(LoginStatus.backendOK);
          break;
        case UNAUTHORIZED:
          setBackendError(UNAUTHORIZED_ERROR_MESSAGE);
          setFormStatus(LoginStatus.backendKO);
          break;
        default:
          setBackendError(UNEXPECTED_ERROR_MESSAGE);
          setFormStatus(LoginStatus.backendKO);
      }
    }
  };

  return {
    backendError,
    formFields,
    formStatus,
    formValidation,
    notifyFormFieldsFilled,
    setFormField,
  };
};
