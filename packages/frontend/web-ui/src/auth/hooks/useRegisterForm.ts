import { useEffect, useState } from 'react';
import { validateName } from '../../common/helpers/validateName';
import { validateEmail } from '../../common/helpers/validateEmail';
import { validatePassword } from '../../common/helpers/validatePassword';
import { validateConfirmPassword } from '../../common/helpers/validateConfirmPassword';
import { httpClient } from '../../common/http/services/HttpService';
import { buildSerializableResponse } from '../../common/http/helpers/buildSerializableResponse';
import { Either } from '../../common/models/Either';
import { UseRegisterFormParams } from '../models/UseRegisterFormResult';
import { RegisterStatus } from '../models/RegisterStatus';
import { FormValidationResult } from '../models/FormValidationResult';
import { FormFieldsRegister } from '../models/FormFieldsRegister';
import { RegisterResponse } from '../../common/http/models/RegisterResponse';
import { RegisterSerializedResponse } from '../../common/http/models/RegisterSerializedResponse';

export const INVALID_CREDENTIALS_REG_ERROR_MESSAGE: string =
  'Invalid credentials.';
const HTTP_BAD_REQUEST_ERROR_MESSAGE: string =
  'Unexpected error occurred while processing the request.';
export const HTTP_CONFLICT_ERROR_MESSAGE: string = `Cannot register user. There's already a user with the same mail address.`;

export const useRegisterForm = (initialFormFields: UseRegisterFormParams) => {
  const [formFields, setFormFields] =
    useState<UseRegisterFormParams>(initialFormFields);
  const [formStatus, setFormStatus] = useState<number>(RegisterStatus.initial);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [formValidation, setFormValidation] = useState<FormValidationResult>(
    {},
  );

  const setFormField = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (
      formStatus !== RegisterStatus.initial &&
      formStatus !== RegisterStatus.validationKO
    ) {
      throw new Error('Unexpected form state at setFormField');
    }

    const { name, value } = event.currentTarget;
    setFormFields({
      ...formFields,
      [name]: value,
    });
  };

  const notifyFormFieldsFilled = (): void => {
    setFormStatus(RegisterStatus.pendingValidation);
    setBackendError(null);
  };

  useEffect(() => {
    switch (formStatus) {
      case RegisterStatus.pendingValidation:
        validateFormFields();
        break;
      case RegisterStatus.pendingBackend:
        createUser(formFields);
        break;
      default:
    }
  }, [formStatus]);

  const validateFormFields = (): void => {
    if (formStatus !== RegisterStatus.pendingValidation) {
      throw new Error('Unexpected form state at validateFormFields');
    }

    const formValidationValue: FormValidationResult = {};

    const nameValidation: Either<string, undefined> = validateName(
      formFields.name,
    );

    if (!nameValidation.isRight) {
      formValidationValue.name = nameValidation.value;
    }

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

    const confirmPasswordValidation: Either<string[], undefined> =
      validateConfirmPassword(formFields.password, formFields.confirmPassword);

    if (!confirmPasswordValidation.isRight) {
      formValidationValue.confirmPassword =
        confirmPasswordValidation.value.join(' ');
    }

    setFormValidation(formValidationValue);

    if (Object.values(formValidationValue).length === 0) {
      setFormStatus(RegisterStatus.pendingBackend);
    } else {
      setFormStatus(RegisterStatus.validationKO);
    }
  };

  const createUser = async (formFields: FormFieldsRegister): Promise<void> => {
    if (formStatus !== RegisterStatus.pendingBackend) {
      throw new Error('Unexpected form state at createUser');
    }

    const response: RegisterSerializedResponse =
      await fetchCreateUser(formFields);

    switch (response.statusCode) {
      case 200:
        setFormStatus(RegisterStatus.backendOK);
        break;
      case 400:
        setBackendError(HTTP_BAD_REQUEST_ERROR_MESSAGE);
        setFormStatus(RegisterStatus.backendKO);
        break;
      case 409:
        setBackendError(HTTP_CONFLICT_ERROR_MESSAGE);
        setFormStatus(RegisterStatus.backendKO);
        break;
      default:
        setBackendError(INVALID_CREDENTIALS_REG_ERROR_MESSAGE);
        setFormStatus(RegisterStatus.backendKO);
    }
  };

  const fetchCreateUser = async (
    formFields: FormFieldsRegister,
  ): Promise<RegisterSerializedResponse> => {
    const response: RegisterResponse = await httpClient.createUser(
      {},
      {
        email: formFields.email,
        name: formFields.name,
        password: formFields.password,
      },
    );

    return buildSerializableResponse(response);
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
