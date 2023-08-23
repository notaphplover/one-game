/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from 'react';
import {
  validateFormName,
  validateFormEmail,
  validateFormPassword,
  validateFormConfirmPassword,
} from '../../common/helpers';
import { httpClient } from '../../common/http/services/HttpService';
import { buildSerializableResponse } from '../../common/http/helpers/buildSerializableResponse';

const STATUS_REG_INITIAL = 0;
const STATUS_REG_PENDING_VAL = 1;
const STATUS_REG_VALIDATION_KO = 2;
const STATUS_REG_PENDING_BACKEND = 3;
const STATUS_REG_BACKEND_KO = 4;
const STATUS_REG_BACKEND_OK = 5;

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

    validateFormName(formValidationValue, formFields.name);
    validateFormEmail(formValidationValue, formFields.email);
    validateFormPassword(formValidationValue, formFields.password);
    validateFormConfirmPassword(
      formValidationValue,
      formFields.password,
      formFields.confirmPassword,
    );

    setFormValidation(formValidationValue);

    if (Object.values(formValidationValue).length === 0) {
      setFormStatus(STATUS_REG_PENDING_BACKEND);
    } else {
      setFormStatus(STATUS_REG_VALIDATION_KO);
    }
  };

  const createUser = async (formFields) => {
    if (formStatus !== STATUS_REG_PENDING_BACKEND) {
      throw new Error('Unexpected form state at validateFormFields');
    }

    const response = await fetchCreateUser(formFields);

    if (response.statusCode === 200) {
      setFormStatus(STATUS_REG_BACKEND_OK);
    } else if (response.statusCode === 409) {
      setBackendError(`The user already exists.`);
      setFormStatus(STATUS_REG_BACKEND_KO);
    } else {
      setBackendError(`Ups... Something strange happened. Try again?`);
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
    STATUS_REG_BACKEND_KO,
    STATUS_REG_BACKEND_OK,
    STATUS_REG_INITIAL,
    STATUS_REG_PENDING_BACKEND,
    STATUS_REG_PENDING_VAL,
    STATUS_REG_VALIDATION_KO,
  };
};
