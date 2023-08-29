/**
 * @param {Object} formChecked
 * @param {String} name
 */
export const validateFormName = (formChecked, name) => {
  if (name.trim() === '') {
    formChecked.name = 'The name is mandatory.';
  }
};
