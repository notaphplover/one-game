/**
 * @param {Object} formChecked
 * @param {String} email
 */
export const validateFormEmail = (formChecked, email) => {
  const varValidationError = 'ValidationError';

  if (email.match(/^\S+@\S+$/gi) == null) {
    formChecked[`email${varValidationError}`] =
      'The email must be a valid email.';
  }
};
