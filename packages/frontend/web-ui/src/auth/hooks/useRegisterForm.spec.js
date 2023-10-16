import { describe, expect, jest, it } from '@jest/globals';

jest.mock('../../common/helpers');
jest.mock('../../common/http/services/HttpService');
jest.mock('../../common/http/helpers/buildSerializableResponse');

import { act, renderHook, waitFor } from '@testing-library/react';
import {
  STATUS_REG_BACKEND_KO,
  STATUS_REG_BACKEND_OK,
  STATUS_REG_INITIAL,
  useRegisterForm,
} from './useRegisterForm';
import {
  validateFormName,
  validateFormEmail,
  validateFormPassword,
  validateFormConfirmPassword,
} from '../../common/helpers';
import { httpClient } from '../../common/http/services/HttpService';
import { buildSerializableResponse } from '../../common/http/helpers/buildSerializableResponse';

describe(useRegisterForm.name, () => {
  it('should initialize values', () => {
    const initialForm = {
      name: 'name',
      email: 'email',
      password: 'password',
      confirmPassword: 'confirm-password',
    };

    const { result } = renderHook(() => useRegisterForm(initialForm));

    const { formFields, formStatus } = result.current;

    expect(formFields.name).toBe(initialForm.name);
    expect(formFields.email).toBe(initialForm.email);
    expect(formFields.password).toBe(initialForm.password);
    expect(formFields.confirmPassword).toBe(initialForm.confirmPassword);
    expect(formStatus).toBe(STATUS_REG_INITIAL);

    jest.clearAllMocks();
  });

  it('should have an invalid name error message', () => {
    const nameErrorFixture = 'name-error';
    const initialForm = {
      name: 'name',
      email: 'email',
      password: 'password',
      confirmPassword: 'confirm-password',
    };

    validateFormName.mockImplementation((formValidationValue) => {
      formValidationValue.name = nameErrorFixture;
    });

    const { result } = renderHook(() => useRegisterForm(initialForm));
    const { notifyFormFieldsFilled } = result.current;

    act(() => {
      notifyFormFieldsFilled();
    });

    const { formValidation } = result.current;

    expect(formValidation).toStrictEqual({ name: nameErrorFixture });
    expect(validateFormName).toHaveBeenCalledTimes(1);
    expect(validateFormName).toHaveBeenCalledWith(
      formValidation,
      initialForm.name,
    );

    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should have an invalid email error message', () => {
    const emailErrorFixture = 'email-error';
    const initialForm = {
      name: 'name',
      email: 'email',
      password: 'password',
      confirmPassword: 'confirm-password',
    };

    validateFormEmail.mockImplementation((formValidationValue) => {
      formValidationValue.email = emailErrorFixture;
    });

    const { result } = renderHook(() => useRegisterForm(initialForm));
    const { notifyFormFieldsFilled } = result.current;

    act(() => {
      notifyFormFieldsFilled();
    });

    const { formValidation } = result.current;

    expect(formValidation).toStrictEqual({ email: emailErrorFixture });
    expect(validateFormEmail).toHaveBeenCalledTimes(1);
    expect(validateFormEmail).toHaveBeenCalledWith(
      formValidation,
      initialForm.email,
    );

    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should have an invalid password error message', () => {
    const passwordErrorFixture = 'password-error';
    const initialForm = {
      name: 'name',
      email: 'email',
      password: 'password',
      confirmPassword: 'confirm-password',
    };

    validateFormPassword.mockImplementation((formValidationValue) => {
      formValidationValue.password = passwordErrorFixture;
    });

    const { result } = renderHook(() => useRegisterForm(initialForm));
    const { notifyFormFieldsFilled } = result.current;

    act(() => {
      notifyFormFieldsFilled();
    });

    const { formValidation } = result.current;

    expect(formValidation).toStrictEqual({ password: passwordErrorFixture });
    expect(validateFormPassword).toHaveBeenCalledTimes(1);
    expect(validateFormPassword).toHaveBeenCalledWith(
      formValidation,
      initialForm.password,
    );

    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should have an invalid confirm password error message', () => {
    const confirmPasswordErrorFixture = 'confirmPassword-error';
    const initialForm = {
      name: 'name',
      email: 'email',
      password: 'password',
      confirmPassword: 'confirm-password',
    };

    validateFormConfirmPassword.mockImplementation((formValidationValue) => {
      formValidationValue.confirmPassword = confirmPasswordErrorFixture;
    });

    const { result } = renderHook(() => useRegisterForm(initialForm));
    const { notifyFormFieldsFilled } = result.current;

    act(() => {
      notifyFormFieldsFilled();
    });

    const { formValidation } = result.current;

    expect(formValidation).toStrictEqual({
      confirmPassword: confirmPasswordErrorFixture,
    });
    expect(validateFormConfirmPassword).toHaveBeenCalledTimes(1);
    expect(validateFormConfirmPassword).toHaveBeenCalledWith(
      formValidation,
      initialForm.password,
      initialForm.confirmPassword,
    );

    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should call to API with the correct information', async () => {
    const initialForm = {
      name: 'Mariote',
      email: 'mario.te@google.com',
      password: '123456',
      confirmPassword: '123456',
    };

    httpClient.createUser.mockImplementation(async (_, body) => ({
      headers: {},
      body: {
        name: body.name,
        email: body.email,
        password: body.password,
      },
      statusCode: 200,
    }));

    buildSerializableResponse.mockImplementation((response) => ({
      body: response.body,
      statusCode: response.statusCode,
    }));

    const { result } = renderHook(() => useRegisterForm(initialForm));
    const { notifyFormFieldsFilled } = result.current;

    act(() => {
      notifyFormFieldsFilled();
    });

    await waitFor(() => {
      const { formStatus } = result.current;

      expect(formStatus).toBe(STATUS_REG_BACKEND_OK);
    });

    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should call to API with wrong information and return an error 409', async () => {
    const initialForm = {
      name: 'Mariote',
      email: 'mario.te@google.com',
      password: '123456',
      confirmPassword: '123456',
    };

    httpClient.createUser.mockImplementation(async (_, body) => ({
      headers: {},
      body: {
        name: body.name,
        email: body.email,
        password: body.password,
      },
      statusCode: 409,
    }));

    buildSerializableResponse.mockImplementation((response) => ({
      body: response.body,
      statusCode: response.statusCode,
    }));

    const { result } = renderHook(() => useRegisterForm(initialForm));
    const { notifyFormFieldsFilled } = result.current;

    act(() => {
      notifyFormFieldsFilled();
    });

    await waitFor(() => {
      const { formStatus } = result.current;

      expect(formStatus).toBe(STATUS_REG_BACKEND_KO);
    });

    jest.clearAllMocks();
    jest.resetAllMocks();
  });
});
