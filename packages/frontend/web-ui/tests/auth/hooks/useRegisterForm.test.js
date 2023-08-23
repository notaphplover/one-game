import { renderHook } from '@testing-library/react';
import { useRegisterForm } from '../../../src/auth/hooks/useRegisterForm';

describe('Testing in hook useRegisterForm', () => {
  test('should initial values', () => {
    const initialForm = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    const { result } = renderHook(() => useRegisterForm(initialForm));

    const { formState, isFormValid } = result.current;

    expect(formState.name).toBe('');
    expect(isFormValid).toBe(false);
  });

  test('should invalid email and invalid confirm password', () => {
    const initialForm = {
      name: 'Mariote',
      email: 'marioAgmail.com',
      password: '123123',
      confirmPassword: '123456',
    };
    const { result } = renderHook(() => useRegisterForm(initialForm));
    const { formValidation } = result.current;

    expect(formValidation.emailValidationError).toEqual(
      'The email must be a valid email.',
    );
    expect(formValidation.confirmPasswordValidationError).toEqual(
      'The confirm password must be equal than the password.',
    );
  });

  test('should form valid', () => {
    const initialForm = {
      name: 'Mariote',
      email: 'mario@gmail.com',
      password: '123123',
      confirmPassword: '123123',
    };
    const { result } = renderHook(() => useRegisterForm(initialForm));
    const { isFormValid } = result.current;

    expect(isFormValid).toBe(true);
  });
});
