import { describe, expect, jest, it, beforeAll, afterAll } from '@jest/globals';
import { act, renderHook, waitFor } from '@testing-library/react';
import {
  STATUS_LOG_BACKEND_KO,
  STATUS_LOG_BACKEND_OK,
  STATUS_LOG_INITIAL,
  USER_NOT_EXISTS_ERROR,
  useLoginForm,
} from './useLoginForm';
import { validateFormEmail } from '../../common/helpers/validateFormEmail';
import { validateFormPassword } from '../../common/helpers/validateFormPassword';
import { useDispatch } from 'react-redux';

jest.mock('../../common/helpers/validateFormEmail');
jest.mock('../../common/helpers/validateFormPassword');
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

describe(useLoginForm.name, () => {
  let initialForm;
  let dispatchMock;
  let emailErrorFixture;
  let passwordErrorFixture;

  beforeAll(() => {
    initialForm = {
      email: 'email',
      password: 'password',
    };

    emailErrorFixture = 'error-email';
    passwordErrorFixture = 'error-password';
  });

  describe('when called, on an initialize values', () => {
    let result;
    let formFields;
    let formStatus;

    beforeAll(() => {
      result = renderHook(() => useLoginForm(initialForm)).result;

      formFields = result.current.formFields;
      formStatus = result.current.formStatus;
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
      expect(formStatus).toBe(STATUS_LOG_INITIAL);
    });
  });

  describe('when called, and email input value is not correct', () => {
    let result;
    let notifyFormFieldsFilled;
    let formValidation;

    beforeAll(() => {
      validateFormEmail.mockImplementation((formValidationValue) => {
        formValidationValue.email = emailErrorFixture;
      });

      result = renderHook(() => useLoginForm(initialForm)).result;

      notifyFormFieldsFilled = result.current.notifyFormFieldsFilled;

      act(() => {
        notifyFormFieldsFilled();
      });

      formValidation = result.current.formValidation;
    });

    afterAll(() => {
      jest.clearAllMocks();
      validateFormEmail.mockReset();
    });

    it('should have been called validateFormEmail once', () => {
      expect(validateFormEmail).toHaveBeenCalledTimes(1);
    });
    it('should have been called validateFormEmail with arguments', () => {
      expect(validateFormEmail).toHaveBeenCalledWith(
        formValidation,
        initialForm.email,
      );
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
      validateFormPassword.mockImplementation((formValidationValue) => {
        formValidationValue.password = passwordErrorFixture;
      });

      result = renderHook(() => useLoginForm(initialForm)).result;

      notifyFormFieldsFilled = result.current.notifyFormFieldsFilled;

      act(() => {
        notifyFormFieldsFilled();
      });

      formValidation = result.current.formValidation;
    });

    afterAll(() => {
      jest.clearAllMocks();
      validateFormPassword.mockReset();
    });

    it('should have been called validateFormPassword once', () => {
      expect(validateFormPassword).toHaveBeenCalledTimes(1);
    });
    it('should have been called validateFormPassword with arguments', () => {
      expect(validateFormPassword).toHaveBeenCalledWith(
        formValidation,
        initialForm.password,
      );
    });
    it('should return an invalid password error message', () => {
      expect(formValidation).toStrictEqual({ password: passwordErrorFixture });
    });
  });

  describe('when called, and API returns an OK response', () => {
    let result;
    let notifyFormFieldsFilled;
    let formStatus;

    beforeAll(async () => {
      dispatchMock = jest.fn().mockResolvedValue({
        payload: {
          body: { jwt: 'jwt-fixture' },
          statusCode: 200,
        },
      });

      useDispatch.mockReturnValue(dispatchMock);

      result = renderHook(() => useLoginForm(initialForm)).result;

      notifyFormFieldsFilled = result.current.notifyFormFieldsFilled;

      act(() => {
        notifyFormFieldsFilled();
      });

      await waitFor(() => {
        formStatus = result.current.formStatus;
        expect(formStatus).toBe(STATUS_LOG_BACKEND_OK);
      });
    });

    afterAll(() => {
      jest.clearAllMocks();
      useDispatch.mockReset();
      dispatchMock.mockReset();
    });

    it('should return an status backend OK', () => {
      expect(formStatus).toBe(STATUS_LOG_BACKEND_OK);
    });
  });

  describe('when called, and API returns a non OK response', () => {
    let result;
    let notifyFormFieldsFilled;
    let formStatus;
    let backendError;

    beforeAll(async () => {
      dispatchMock = jest.fn().mockResolvedValue({
        payload: {
          body: { jwt: null },
          statusCode: 422,
        },
      });

      useDispatch.mockReturnValue(dispatchMock);

      result = renderHook(() => useLoginForm(initialForm)).result;

      notifyFormFieldsFilled = result.current.notifyFormFieldsFilled;

      act(() => {
        notifyFormFieldsFilled();
      });

      await waitFor(() => {
        formStatus = result.current.formStatus;
        backendError = result.current.backendError;
        expect(formStatus).toBe(STATUS_LOG_BACKEND_KO);
      });
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should return an status backend KO', () => {
      expect(formStatus).toBe(STATUS_LOG_BACKEND_KO);
    });
    it('should return an error message User Not Exist', () => {
      expect(backendError).toBe(USER_NOT_EXISTS_ERROR);
    });
  });
});
