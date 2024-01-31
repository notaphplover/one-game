/**
 * @param {Object} formChecked
 * @param {String} email
 */
export const validateFormEmail = (
  formChecked: { email: string },
  email: string,
) => {
  if (email.match(/^\S+@\S+$/gi) == null) {
    formChecked.email = 'The email must be a valid email.';
  }
};
