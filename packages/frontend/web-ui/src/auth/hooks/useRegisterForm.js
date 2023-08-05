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
    for (const formValue of Object.keys(formValidation)) {
      if (formValidation[formValue] !== null) return false;
    }
    return true;
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
    const formCheckedValues = {};

    validateFormName(formCheckedValues, formState.name);
    validateFormEmail(formCheckedValues, formState.email);
    validateFormPassword(formCheckedValues, formState.password);
    validateFormConfirmPassword(
      formCheckedValues,
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
