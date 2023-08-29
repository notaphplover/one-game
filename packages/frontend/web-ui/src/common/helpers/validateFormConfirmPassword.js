import { PASSWORD_MIN_LENGTH } from './passwordMinLength';

/**
 * @param {Object} formChecked
 * @param {String} password
 * @param {String} confirmPassword
 */
export const validateFormConfirmPassword = (
  formChecked,
  password,
  confirmPassword,
) => {
  let errorMessages = [];

  if (confirmPassword.length < PASSWORD_MIN_LENGTH) {
    errorMessages.push('Password must be of minimum 6 characters length');
  }

  if (password.trim() !== confirmPassword.trim()) {
    errorMessages.push('Confirm password must match the password.');
  }

  if (formChecked.confirmPassword !== '') {
    formChecked.confirmPassword = errorMessages.join('\n');
  }
};
