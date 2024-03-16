import { describe, expect, jest, it, beforeAll, afterAll } from '@jest/globals';

jest.mock('../../common/helpers/validateEmail');
jest.mock('../../common/helpers/validatePassword');
jest.mock('../helpers/isFullfilledPayloadAction');
jest.mock('react-redux', () => ({
  ...(jest.requireActual('react-redux') as Record<string, unknown>),
  useDispatch: jest.fn(),
}));

import {
  RenderHookResult,
  act,
  renderHook,
  waitFor,
} from '@testing-library/react';
import { INVALID_CREDENTIALS_ERROR, useLoginForm } from './useLoginForm';
import { validateEmail } from '../../common/helpers/validateEmail';
import { validatePassword } from '../../common/helpers/validatePassword';
import { useDispatch } from 'react-redux';
import {
  FormFieldsApp,
  FormValidationResult,
  UseLoginFormParams,
  UseLoginFormResult,
} from '../models/UseLoginFormResult';
import { LoginStatus } from '../models/LoginStatus';
import { useAppDispatch } from '../../app/store/hooks';
import { PayloadAction } from '@reduxjs/toolkit';
import { AuthSerializedResponse } from '../../common/http/models/AuthSerializedResponse';
import { isFullfilledPayloadAction } from '../helpers/isFullfilledPayloadAction';

describe(useLoginForm.name, () => {
  let initialForm: UseLoginFormParams;
  let dispatchMock: ReturnType<typeof useAppDispatch> &
    jest.Mock<ReturnType<typeof useAppDispatch>>;
  let emailErrorFixture: string;
  let passwordErrorFixture: string;

  beforeAll(() => {
    initialForm = {
      email: 'email',
      password: 'password',
    };

    emailErrorFixture = 'error-email';
    passwordErrorFixture = 'error-password';
  });

  describe('when called, on an initialize values', () => {
    let result: RenderHookResult<UseLoginFormResult, unknown>;
    let formFields: FormFieldsApp;
    let formStatus: LoginStatus;

    beforeAll(() => {
      result = renderHook(() => useLoginForm(initialForm));

      formFields = result.result.current.formFields;
      formStatus = result.result.current.formStatus;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should initialize values on email', () => {
      expect(formFields.email).toBe(initialForm.email);
    });

    it('should initialize values on password', () => {
      expect(formFields.password).toBe(initialForm.password);
    });

    it('should initialize values on status', () => {
      expect(formStatus).toBe(LoginStatus.initial);
    });
  });

  describe('when called, and email input value is not correct', () => {
    let result: RenderHookResult<UseLoginFormResult, unknown>;
    let notifyFormFieldsFilled: () => void;
    let formValidation: FormValidationResult;

    beforeAll(() => {
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

      result = renderHook(() => useLoginForm(initialForm));

      notifyFormFieldsFilled = result.result.current.notifyFormFieldsFilled;

      act(() => {
        notifyFormFieldsFilled();
      });

      formValidation = result.result.current.formValidation;
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
    let result: RenderHookResult<UseLoginFormResult, unknown>;
    let notifyFormFieldsFilled: () => void;
    let formValidation: FormValidationResult;

    beforeAll(() => {
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

      result = renderHook(() => useLoginForm(initialForm));

      notifyFormFieldsFilled = result.result.current.notifyFormFieldsFilled;

      act(() => {
        notifyFormFieldsFilled();
      });

      formValidation = result.result.current.formValidation;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should have been called validateFormPassword once', () => {
      expect(validatePassword).toHaveBeenCalledTimes(1);
    });
    it('should have been called validateFormPassword with arguments', () => {
      expect(validatePassword).toHaveBeenCalledWith(initialForm.password);
    });
    it('should return an invalid password error message', () => {
      expect(formValidation).toStrictEqual({ password: passwordErrorFixture });
    });
  });

  describe('when called, and API returns an OK response', () => {
    let result: RenderHookResult<UseLoginFormResult, unknown>;
    let notifyFormFieldsFilled: () => void;
    let formStatus: LoginStatus;

    beforeAll(async () => {
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

      const payloadActionFixture: PayloadAction<AuthSerializedResponse> = {
        payload: {
          body: {
            jwt: 'jwt-fixture',
          },
          statusCode: 200,
        },
        type: 'sample-type',
      };

      dispatchMock = jest
        .fn<ReturnType<typeof useAppDispatch>>()
        .mockImplementationOnce(
          <TReturn, TAction>(): TAction | TReturn =>
            payloadActionFixture as TReturn,
        ) as ReturnType<typeof useAppDispatch> &
        jest.Mock<ReturnType<typeof useAppDispatch>>;

      (
        isFullfilledPayloadAction as unknown as jest.Mock<
          typeof isFullfilledPayloadAction
        >
      ).mockReturnValueOnce(true);

      (
        useAppDispatch as unknown as jest.Mock<typeof useAppDispatch>
      ).mockReturnValue(dispatchMock);

      result = renderHook(() => useLoginForm(initialForm));

      notifyFormFieldsFilled = result.result.current.notifyFormFieldsFilled;

      act(() => {
        notifyFormFieldsFilled();
      });

      await waitFor(() => {
        formStatus = result.result.current.formStatus;
        expect(formStatus).toBe(LoginStatus.backendOK);
      });
    });

    afterAll(() => {
      jest.clearAllMocks();
      dispatchMock.mockReset();
    });

    it('should return an status backend OK', () => {
      expect(formStatus).toBe(LoginStatus.backendOK);
    });
  });

  describe('when called, and API returns a non OK response', () => {
    let result: RenderHookResult<UseLoginFormResult, unknown>;
    let notifyFormFieldsFilled: () => void;
    let formStatus: LoginStatus;
    let backendError: string | null;

    beforeAll(async () => {
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

      const payloadActionFixture: PayloadAction<AuthSerializedResponse> = {
        payload: {
          body: {
            description: 'desc-fixture',
          },
          statusCode: 401,
        },
        type: 'sample-type',
      };

      dispatchMock = jest
        .fn<ReturnType<typeof useAppDispatch>>()
        .mockImplementationOnce(
          <TReturn, TAction>(): TAction | TReturn =>
            payloadActionFixture as TReturn,
        ) as ReturnType<typeof useAppDispatch> &
        jest.Mock<ReturnType<typeof useAppDispatch>>;

      (
        isFullfilledPayloadAction as unknown as jest.Mock<
          typeof isFullfilledPayloadAction
        >
      ).mockReturnValueOnce(true);

      (
        useAppDispatch as unknown as jest.Mock<typeof useAppDispatch>
      ).mockReturnValue(dispatchMock);

      result = renderHook(() => useLoginForm(initialForm));

      notifyFormFieldsFilled = result.result.current.notifyFormFieldsFilled;

      act(() => {
        notifyFormFieldsFilled();
      });

      await waitFor(() => {
        formStatus = result.result.current.formStatus;
        backendError = result.result.current.backendError;
        expect(formStatus).toBe(LoginStatus.backendKO);
      });
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should return an status backend KO', () => {
      expect(formStatus).toBe(LoginStatus.backendKO);
    });
    it('should return an error message Invalid Credentials', () => {
      expect(backendError).toBe(INVALID_CREDENTIALS_ERROR);
    });
  });
});
