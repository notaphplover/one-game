/**
 * @param {Object} formChecked
 * @param {String} email
 */
export const validateFormEmail = (formChecked, email) => {
  if (email.match(/^\S+@\S+$/gi) == null) {
    formChecked.email = 'The email must be a valid email.';
  }
};
