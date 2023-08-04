export const validateFormPassword = (formChecked, password) => {
  const varValidationError = 'ValidationError';

  if (password.length <= 5) {
    formChecked[
      `password${varValidationError}`
    ] = `The password's length must be larger than five characters.`;
  }

  return formChecked;
};
