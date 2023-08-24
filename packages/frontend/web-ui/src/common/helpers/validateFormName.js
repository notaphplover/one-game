/**
 * @param {Object} formChecked
 * @param {String} name
 */
export const validateFormName = (formChecked, name) => {
  const varValidationError = 'ValidationError';

  if (name.trim() === '') {
    formChecked[`name${varValidationError}`] = 'The name is mandatory.';
  }
};
