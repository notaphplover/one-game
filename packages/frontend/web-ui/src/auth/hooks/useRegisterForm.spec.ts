import { afterAll, beforeAll, describe, expect, jest, it } from '@jest/globals';

jest.mock('../../common/helpers/validateName');
jest.mock('../../common/helpers/validateEmail');
jest.mock('../../common/helpers/validatePassword');
jest.mock('../../common/helpers/validateConfirmPassword');
jest.mock('../../common/http/services/HttpService');
jest.mock('../../common/http/helpers/buildSerializableResponse');

import {
  RenderHookResult,
  act,
  renderHook,
  waitFor,
} from '@testing-library/react';
import {
  HTTP_CONFLICT_ERROR_MESSAGE,
  useRegisterForm,
} from './useRegisterForm';
import { validateName } from '../../common/helpers/validateName';
import { validateEmail } from '../../common/helpers/validateEmail';
import { validatePassword } from '../../common/helpers/validatePassword';
import { validateConfirmPassword } from '../../common/helpers/validateConfirmPassword';
import { httpClient } from '../../common/http/services/HttpService';
import { buildSerializableResponse } from '../../common/http/helpers/buildSerializableResponse';
import { RegisterStatus } from '../models/RegisterStatus';
import {
  UseRegisterFormParams,
  UseRegisterFormResult,
} from '../models/UseRegisterFormResult';
import { FormFieldsRegister } from '../models/FormFieldsRegister';
import { FormValidationResult } from '../models/FormValidationResult';
import { RegisterResponse } from '../../common/http/models/RegisterResponse';
import { RegisterSerializedResponse } from '../../common/http/models/RegisterSerializedResponse';

