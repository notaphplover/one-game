/**
 * @param {Object} formChecked
 * @param {String} name
 */
export const validateFormName = (
  formChecked: { name: string },
  name: string,
) => {
  if (name.trim() === '') {
    formChecked.name = 'The name is mandatory.';
  }
};
