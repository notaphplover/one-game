import { useEffect, useMemo, useState } from 'react';
import { validateFormEmail } from '../../common/helpers/validateFormEmail';
import { validateFormPassword } from '../../common/helpers/validateFormPassword';

export const useLoginForm = (initialForm = {}) => {
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

  const onResetForm = () => {
    setFormState(initialForm);
  };

  const createValidators = () => {
    const formCheckedValues = {};

    validateFormEmail(formCheckedValues, formState.email);
    validateFormPassword(formCheckedValues, formState.password);

    setFormValidation(formCheckedValues);
  };

  return {
    formState,
    onInputChange,
    onResetForm,
    formValidation,
    isFormValid,
  };
};
