import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../hooks/useResetPassword');

import { render, RenderResult } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { HTTP_UNAUTHORIZED_UPD_USER_ME_ERROR_MESSAGE } from '../helpers/updateUserMeErrorMessage';
import { useResetPassword } from '../hooks/useResetPassword';
import { ResetPasswordFormFields } from '../models/UseResetPasswordData';
import { UseResetPasswordStatus } from '../models/UseResetPasswordStatus';
import { ResetPassword } from './ResetPassword';

describe(ResetPassword.name, () => {
  let formFieldsFixture: ResetPasswordFormFields;

  beforeAll(() => {
    formFieldsFixture = {
      confirmPassword: 'password-fixture',
      password: 'password-fixture',
    };
  });

  describe('when called, and useResetPassword returns result with status pending', () => {
    let useResetPasswordResultFixture: jest.Mocked<
      ReturnType<typeof useResetPassword>
    >;

    let passwordInputValue: string | null;
    let confirmPasswordInputValue: string | null;
    let passwordErrorValue: string | null;
    let confirmPasswordErrorValue: string | null;

    beforeAll(() => {
      useResetPasswordResultFixture = [
        {
          form: {
            fields: formFieldsFixture,
            validation: {
              confirmPassword: 'confirm-password-error-message',
              password: 'password-error-message',
            },
          },
          status: UseResetPasswordStatus.pending,
        },
        {
          handlers: {
            onConfirmPasswordChanged: jest.fn(),
            onPasswordChanged: jest.fn(),
            onSubmit: jest.fn(),
          },
        },
      ];

      (
        useResetPassword as jest.Mock<typeof useResetPassword>
      ).mockReturnValueOnce(useResetPasswordResultFixture);

      const renderResult: RenderResult = render(
        <MemoryRouter>
          <ResetPassword />
        </MemoryRouter>,
      );

      const formPasswordTextFieldInput: HTMLInputElement | null =
        (renderResult.container.querySelector('.form-reset-password')
          ?.childNodes[1]?.firstChild as HTMLInputElement | undefined) ?? null;

      passwordInputValue = formPasswordTextFieldInput?.value ?? null;

      const formPasswordTextFieldParagraph: Text | null =
        (renderResult.container.querySelector('.form-reset-password')
          ?.childNodes[2]?.firstChild as Text | undefined) ?? null;

      passwordErrorValue = formPasswordTextFieldParagraph?.textContent ?? null;

      const formConfirmPasswordTextFieldInput: HTMLInputElement | null =
        (renderResult.container.querySelector('.form-reset-confirm-password')
          ?.childNodes[1]?.firstChild as HTMLInputElement | undefined) ?? null;

      confirmPasswordInputValue =
        formConfirmPasswordTextFieldInput?.value ?? null;

      const formConfirmPasswordTextFieldParagraph: Text | null =
        (renderResult.container.querySelector('.form-reset-confirm-password')
          ?.childNodes[2]?.firstChild as Text | undefined) ?? null;

      confirmPasswordErrorValue =
        formConfirmPasswordTextFieldParagraph?.textContent ?? null;
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should initialize password', () => {
      expect(passwordInputValue).toBe(formFieldsFixture.password);
    });

    it('should initialize confirm password', () => {
      expect(confirmPasswordInputValue).toBe(formFieldsFixture.confirmPassword);
    });

    it('should email has an error on password', () => {
      const [data]: jest.Mocked<ReturnType<typeof useResetPassword>> =
        useResetPasswordResultFixture;

      expect(passwordErrorValue).toBe(data.form.validation.password);
    });

    it('should email has an error on confirmPassword', () => {
      const [data]: jest.Mocked<ReturnType<typeof useResetPassword>> =
        useResetPasswordResultFixture;

      expect(confirmPasswordErrorValue).toBe(
        data.form.validation.confirmPassword,
      );
    });
  });

  describe('when called, and useResetPassword returns result with result backend error', () => {
    let useResetPasswordResultFixture: jest.Mocked<
      ReturnType<typeof useResetPassword>
    >;
    let updateUserError: string | null;
    const errorMessage: string = HTTP_UNAUTHORIZED_UPD_USER_ME_ERROR_MESSAGE;

    beforeAll(() => {
      useResetPasswordResultFixture = [
        {
          form: {
            errorMessage: HTTP_UNAUTHORIZED_UPD_USER_ME_ERROR_MESSAGE,
            fields: {
              confirmPassword: 'confirmPassword-fixture',
              password: 'password-fixture',
            },
            validation: {},
          },
          status: UseResetPasswordStatus.backendError,
        },
        {
          handlers: {
            onConfirmPasswordChanged: jest.fn(),
            onPasswordChanged: jest.fn(),
            onSubmit: jest.fn(),
          },
        },
      ];

      (
        useResetPassword as jest.Mock<typeof useResetPassword>
      ).mockReturnValueOnce(useResetPasswordResultFixture);

      const renderResult: RenderResult = render(
        <MemoryRouter>
          <ResetPassword />
        </MemoryRouter>,
      );

      const formMessageAlertMessage: Text | null =
        (renderResult.container.querySelector('.form-reset-password-error')
          ?.childNodes[0]?.childNodes[1]?.lastChild as Text | undefined) ??
        null;

      updateUserError = formMessageAlertMessage?.textContent ?? null;
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should display a textbox with the error message', () => {
      expect(updateUserError).toBe(errorMessage);
    });
  });

  describe('when called, and useResetPassword returns result with status success', () => {
    let useResetPasswordResultFixture: jest.Mocked<
      ReturnType<typeof useResetPassword>
    >;
    let updateUserMeOk: string | null;
    const messageConfirmation: string = 'Password reset successfully!';

    beforeAll(() => {
      useResetPasswordResultFixture = [
        {
          form: {
            fields: {
              confirmPassword: 'confirmPassword-fixture',
              password: 'password-fixture',
            },
            validation: {},
          },
          status: UseResetPasswordStatus.success,
        },
        {
          handlers: {
            onConfirmPasswordChanged: jest.fn(),
            onPasswordChanged: jest.fn(),
            onSubmit: jest.fn(),
          },
        },
      ];

      (
        useResetPassword as jest.Mock<typeof useResetPassword>
      ).mockReturnValueOnce(useResetPasswordResultFixture);

      const renderResult: RenderResult = render(
        <MemoryRouter>
          <ResetPassword />
        </MemoryRouter>,
      );

      const formMessageAlertMessage: Text | null =
        (renderResult.container.querySelector('.form-reset-password-success')
          ?.childNodes[0]?.childNodes[1]?.lastChild as Text | undefined) ??
        null;

      updateUserMeOk = formMessageAlertMessage?.textContent ?? null;
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should display a textbox with the confirmation message', () => {
      expect(updateUserMeOk).toBe(messageConfirmation);
    });
  });
});
