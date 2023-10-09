import { useEffect, useState } from 'react';
import { validateFormEmail, validateFormPassword } from '../../common/helpers';
import { httpClient } from '../../common/http/services/HttpService';
import { buildSerializableResponse } from '../../common/http/helpers/buildSerializableResponse';

export const STATUS_LOG_INITIAL = 0;
export const STATUS_LOG_PENDING_VAL = 1;
export const STATUS_LOG_VALIDATION_KO = 2;
export const STATUS_LOG_PENDING_BACKEND = 3;
export const STATUS_LOG_BACKEND_KO = 4;
export const STATUS_LOG_BACKEND_OK = 5;

export const useLoginForm = (initialForm = {}) => {
  const [formFields, setFormFields] = useState(initialFormFields);
  const [formStatus, setFormStatus] = useState(STATUS_LOG_INITIAL);
  const [backendError, setBackendError] = useState(null);
  const [formValidation, setFormValidation] = useState({});

  const isFormValid = useMemo(() => {
    for (const formValue of Object.keys(formValidation)) {
      if (formValidation[formValue] !== null) return false;
    }
    return true;
  });

  useEffect(() => {
    switch (formStatus) {
      case STATUS_LOG_PENDING_VAL:
        validateFormFields();
        break;
      case STATUS_LOG_PENDING_BACKEND:
        //createUser(formFields);  <--- GET A TOKEN
        break;
      default:
    }
  }, [formFields]);

  const setFormField = ({ target }) => {
    if (
      formStatus !== STATUS_LOG_INITIAL &&
      formStatus !== STATUS_LOG_VALIDATION_KO
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
    setFormStatus(STATUS_LOG_PENDING_VAL);
    setBackendError(null);
  };

  const validateFormFields = () => {
    if (formStatus !== STATUS_LOG_PENDING_VAL) {
      throw new Error('Unexpected form state at validateFormFields');
    }

    const formValidationValue = {};

    validateFormEmail(formValidationValue, formFields.email);
    validateFormPassword(formValidationValue, formFields.password);

    setFormValidation(formValidationValue);

    if (Object.values(formValidationValue).length === 0) {
      setFormStatus(STATUS_LOG_PENDING_BACKEND);
    } else {
      setFormStatus(STATUS_LOG_VALIDATION_KO);
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
