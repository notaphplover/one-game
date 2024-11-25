import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../hooks/useLoginForm');
jest.mock('../../common/hooks/useShowPassword');
jest.mock('../../app/store/hooks');

import { render, RenderResult } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { AuthenticatedAuthState } from '../../app/store/helpers/models/AuthState';
import { useAppSelector } from '../../app/store/hooks';
import { useShowPassword } from '../../common/hooks/useShowPassword';
import { useLoginForm } from '../hooks/useLoginForm';
import { LoginStatus } from '../models/LoginStatus';
import { UseLoginFormParams } from '../models/UseLoginFormResult';
import { Login } from './Login';

describe(Login.name, () => {
  let formFieldsFixture: UseLoginFormParams;

  let notifyFormFieldsFilledMock: jest.Mock<() => void>;
  let setFormFieldMock: jest.Mock<
    (event: React.ChangeEvent<HTMLInputElement>) => void
  >;

  let handleClickShowPasswordMock: jest.Mock<() => void>;
  let handleMouseDownPasswordMock: jest.Mock<
    (event: React.MouseEvent<HTMLElement>) => void
  >;

  let authenticatedAuthStateFixture: AuthenticatedAuthState | null;

  beforeAll(() => {
    formFieldsFixture = {
      email: 'email@email.com',
      password: 'password',
    };

    notifyFormFieldsFilledMock = jest.fn();
    setFormFieldMock = jest.fn();

    handleClickShowPasswordMock = jest.fn();
    handleMouseDownPasswordMock = jest.fn();

    authenticatedAuthStateFixture = null;
  });

  describe('when called, on an initial state', () => {
    let inputEmail: string | null;
    let inputPassword: string | null;

    beforeAll(() => {
      (useLoginForm as jest.Mock<typeof useLoginForm>).mockReturnValueOnce({
        backendError: null,
        formFields: formFieldsFixture,
        formStatus: LoginStatus.initial,
        formValidation: {},
        notifyFormFieldsFilled: notifyFormFieldsFilledMock,
        setFormField: setFormFieldMock,
      });

      (
        useShowPassword as jest.Mock<typeof useShowPassword>
      ).mockReturnValueOnce({
        handleClickShowPassword: handleClickShowPasswordMock,
        handleMouseDownPassword: handleMouseDownPasswordMock,
        showPassword: false,
      });

      (
        useAppSelector as unknown as jest.Mock<typeof useAppSelector>
      ).mockReturnValueOnce(authenticatedAuthStateFixture);

      const renderResult: RenderResult = render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>,
      );

      const formEmailTextFieldInput: HTMLInputElement | null =
        (renderResult.container.querySelector('.form-login-email')
          ?.childNodes[1]?.firstChild as HTMLInputElement | undefined) ?? null;

      inputEmail = formEmailTextFieldInput?.value ?? null;

      const formPasswordTextFieldInput: HTMLInputElement | null =
        (renderResult.container.querySelector('.form-login-password')
          ?.childNodes[1]?.firstChild as HTMLInputElement | undefined) ?? null;

      inputPassword = formPasswordTextFieldInput?.value ?? null;
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should initialize email', () => {
      expect(inputEmail).toBe(formFieldsFixture.email);
    });

    it('should initialize password', () => {
      expect(inputPassword).toBe(formFieldsFixture.password);
    });
  });

  describe('when called, and input value are invalid and an error is displayed', () => {
    let pErrorEmail: string | null;
    let pErrorPassword: string | null;
    const emailFixtureError: string = 'email Error';
    const passwordFixtureError: string = 'password Error';

    beforeAll(() => {
      (useLoginForm as jest.Mock<typeof useLoginForm>).mockReturnValueOnce({
        backendError: null,
        formFields: {
          email: '',
          password: '',
        },
        formStatus: LoginStatus.validationKO,
        formValidation: {
          email: emailFixtureError,
          password: passwordFixtureError,
        },
        notifyFormFieldsFilled: notifyFormFieldsFilledMock,
        setFormField: setFormFieldMock,
      });

      (
        useShowPassword as jest.Mock<typeof useShowPassword>
      ).mockReturnValueOnce({
        handleClickShowPassword: handleClickShowPasswordMock,
        handleMouseDownPassword: handleMouseDownPasswordMock,
        showPassword: false,
      });

      (
        useAppSelector as unknown as jest.Mock<typeof useAppSelector>
      ).mockReturnValueOnce(authenticatedAuthStateFixture);

      const renderResult: RenderResult = render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>,
      );

      const formEmailTextFieldParagraph: Text | null =
        (renderResult.container.querySelector('.form-login-email')
          ?.childNodes[2]?.firstChild as Text | undefined) ?? null;

      pErrorEmail = formEmailTextFieldParagraph?.textContent ?? null;

      const formPasswordTextFieldParagraph: Text | null =
        (renderResult.container.querySelector('.form-login-password')
          ?.childNodes[2]?.firstChild as Text | undefined) ?? null;

      pErrorPassword = formPasswordTextFieldParagraph?.textContent ?? null;
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should email has an error', () => {
      expect(pErrorEmail).toBe(emailFixtureError);
    });

    it('should password has an error', () => {
      expect(pErrorPassword).toBe(passwordFixtureError);
    });
  });

  describe('when called, and exist a backend error and error is displayed', () => {
    let pErrorBackend: string | null;
    const backendErrorFixture = 'backend error';

    beforeAll(() => {
      (useLoginForm as jest.Mock<typeof useLoginForm>).mockReturnValueOnce({
        backendError: backendErrorFixture,
        formFields: formFieldsFixture,
        formStatus: LoginStatus.backendKO,
        formValidation: {},
        notifyFormFieldsFilled: notifyFormFieldsFilledMock,
        setFormField: setFormFieldMock,
      });

      (
        useShowPassword as jest.Mock<typeof useShowPassword>
      ).mockReturnValueOnce({
        handleClickShowPassword: handleClickShowPasswordMock,
        handleMouseDownPassword: handleMouseDownPasswordMock,
        showPassword: false,
      });

      (
        useAppSelector as unknown as jest.Mock<typeof useAppSelector>
      ).mockReturnValueOnce(authenticatedAuthStateFixture);

      const renderResult: RenderResult = render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>,
      );

      const formErrorMessageAlertMessage: Text | null =
        (renderResult.container.querySelector('.MuiAlert-message')
          ?.childNodes[1] as Text | undefined) ?? null;

      pErrorBackend = formErrorMessageAlertMessage?.textContent ?? null;
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should display a textbox with the message error', () => {
      expect(pErrorBackend).toBe(backendErrorFixture);
    });
  });
});
