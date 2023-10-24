import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { validateFormEmail } from '../../common/helpers/validateFormEmail';
import { validateFormPassword } from '../../common/helpers/validateFormPassword';
import { createAuthByCredentials } from '../../app/store/thunk/createAuthByCredentials';

export const STATUS_LOG_INITIAL = 0;
export const STATUS_LOG_PENDING_VAL = 1;
export const STATUS_LOG_VALIDATION_KO = 2;
export const STATUS_LOG_PENDING_BACKEND = 3;
export const STATUS_LOG_BACKEND_KO = 4;
export const STATUS_LOG_BACKEND_OK = 5;

export const USER_NOT_EXISTS_ERROR = 'The user not exists.';
const UNEXPECTED_ERROR = 'Ups... Something strange happened. Try again?';

export const useLoginForm = (initialFormFields = {}) => {
  const [formFields, setFormFields] = useState(initialFormFields);
  const [formStatus, setFormStatus] = useState(STATUS_LOG_INITIAL);
  const [backendError, setBackendError] = useState(null);
  const [formValidation, setFormValidation] = useState({});

  const dispatch = useDispatch();

  useEffect(() => {
    switch (formStatus) {
      case STATUS_LOG_PENDING_VAL:
        validateFormFields();
        break;
      case STATUS_LOG_PENDING_BACKEND:
        authUser();
        break;
      default:
    }
  }, [formFields, formStatus]);

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

  const authUser = async () => {
    if (formStatus !== STATUS_LOG_PENDING_BACKEND) {
      throw new Error('Unexpected form state at createUser');
    }

    const response = await dispatch(createAuthByCredentials(formFields));

    if (response.payload.statusCode === 200) {
      setFormStatus(STATUS_LOG_BACKEND_OK);
    } else if (response.payload.statusCode === 422) {
      setBackendError(USER_NOT_EXISTS_ERROR);
      setFormStatus(STATUS_LOG_BACKEND_KO);
    } else {
      setBackendError(UNEXPECTED_ERROR);
      setFormStatus(STATUS_LOG_BACKEND_KO);
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
