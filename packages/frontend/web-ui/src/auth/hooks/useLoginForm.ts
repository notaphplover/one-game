import { LoginStatus } from './../models/LoginStatus';
import { useEffect, useState } from 'react';
import { validateEmail } from '../../common/helpers/validateEmail';
import { validatePassword } from '../../common/helpers/validatePassword';
import { createAuthByCredentials } from '../../app/store/thunk/createAuthByCredentials';
import {
  FormValidationResult,
  UseLoginFormParams,
  UseLoginFormResult,
} from '../models/UseLoginFormResult';
import { useAppDispatch } from '../../app/store/hooks';
import { isFullfilledPayloadAction } from '../helpers/isFullfilledPayloadAction';
import { Either } from '../../common/models/Either';

export const INVALID_CREDENTIALS_ERROR: string = 'Invalid credentials.';
const UNEXPECTED_ERROR: string =
  'Ups... Something strange happened. Try again?';

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
      if (response.payload.statusCode === 200) {
        setFormStatus(LoginStatus.backendOK);
      } else if (response.payload.statusCode === 401) {
        setBackendError(INVALID_CREDENTIALS_ERROR);
        setFormStatus(LoginStatus.backendKO);
      } else {
        setBackendError(UNEXPECTED_ERROR);
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
