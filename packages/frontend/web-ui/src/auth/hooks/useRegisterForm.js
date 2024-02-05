import { useEffect, useState } from 'react';
import { validateName } from '../../common/helpers/validateName';
import { validateFormEmail } from '../../common/helpers/validateFormEmail';
import { validateFormPassword } from '../../common/helpers/validateFormPassword';
import { validateConfirmPassword } from '../../common/helpers/validateConfirmPassword';
import { httpClient } from '../../common/http/services/HttpService';
import { buildSerializableResponse } from '../../common/http/helpers/buildSerializableResponse';

export const STATUS_REG_INITIAL = 0;
export const STATUS_REG_PENDING_VAL = 1;
export const STATUS_REG_VALIDATION_KO = 2;
export const STATUS_REG_PENDING_BACKEND = 3;
export const STATUS_REG_BACKEND_KO = 4;
export const STATUS_REG_BACKEND_OK = 5;

export const INVALID_CREDENTIALS_REG_ERROR = 'Invalid credentials.';
export const UNEXPECTED_REG_ERROR =
  'Ups... Something strange happened. Try again?';

export const useRegisterForm = (initialFormFields = {}) => {
  const [formFields, setFormFields] = useState(initialFormFields);
  const [formStatus, setFormStatus] = useState(STATUS_REG_INITIAL);
  const [backendError, setBackendError] = useState(null);
  const [formValidation, setFormValidation] = useState({});

  const setFormField = ({ target }) => {
    if (
      formStatus !== STATUS_REG_INITIAL &&
      formStatus !== STATUS_REG_VALIDATION_KO
    ) {
      throw new Error('Unexpected form state at setFormField');
    }

    const { name, value } = target;
    setFormFields({
      ...formFields,
      [name]: value,
    });
  };

  const notifyFormFieldsFilled = () => {
    setFormStatus(STATUS_REG_PENDING_VAL);
    setBackendError(null);
  };

  useEffect(() => {
    switch (formStatus) {
      case STATUS_REG_PENDING_VAL:
        validateFormFields();
        break;
      case STATUS_REG_PENDING_BACKEND:
        createUser(formFields);
        break;
      default:
    }
  }, [formStatus]);

  const validateFormFields = () => {
    if (formStatus !== STATUS_REG_PENDING_VAL) {
      throw new Error('Unexpected form state at validateFormFields');
    }

    const formValidationValue = {};

    const nameValidation = validateName(formValidationValue, formFields.name);

    if (!nameValidation.isRight) {
      formValidationValue.name = nameValidation.value;
    }

    validateFormEmail(formValidationValue, formFields.email);
    validateFormPassword(formValidationValue, formFields.password);

    const confirmPasswordValidation = validateConfirmPassword(
      formFields.password,
      formFields.confirmPassword,
    );

    if (!confirmPasswordValidation.isRight) {
      formValidationValue.confirmPassword =
        confirmPasswordValidation.value.join(' ');
    }

    setFormValidation(formValidationValue);

    if (Object.values(formValidationValue).length === 0) {
      setFormStatus(STATUS_REG_PENDING_BACKEND);
    } else {
      setFormStatus(STATUS_REG_VALIDATION_KO);
    }
  };

  const createUser = async (formFields) => {
    if (formStatus !== STATUS_REG_PENDING_BACKEND) {
      throw new Error('Unexpected form state at createUser');
    }

    const response = await fetchCreateUser(formFields);

    if (response.statusCode === 200) {
      setFormStatus(STATUS_REG_BACKEND_OK);
    } else if (response.statusCode === 409) {
      setBackendError(INVALID_CREDENTIALS_REG_ERROR);
      setFormStatus(STATUS_REG_BACKEND_KO);
    } else {
      setBackendError(UNEXPECTED_REG_ERROR);
      setFormStatus(STATUS_REG_BACKEND_KO);
    }
  };

  const fetchCreateUser = async ({ email, name, password }) => {
    const response = await httpClient.createUser(
      {},
      {
        email: email,
        name: name,
        password: password,
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
