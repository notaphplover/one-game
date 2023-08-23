/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from 'react';
import {
  validateFormName,
  validateFormEmail,
  validateFormPassword,
  validateFormConfirmPassword,
} from '../../common/helpers';

export const useRegisterForm = (initialForm = {}) => {
  const [formState, setFormState] = useState(initialForm);
  const [formValidation, setFormValidation] = useState({});

  const isFormValid = useMemo(() => {
    return Object.values(formValidation).length === 0;
  });

  useEffect(() => {
    createValidators();
  }, [formState]);

  const onInputChange = ({ target }) => {
    const { name, value } = target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const createValidators = () => {
    const formValidationValue = {};

    validateFormName(formValidationValue, formState.name);
    validateFormEmail(formValidationValue, formState.email);
    validateFormPassword(formValidationValue, formState.password);
    validateFormConfirmPassword(
      formValidationValue,
      formState.password,
      formState.confirmPassword,
    );

    setFormValidation(formCheckedValues);
  };

  return {
    formState,
    onInputChange,
    formValidation,
    isFormValid,
  };
};
