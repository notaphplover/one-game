import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../hooks/useAuthForgot');

import { render, RenderResult } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { HTTP_BAD_REQUEST_USER_ERROR_MESSAGE } from '../helpers/createUserErrorMessages';
import { useAuthForgot } from '../hooks/useAuthForgot';
import { AuthForgotFormFields } from '../models/UseAuthForgotData';
import { UseAuthForgotStatus } from '../models/UseAuthForgotStatus';
import { AuthForgot } from './AuthForgot';

describe(AuthForgot.name, () => {
  let formFieldsFixture: AuthForgotFormFields;

  beforeAll(() => {
    formFieldsFixture = {
      email: 'name@fixture.com',
    };
  });

  describe('when called, and useAuthForgot returns result with status idle', () => {
    let useAuthForgotResultFixture: jest.Mocked<
      ReturnType<typeof useAuthForgot>
    >;

    let emailInputValue: string | null;
    let emailErrorValue: string | null;

    beforeAll(() => {
      useAuthForgotResultFixture = [
        {
          form: {
            fields: {
              email: 'name@fixture.com',
            },
            validation: {
              email: 'email-error-message',
            },
          },
          status: UseAuthForgotStatus.idle,
        },
        {
          handlers: {
            onEmailChanged: jest.fn(),
            onSubmit: jest.fn(),
          },
        },
      ];

      (useAuthForgot as jest.Mock<typeof useAuthForgot>).mockReturnValueOnce(
        useAuthForgotResultFixture,
      );

      const renderResult: RenderResult = render(
        <MemoryRouter>
          <AuthForgot />
        </MemoryRouter>,
      );

      const formEmailTextFieldInput: HTMLInputElement | null =
        (renderResult.container.querySelector('.form-forgot-email')
          ?.childNodes[1]?.firstChild as HTMLInputElement | undefined) ?? null;

      emailInputValue = formEmailTextFieldInput?.value ?? null;

      const formEmailTextFieldParagraph: Text | null =
        (renderResult.container.querySelector('.form-forgot-email')
          ?.childNodes[2]?.firstChild as Text | undefined) ?? null;

      emailErrorValue = formEmailTextFieldParagraph?.textContent ?? null;
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should initialize email', () => {
      expect(emailInputValue).toBe(formFieldsFixture.email);
    });

    it('should email has an error', () => {
      const [data]: jest.Mocked<ReturnType<typeof useAuthForgot>> =
        useAuthForgotResultFixture;

      expect(emailErrorValue).toBe(data.form.validation.email);
    });
  });

  describe('when called, and useAuthForgot returns result with result backend error', () => {
    let useAuthForgotResultFixture: jest.Mocked<
      ReturnType<typeof useAuthForgot>
    >;
    let userCreateError: string | null;
    const errorMessage: string = HTTP_BAD_REQUEST_USER_ERROR_MESSAGE;

    beforeAll(() => {
      useAuthForgotResultFixture = [
        {
          form: {
            errorMessage: HTTP_BAD_REQUEST_USER_ERROR_MESSAGE,
            fields: {
              email: 'name@fixture.com',
            },
            validation: {},
          },
          status: UseAuthForgotStatus.backendError,
        },
        {
          handlers: {
            onEmailChanged: jest.fn(),
            onSubmit: jest.fn(),
          },
        },
      ];

      (useAuthForgot as jest.Mock<typeof useAuthForgot>).mockReturnValueOnce(
        useAuthForgotResultFixture,
      );

      const renderResult: RenderResult = render(
        <MemoryRouter>
          <AuthForgot />
        </MemoryRouter>,
      );

      const formMessageAlertMessage: Text | null =
        (renderResult.container.querySelector('.forgot-error-container')
          ?.childNodes[0]?.childNodes[1]?.lastChild as Text | undefined) ??
        null;

      userCreateError = formMessageAlertMessage?.textContent ?? null;
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should display a textbox with the error message', () => {
      expect(userCreateError).toBe(errorMessage);
    });
  });

  describe('when called, and useAuthForgot returns result with status success', () => {
    let useAuthForgotResultFixture: jest.Mocked<
      ReturnType<typeof useAuthForgot>
    >;
    let userCreateOk: string | null;
    const messageConfirmation: string =
      'We sent an email, please, check your inbox.';

    beforeAll(() => {
      useAuthForgotResultFixture = [
        {
          form: {
            fields: {
              email: 'name@fixture.com',
            },
            validation: {},
          },
          status: UseAuthForgotStatus.success,
        },
        {
          handlers: {
            onEmailChanged: jest.fn(),
            onSubmit: jest.fn(),
          },
        },
      ];

      (useAuthForgot as jest.Mock<typeof useAuthForgot>).mockReturnValueOnce(
        useAuthForgotResultFixture,
      );

      const renderResult: RenderResult = render(
        <MemoryRouter>
          <AuthForgot />
        </MemoryRouter>,
      );

      const formMessageAlertMessage: Text | null =
        (renderResult.container.querySelector('.forgot-success-container')
          ?.childNodes[0]?.childNodes[1]?.lastChild as Text | undefined) ??
        null;

      userCreateOk = formMessageAlertMessage?.textContent ?? null;
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should display a textbox with the confirmation message', () => {
      expect(userCreateOk).toBe(messageConfirmation);
    });
  });
});
