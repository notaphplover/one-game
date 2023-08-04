
export const validateFormConfirmPassword = (formChecked, password, confirmPassword) => {

    const varValidationError = 'ValidationError';

    if ( confirmPassword.length <= 5 ) {
        formChecked[`confirmPassword${varValidationError}`] = `The confirm password's length must be larger than five characters.`;
    }
    else if ( password !== confirmPassword ) {
        formChecked[`confirmPassword${varValidationError}`] = `The confirm password must be equal than the password.`;
    }        

    return formChecked;
}