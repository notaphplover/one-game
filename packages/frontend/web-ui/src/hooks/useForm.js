/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from 'react';

export const useForm = ( initialForm = {} ) => {

    const [ formState, setFormState ] = useState( initialForm );
    const [ formValidation, setFormValidation ] = useState({});
    
    const isFormValid = useMemo( () => {

        for (const formValue of Object.keys(formValidation)) {
            if(formValidation[formValue] !== null) return false;
        }
        return true;

    });

    useEffect(() => {

      createValidators();    

    }, [formState]);
    
    const onInputChange = ({ target }) => {
        const { name, value } = target;
        setFormState({
            ...formState,
            [ name ]: value
        });
    }

    const onResetForm = () => {
        setFormState( initialForm );
    }

    const validateName = (formChecked, name) => {
        return ( name == '' ) 
                    ? formChecked['nameValid'] = 'The name is mandatory.' 
                    : '' ;
    }

    const validateEmail = (formChecked, email) => {
        return ( formState.email.match(/^\S+@\S+$/gi) == null ) 
                    ? formChecked['emailValid'] = 'The email must be a valid email.' 
                    : '' ;
    }

    const validatePassword = (formChecked, password) => {

        if ( password.length <= 5 ) {
            formChecked['passwordValid'] = `The password's length must be larger than five characters.`;
        }

        return formChecked;
    }

    const validateConfirmPassword = (formChecked, password, confirmPassword) => {

        if ( confirmPassword.length <= 5 ) {
            formChecked['confirmPasswordValid'] = `The confirm password's length must be larger than five characters.`;
        }
        else if ( password !== confirmPassword ) {
            formChecked['confirmPasswordValid'] = `The confirm password must be equal than the password.`;
        }        

        return formChecked;
    }

    const createValidators = () => {

        const formCheckedValues = {};

        switch (formState.component) {
            case 'Register':
                validateName(formCheckedValues, formState.name);
                validateEmail(formCheckedValues, formState.email);
                validatePassword(formCheckedValues, formState.password);
                validateConfirmPassword(formCheckedValues, formState.password, formState.confirmPassword);
                break;
            case 'Login':
                validateEmail(formCheckedValues, formState.email);
                validatePassword(formCheckedValues, formState.password);
                break;
            default:
                break;
        } 
            
        setFormValidation(formCheckedValues);

    }

    return {
        formState,
        onInputChange,
        onResetForm,
        formValidation,
        isFormValid
    }
}