import { describe, expect, jest, it } from '@jest/globals';

jest.mock('../../common/helpers/validateFormName');
jest.mock('../../common/helpers/validateEmail');
jest.mock('../../common/helpers/validatePassword');
jest.mock('../../common/helpers/validateConfirmPassword');
jest.mock('../../common/http/services/HttpService');
jest.mock('../../common/http/helpers/buildSerializableResponse');

import { act, renderHook, waitFor } from '@testing-library/react';
import {
  INVALID_CREDENTIALS_REG_ERROR,
  STATUS_REG_BACKEND_KO,
  STATUS_REG_BACKEND_OK,
  STATUS_REG_INITIAL,
  useRegisterForm,
} from './useRegisterForm';
import { validateFormName } from '../../common/helpers/validateFormName';
import { validateEmail } from '../../common/helpers/validateEmail';
import { validatePassword } from '../../common/helpers/validatePassword';
import { validateConfirmPassword } from '../../common/helpers/validateConfirmPassword';
import { httpClient } from '../../common/http/services/HttpService';
import { buildSerializableResponse } from '../../common/http/helpers/buildSerializableResponse';

describe(useRegisterForm.name, () => {
  let initialForm;
  let nameErrorFixture;
  let emailErrorFixture;
  let passwordErrorFixture;
  let confirmPasswordErrorFixture;

  beforeAll(() => {
    initialForm = {
      name: 'name',
      email: 'email',
      password: 'password',
      confirmPassword: 'confirm-password',
    };

    nameErrorFixture = 'error-name';
    emailErrorFixture = 'error-email';
    passwordErrorFixture = 'error-password';
    confirmPasswordErrorFixture = 'error-confirmPassword';
  });

  describe('when called, on initialize values', () => {
    let result;
    let formFields;
    let formStatus;

    beforeAll(() => {
      result = renderHook(() => useRegisterForm(initialForm)).result;

      formFields = result.current.formFields;
      formStatus = result.current.formStatus;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should initialize values on name', () => {
      expect(formFields.name).toBe(initialForm.name);
    });

    it('should initialize values on email', () => {
      expect(formFields.email).toBe(initialForm.email);
    });

    it('should initialize values on password', () => {
      expect(formFields.password).toBe(initialForm.password);
    });

    it('should initialize values on confirmPassword', () => {
      expect(formFields.confirmPassword).toBe(initialForm.confirmPassword);
    });

    it('should initialize values on formStatus', () => {
      expect(formStatus).toBe(STATUS_REG_INITIAL);
    });
  });

  describe('when called, and name input value is not correct', () => {
    let result;
    let notifyFormFieldsFilled;
    let formValidation;

    beforeAll(() => {
      validateFormName.mockImplementation((formValidationValue) => {
        formValidationValue.name = nameErrorFixture;
      });

      validateEmail.mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

      validatePassword.mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

      validateConfirmPassword.mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

      result = renderHook(() => useRegisterForm(initialForm)).result;
      notifyFormFieldsFilled = result.current.notifyFormFieldsFilled;

      act(() => {
        notifyFormFieldsFilled();
      });

      formValidation = result.current.formValidation;
    });

    afterAll(() => {
      jest.clearAllMocks();
      validateFormName.mockReset();
    });

    it('should have been called validateFormName once', () => {
      expect(validateFormName).toHaveBeenCalledTimes(1);
    });

    it('should have been called validateFormName with arguments', () => {
      expect(validateFormName).toHaveBeenCalledWith(
        formValidation,
        initialForm.name,
      );
    });

    it('should return an invalid name error message', () => {
      expect(formValidation).toStrictEqual({ name: nameErrorFixture });
    });
  });

  describe('when called, and email input value is not correct', () => {
    let result;
    let notifyFormFieldsFilled;
    let formValidation;

    beforeAll(() => {
      validateEmail.mockReturnValueOnce({
        isRight: false,
        value: emailErrorFixture,
      });

      validatePassword.mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

      validateConfirmPassword.mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

      result = renderHook(() => useRegisterForm(initialForm)).result;
      notifyFormFieldsFilled = result.current.notifyFormFieldsFilled;

      act(() => {
        notifyFormFieldsFilled();
      });

      formValidation = result.current.formValidation;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should have been called validateEmail once', () => {
      expect(validateEmail).toHaveBeenCalledTimes(1);
    });

    it('should have been called validateEmail with arguments', () => {
      expect(validateEmail).toHaveBeenCalledWith(initialForm.email);
    });

    it('should return an invalid email error message', () => {
      expect(formValidation).toStrictEqual({ email: emailErrorFixture });
    });
  });

  describe('when called, and password input value is not correct', () => {
    let result;
    let notifyFormFieldsFilled;
    let formValidation;

    beforeAll(() => {
      validateEmail.mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

      validatePassword.mockReturnValueOnce({
        isRight: false,
        value: passwordErrorFixture,
      });

      validateConfirmPassword.mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

      result = renderHook(() => useRegisterForm(initialForm)).result;
      notifyFormFieldsFilled = result.current.notifyFormFieldsFilled;

      act(() => {
        notifyFormFieldsFilled();
      });

      formValidation = result.current.formValidation;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should have been called validatePassword once', () => {
      expect(validatePassword).toHaveBeenCalledTimes(1);
    });

    it('should have been called validatePassword with arguments', () => {
      expect(validatePassword).toHaveBeenCalledWith(initialForm.password);
    });

    it('should return an invalid password error message', () => {
      expect(formValidation).toStrictEqual({ password: passwordErrorFixture });
    });
  });

  describe('when called, and confirm password input value is not correct', () => {
    let result;
    let notifyFormFieldsFilled;
    let formValidation;

    beforeAll(() => {
      validateEmail.mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

      validatePassword.mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

      validateConfirmPassword.mockReturnValueOnce({
        isRight: false,
        value: [confirmPasswordErrorFixture],
      });

      result = renderHook(() => useRegisterForm(initialForm)).result;
      notifyFormFieldsFilled = result.current.notifyFormFieldsFilled;

      act(() => {
        notifyFormFieldsFilled();
      });

      formValidation = result.current.formValidation;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should have been called validateFormPassword once', () => {
      expect(validateConfirmPassword).toHaveBeenCalledTimes(1);
    });

    it('should have been called validateFormPassword with arguments', () => {
      expect(validateConfirmPassword).toHaveBeenCalledWith(
        initialForm.password,
        initialForm.confirmPassword,
      );
    });

    it('should return an invalid confirm password error message', () => {
      expect(formValidation).toStrictEqual({
        confirmPassword: confirmPasswordErrorFixture,
      });
    });
  });

  describe('when called, and API returns an OK response', () => {
    let result;
    let notifyFormFieldsFilled;
    let formStatus;

    beforeAll(async () => {
      initialForm = {
        name: 'Mariote',
        email: 'mario.te@google.com',
        password: '123456',
        confirmPassword: '123456',
      };

      validateEmail.mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

      validatePassword.mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

      validateConfirmPassword.mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

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

      result = renderHook(() => useRegisterForm(initialForm)).result;
      notifyFormFieldsFilled = result.current.notifyFormFieldsFilled;

      act(() => {
        notifyFormFieldsFilled();
      });

      await waitFor(() => {
        formStatus = result.current.formStatus;
        expect(formStatus).toBe(STATUS_REG_BACKEND_OK);
      });
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return an status backend OK', () => {
      expect(formStatus).toBe(STATUS_REG_BACKEND_OK);
    });
  });

  describe('when called, and API returns a non OK response', () => {
    let result;
    let notifyFormFieldsFilled;
    let formStatus;
    let backendError;

    beforeAll(async () => {
      initialForm = {
        name: 'Mariote',
        email: 'mario.te@google.com',
        password: '123456',
        confirmPassword: '123456',
      };

      validateEmail.mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

      validatePassword.mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

      validateConfirmPassword.mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

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

      result = renderHook(() => useRegisterForm(initialForm)).result;
      notifyFormFieldsFilled = result.current.notifyFormFieldsFilled;

      act(() => {
        notifyFormFieldsFilled();
      });

      await waitFor(() => {
        formStatus = result.current.formStatus;
        backendError = result.current.backendError;
        expect(formStatus).toBe(STATUS_REG_BACKEND_KO);
      });
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should return an status backend KO', () => {
      expect(formStatus).toBe(STATUS_REG_BACKEND_KO);
    });

    it('should return an error message Invalid Credentials', () => {
      expect(backendError).toBe(INVALID_CREDENTIALS_REG_ERROR);
    });
  });
});
