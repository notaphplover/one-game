export const validateFormName = (formChecked, name) => {
  const varValidationError = 'ValidationError';

  return name == ''
    ? (formChecked[`name${varValidationError}`] = 'The name is mandatory.')
    : '';
};
