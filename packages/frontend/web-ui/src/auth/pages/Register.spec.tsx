import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../app/store/hooks');
jest.mock('../../common/hooks/useRedirectAuthorized');
jest.mock('../../common/hooks/useShowPassword');
jest.mock('../hooks/useRegister');

import { render, RenderResult } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { AuthenticatedAuthState } from '../../app/store/helpers/models/AuthState';
import { useAppSelector } from '../../app/store/hooks';
import { useShowPassword } from '../../common/hooks/useShowPassword';
import { useRegister } from '../hooks/useRegister';
import { UseRegisterFormParams } from '../models/UseRegisterFormResult';
import { UseRegisterStatus } from '../models/UseRegisterStatus';
import { Register } from './Register';

describe(Register.name, () => {
  let formFieldsFixture: UseRegisterFormParams;
  let authFixture: AuthenticatedAuthState | null;

  let handleClickShowPasswordMock: jest.Mock<() => void>;
  let handleMouseDownPasswordMock: jest.Mock<
    (event: React.MouseEvent<HTMLElement>) => void
  >;

  beforeAll(() => {
    formFieldsFixture = {
      confirmPassword: 'confirm-password-fixture',
      email: 'name@fixture.com',
      name: 'name fixture',
      password: 'password-fixture',
    };

    authFixture = null;
  });

  describe('when called, and useRegister returns result with status idle', () => {
    let useRegisterResultFixture: jest.Mocked<ReturnType<typeof useRegister>>;

    let nameInputValue: string | null;
    let emailInputValue: string | null;
    let passwordInputValue: string | null;
    let confirmPasswordInputValue: string | null;

    let nameErrorValue: string | null;
    let emailErrorValue: string | null;
    let passwordErrorValue: string | null;
    let confirmPasswordErrorValue: string | null;

    beforeAll(() => {
      useRegisterResultFixture = [
        {
          form: {
            fields: {
              confirmPassword: 'confirm-password-fixture',
              email: 'name@fixture.com',
              name: 'name fixture',
              password: 'password-fixture',
            },
            validation: {
              confirmPassword: 'confirm-password-error-message',
              email: 'email-error-message',
              name: 'name-error-message',
              password: 'password-error-message',
            },
          },
          status: UseRegisterStatus.idle,
        },
        {
          handlers: {
            onConfirmPasswordChanged: jest.fn(),
            onEmailChanged: jest.fn(),
            onNameChanged: jest.fn(),
            onPasswordChanged: jest.fn(),
            onSubmit: jest.fn(),
          },
        },
      ];

      (useRegister as jest.Mock<typeof useRegister>).mockReturnValueOnce(
        useRegisterResultFixture,
      );

      (useAppSelector as jest.Mock<typeof useAppSelector>).mockReturnValueOnce(
        authFixture,
      );

      (
        useShowPassword as jest.Mock<typeof useShowPassword>
      ).mockReturnValueOnce({
        handleClickShowPassword: handleClickShowPasswordMock,
        handleMouseDownPassword: handleMouseDownPasswordMock,
        showPassword: false,
      });

      const renderResult: RenderResult = render(
        <MemoryRouter>
          <Register />
        </MemoryRouter>,
      );

      const nameFieldInput: HTMLInputElement | null =
        (renderResult.container.querySelector('.form-register-name')
          ?.childNodes[1]?.firstChild as HTMLInputElement | undefined) ?? null;

      nameInputValue = nameFieldInput?.value ?? null;

      const nameFieldParagraph: Text | null =
        (renderResult.container.querySelector('.form-register-name')
          ?.childNodes[2]?.firstChild as Text | undefined) ?? null;

      nameErrorValue = nameFieldParagraph?.textContent ?? null;

      const formEmailTextFieldInput: HTMLInputElement | null =
        (renderResult.container.querySelector('.form-register-email')
          ?.childNodes[1]?.firstChild as HTMLInputElement | undefined) ?? null;

      emailInputValue = formEmailTextFieldInput?.value ?? null;

      const formEmailTextFieldParagraph: Text | null =
        (renderResult.container.querySelector('.form-register-email')
          ?.childNodes[2]?.firstChild as Text | undefined) ?? null;

      emailErrorValue = formEmailTextFieldParagraph?.textContent ?? null;

      const formPasswordTextFieldInput: HTMLInputElement | null =
        (renderResult.container.querySelector('.form-register-password')
          ?.childNodes[1]?.firstChild as HTMLInputElement | undefined) ?? null;

      passwordInputValue = formPasswordTextFieldInput?.value ?? null;

      const formPasswordTextFieldParagraph: Text | null =
        (renderResult.container.querySelector('.form-register-password')
          ?.childNodes[2]?.firstChild as Text | undefined) ?? null;

      passwordErrorValue = formPasswordTextFieldParagraph?.textContent ?? null;

      const formConfirmPasswordTextFieldInput: HTMLInputElement | null =
        (renderResult.container.querySelector('.form-register-confirm-password')
          ?.childNodes[1]?.firstChild as HTMLInputElement | undefined) ?? null;

      confirmPasswordInputValue =
        formConfirmPasswordTextFieldInput?.value ?? null;

      const formConfirmPasswordTextFieldParagraph: Text | null =
        (renderResult.container.querySelector('.form-register-confirm-password')
          ?.childNodes[2]?.firstChild as Text | undefined) ?? null;

      confirmPasswordErrorValue =
        formConfirmPasswordTextFieldParagraph?.textContent ?? null;
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should initialize name', () => {
      expect(nameInputValue).toBe(formFieldsFixture.name);
    });

    it('should initialize email', () => {
      expect(emailInputValue).toBe(formFieldsFixture.email);
    });

    it('should initialize password', () => {
      expect(passwordInputValue).toBe(formFieldsFixture.password);
    });

    it('should initialize confirm password', () => {
      expect(confirmPasswordInputValue).toBe(formFieldsFixture.confirmPassword);
    });

    it('should name has an error', () => {
      const [data]: jest.Mocked<ReturnType<typeof useRegister>> =
        useRegisterResultFixture;

      expect(nameErrorValue).toBe(data.form.validation.name);
    });

    it('should email has an error', () => {
      const [data]: jest.Mocked<ReturnType<typeof useRegister>> =
        useRegisterResultFixture;

      expect(emailErrorValue).toBe(data.form.validation.email);
    });

    it('should password has an error', () => {
      const [data]: jest.Mocked<ReturnType<typeof useRegister>> =
        useRegisterResultFixture;

      expect(passwordErrorValue).toBe(data.form.validation.password);
    });

    it('should confirm password has an error', () => {
      const [data]: jest.Mocked<ReturnType<typeof useRegister>> =
        useRegisterResultFixture;

      expect(confirmPasswordErrorValue).toBe(
        data.form.validation.confirmPassword,
      );
    });
  });

  describe('when called, and useRegister returns result with status success', () => {
    let useRegisterResultFixture: jest.Mocked<ReturnType<typeof useRegister>>;
    let userCreateOk: string | null;
    const messageConfirmation: string =
      'User created! We sent an email, please, check your inbox.';

    beforeAll(() => {
      useRegisterResultFixture = [
        {
          form: {
            fields: {
              confirmPassword: 'confirm-password-fixture',
              email: 'name@fixture.com',
              name: 'name fixture',
              password: 'password-fixture',
            },
            validation: {},
          },
          status: UseRegisterStatus.success,
        },
        {
          handlers: {
            onConfirmPasswordChanged: jest.fn(),
            onEmailChanged: jest.fn(),
            onNameChanged: jest.fn(),
            onPasswordChanged: jest.fn(),
            onSubmit: jest.fn(),
          },
        },
      ];

      (useRegister as jest.Mock<typeof useRegister>).mockReturnValueOnce(
        useRegisterResultFixture,
      );

      (useAppSelector as jest.Mock<typeof useAppSelector>).mockReturnValueOnce(
        authFixture,
      );

      (
        useShowPassword as jest.Mock<typeof useShowPassword>
      ).mockReturnValueOnce({
        handleClickShowPassword: jest.fn(),
        handleMouseDownPassword: jest.fn(),
        showPassword: false,
      });

      const renderResult: RenderResult = render(
        <MemoryRouter>
          <Register />
        </MemoryRouter>,
      );

      const formMessageAlertMessage: Text | null =
        (renderResult.container.querySelector('.form-register-success')
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
