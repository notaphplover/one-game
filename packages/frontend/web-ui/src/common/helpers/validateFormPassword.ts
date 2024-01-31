import { PASSWORD_MIN_LENGTH } from './passwordMinLength';

/**
 * @param {Object} formChecked
 * @param {String} password
 */
export const validateFormPassword = (
  formChecked: { password: string },
  password: string,
) => {
  if (password.length < PASSWORD_MIN_LENGTH) {
    formChecked.password = 'Password must be of minimum 6 characters length';
  }
};
