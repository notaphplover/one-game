
export const validateFormEmail = (formChecked, email) => {

    const varValidationError = 'ValidationError';

    return ( email.match(/^\S+@\S+$/gi) == null ) 
                ? formChecked[`email${varValidationError}`] = 'The email must be a valid email.' 
                : '' ;
};