describe(useRegisterForm.name, () => {
  let initialForm: UseRegisterFormParams;
  let nameErrorFixture: string;
  let emailErrorFixture: string;
  let passwordErrorFixture: string;
  let confirmPasswordErrorFixture: string;

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
    let renderResult: RenderHookResult<UseRegisterFormResult, unknown>;
    let formFieldsRegister: FormFieldsRegister;
    let formStatusRegister: RegisterStatus;

    beforeAll(() => {
      renderResult = renderHook(() => useRegisterForm(initialForm));

      formFieldsRegister = renderResult.result.current.formFields;
      formStatusRegister = renderResult.result.current.formStatus;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should initialize values on name', () => {
      expect(formFieldsRegister.name).toBe(initialForm.name);
    });

    it('should initialize values on email', () => {
      expect(formFieldsRegister.email).toBe(initialForm.email);
    });

    it('should initialize values on password', () => {
      expect(formFieldsRegister.password).toBe(initialForm.password);
    });

    it('should initialize values on confirmPassword', () => {
      expect(formFieldsRegister.confirmPassword).toBe(
        initialForm.confirmPassword,
      );
    });

    it('should initialize values on formStatus', () => {
      expect(formStatusRegister).toBe(RegisterStatus.initial);
    });
  });

  describe('when called, and name input value is not correct', () => {
    let renderResult: RenderHookResult<UseRegisterFormResult, unknown>;
    let formValidation: FormValidationResult;

    beforeAll(() => {
      (validateName as jest.Mock<typeof validateName>).mockReturnValueOnce({
        isRight: false,
        value: nameErrorFixture,
      });

      (validateEmail as jest.Mock<typeof validateEmail>).mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

      (
        validatePassword as jest.Mock<typeof validatePassword>
      ).mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

      (
        validateConfirmPassword as jest.Mock<typeof validateConfirmPassword>
      ).mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

      renderResult = renderHook(() => useRegisterForm(initialForm));
      const notifyFormFieldsFilled: () => void =
        renderResult.result.current.notifyFormFieldsFilled;

      act(() => {
        notifyFormFieldsFilled();
      });

      formValidation = renderResult.result.current.formValidation;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should have been called validateName once', () => {
      expect(validateName).toHaveBeenCalledTimes(1);
    });

    it('should have been called validateName with arguments', () => {
      expect(validateName).toHaveBeenCalledWith(initialForm.name);
    });

    it('should return an invalid name error message', () => {
      expect(formValidation).toStrictEqual({ name: nameErrorFixture });
    });
  });

  describe('when called, and email input value is not correct', () => {
    let renderResult: RenderHookResult<UseRegisterFormResult, unknown>;
    let formValidation: FormValidationResult;

    beforeAll(() => {
      (validateName as jest.Mock<typeof validateName>).mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

      (validateEmail as jest.Mock<typeof validateEmail>).mockReturnValueOnce({
        isRight: false,
        value: emailErrorFixture,
      });

      (
        validatePassword as jest.Mock<typeof validatePassword>
      ).mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

      (
        validateConfirmPassword as jest.Mock<typeof validateConfirmPassword>
      ).mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

      renderResult = renderHook(() => useRegisterForm(initialForm));
      const notifyFormFieldsFilled: () => void =
        renderResult.result.current.notifyFormFieldsFilled;

      act(() => {
        notifyFormFieldsFilled();
      });

      formValidation = renderResult.result.current.formValidation;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should have been called validateName once', () => {
      expect(validateEmail).toHaveBeenCalledTimes(1);
    });

    it('should have been called validateName with arguments', () => {
      expect(validateEmail).toHaveBeenCalledWith(initialForm.email);
    });

    it('should return an invalid name error message', () => {
      expect(formValidation).toStrictEqual({ email: emailErrorFixture });
    });
  });

  describe('when called, and password input value is not correct', () => {
    let renderResult: RenderHookResult<UseRegisterFormResult, unknown>;
    let formValidation: FormValidationResult;

    beforeAll(() => {
      (validateName as jest.Mock<typeof validateName>).mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

      (validateEmail as jest.Mock<typeof validateEmail>).mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

      (
        validatePassword as jest.Mock<typeof validatePassword>
      ).mockReturnValueOnce({
        isRight: false,
        value: passwordErrorFixture,
      });

      (
        validateConfirmPassword as jest.Mock<typeof validateConfirmPassword>
      ).mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

      renderResult = renderHook(() => useRegisterForm(initialForm));
      const notifyFormFieldsFilled: () => void =
        renderResult.result.current.notifyFormFieldsFilled;

      act(() => {
        notifyFormFieldsFilled();
      });

      formValidation = renderResult.result.current.formValidation;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should have been called validateName once', () => {
      expect(validatePassword).toHaveBeenCalledTimes(1);
    });

    it('should have been called validateName with arguments', () => {
      expect(validatePassword).toHaveBeenCalledWith(initialForm.password);
    });

    it('should return an invalid name error message', () => {
      expect(formValidation).toStrictEqual({ password: passwordErrorFixture });
    });
  });

  describe('when called, and confirm password input value is not correct', () => {
    let renderResult: RenderHookResult<UseRegisterFormResult, unknown>;
    let formValidation: FormValidationResult;

    beforeAll(() => {
      (validateName as jest.Mock<typeof validateName>).mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

      (validateEmail as jest.Mock<typeof validateEmail>).mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

      (
        validatePassword as jest.Mock<typeof validatePassword>
      ).mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

      (
        validateConfirmPassword as jest.Mock<typeof validateConfirmPassword>
      ).mockReturnValueOnce({
        isRight: false,
        value: [confirmPasswordErrorFixture],
      });

      renderResult = renderHook(() => useRegisterForm(initialForm));
      const notifyFormFieldsFilled: () => void =
        renderResult.result.current.notifyFormFieldsFilled;

      act(() => {
        notifyFormFieldsFilled();
      });

      formValidation = renderResult.result.current.formValidation;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should have been called validateName once', () => {
      expect(validateConfirmPassword).toHaveBeenCalledTimes(1);
    });

    it('should have been called validateName with arguments', () => {
      expect(validateConfirmPassword).toHaveBeenCalledWith(
        initialForm.password,
        initialForm.confirmPassword,
      );
    });

    it('should return an invalid name error message', () => {
      expect(formValidation).toStrictEqual({
        confirmPassword: confirmPasswordErrorFixture,
      });
    });
  });

  describe('when called, and API returns an OK response', () => {
    let renderResult: RenderHookResult<UseRegisterFormResult, unknown>;
    let formStatus: RegisterStatus;
    let registerResponseFixture: RegisterResponse;
    let serializableResponseFixture: RegisterSerializedResponse;

    beforeAll(async () => {
      registerResponseFixture = {
        headers: {},
        body: {
          active: false,
          id: 'id-fixture',
          name: 'name-fixture',
        },
        statusCode: 200,
      };

      serializableResponseFixture = {
        body: {
          active: false,
          id: 'id-fixture',
          name: 'name-fixture',
        },
        statusCode: 200,
      };

      initialForm = {
        name: 'Mariote',
        email: 'mario.te@google.com',
        password: '123456',
        confirmPassword: '123456',
      };

      (validateName as jest.Mock<typeof validateName>).mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

      (validateEmail as jest.Mock<typeof validateEmail>).mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

      (
        validatePassword as jest.Mock<typeof validatePassword>
      ).mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

      (
        validateConfirmPassword as jest.Mock<typeof validateConfirmPassword>
      ).mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

      (
        httpClient.createUser as jest.Mock<typeof httpClient.createUser>
      ).mockResolvedValueOnce(registerResponseFixture);

      (
        buildSerializableResponse as jest.Mock<typeof buildSerializableResponse>
      ).mockReturnValueOnce(serializableResponseFixture);

      renderResult = renderHook(() => useRegisterForm(initialForm));
      const notifyFormFieldsFilled: () => void =
        renderResult.result.current.notifyFormFieldsFilled;

      act(() => {
        notifyFormFieldsFilled();
      });

      await waitFor(() => {
        formStatus = renderResult.result.current.formStatus;
        expect(formStatus).toBe(RegisterStatus.backendOK);
      });
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should called httpClient.createUser()', () => {
      expect(httpClient.createUser).toHaveBeenCalled();
      expect(httpClient.createUser).toHaveBeenCalledWith(
        {},
        {
          name: 'Mariote',
          email: 'mario.te@google.com',
          password: '123456',
        },
      );
    });

    it('should return an status backend OK', () => {
      expect(formStatus).toBe(RegisterStatus.backendOK);
    });
  });

  describe('when called, and API returns a non OK response', () => {
    let renderResult: RenderHookResult<UseRegisterFormResult, unknown>;
    let formStatus: RegisterStatus;
    let registerResponseFixture: RegisterResponse;
    let serializableResponseFixture: RegisterSerializedResponse;
    let backendError: string | null;

    beforeAll(async () => {
      registerResponseFixture = {
        headers: {},
        body: {
          description: 'desc-fixture',
        },
        statusCode: 409,
      };

      serializableResponseFixture = {
        body: {
          description: 'desc-fixture',
        },
        statusCode: 409,
      };

      initialForm = {
        name: 'Mariote',
        email: 'mario.te@google.com',
        password: '123456',
        confirmPassword: '123456',
      };

      (validateName as jest.Mock<typeof validateName>).mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

      (validateEmail as jest.Mock<typeof validateEmail>).mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

      (
        validatePassword as jest.Mock<typeof validatePassword>
      ).mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

      (
        validateConfirmPassword as jest.Mock<typeof validateConfirmPassword>
      ).mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

      (
        httpClient.createUser as jest.Mock<typeof httpClient.createUser>
      ).mockResolvedValueOnce(registerResponseFixture);

      (
        buildSerializableResponse as jest.Mock<typeof buildSerializableResponse>
      ).mockReturnValueOnce(serializableResponseFixture);

      renderResult = renderHook(() => useRegisterForm(initialForm));
      const notifyFormFieldsFilled: () => void =
        renderResult.result.current.notifyFormFieldsFilled;

      act(() => {
        notifyFormFieldsFilled();
      });

      await waitFor(() => {
        formStatus = renderResult.result.current.formStatus;
        backendError = renderResult.result.current.backendError;
        expect(formStatus).toBe(RegisterStatus.backendKO);
      });
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should called httpClient.createUser()', () => {
      expect(httpClient.createUser).toHaveBeenCalled();
      expect(httpClient.createUser).toHaveBeenCalledWith(
        {},
        {
          name: 'Mariote',
          email: 'mario.te@google.com',
          password: '123456',
        },
      );
    });

    it('should return an status backend KO', () => {
      expect(formStatus).toBe(RegisterStatus.backendKO);
    });

    it('should return an error message Invalid Credentials', () => {
      expect(backendError).toBe(HTTP_CONFLICT_ERROR_MESSAGE);
    });
  });
});
