import { LoginStatus } from './../models/LoginStatus';
import { useEffect, useState } from 'react';
import { validateEmail } from '../../common/helpers/validateEmail';
import { validatePassword } from '../../common/helpers/validatePassword';
import { createAuthByCredentials } from '../../app/store/thunk/createAuthByCredentials';
import {
  UseLoginFormParams,
  UseLoginFormResult,
} from '../models/UseLoginFormResult';
import { useAppDispatch } from '../../app/store/hooks';
import { isFullfilledPayloadAction } from '../helpers/isFullfilledPayloadAction';
import { Either } from '../../common/models/Either';
import { FormValidationResult } from '../models/FormValidationResult';

export const INVALID_CREDENTIALS_ERROR_MESSAGE: string = 'Invalid credentials.';
const UNEXPECTED_ERROR_MESSAGE: string =
  'Unexpected error occurred while processing the request.';

export const useLoginForm = (
  params: UseLoginFormParams,
): UseLoginFormResult => {
  const [formFields, setFormFields] = useState<UseLoginFormParams>(params);
  const [formStatus, setFormStatus] = useState<number>(LoginStatus.initial);
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
        authUser();
        break;
      default:
    }
  }, [formFields, formStatus]);

  const setFormField = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (
      formStatus !== LoginStatus.initial &&
      formStatus !== LoginStatus.validationKO
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
        case 200:
          setFormStatus(LoginStatus.backendOK);
          break;
        case 401:
          setBackendError(INVALID_CREDENTIALS_ERROR_MESSAGE);
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
