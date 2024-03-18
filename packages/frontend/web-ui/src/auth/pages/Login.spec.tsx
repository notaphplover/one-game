import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../hooks/useLoginForm');
jest.mock('../../common/hooks/useShowPassword');
jest.mock('../../app/store/hooks');
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as Record<string, unknown>),
  useNavigate: jest.fn(),
}));

import { Login } from './Login';
import { RenderResult, render } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { useLoginForm } from '../hooks/useLoginForm';
import { useShowPassword } from '../../common/hooks/useShowPassword';
import { UseLoginFormParams } from '../models/UseLoginFormResult';
import { LoginStatus } from '../models/LoginStatus';
import { useAppSelector } from '../../app/store/hooks';

describe(Login.name, () => {
  let formFieldsFixture: UseLoginFormParams;

  let notifyFormFieldsFilledMock: jest.Mock;
  let setFormFieldMock: jest.Mock;

  let handleClickShowPasswordMock: jest.Mock;
  let handleMouseDownPasswordMock: jest.Mock;

  let navigateMock: ReturnType<typeof useNavigate> &
    jest.Mock<ReturnType<typeof useNavigate>>;
  let tokenFixture: string | null;

  beforeAll(() => {
    formFieldsFixture = {
      email: 'email@email.com',
      password: 'password',
    };

    notifyFormFieldsFilledMock = jest.fn();
    setFormFieldMock = jest.fn();

    handleClickShowPasswordMock = jest.fn();
    handleMouseDownPasswordMock = jest.fn();

    navigateMock = jest
      .fn<ReturnType<typeof useNavigate>>()
      .mockReturnValue(undefined) as ReturnType<typeof useNavigate> &
      jest.Mock<ReturnType<typeof useNavigate>>;

    tokenFixture = null;
  });

  describe('when called, on an initial state', () => {
    let inputEmail: string;
    let inputPassword: string;

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
        showPassword: false,
        handleClickShowPassword: handleClickShowPasswordMock,
        handleMouseDownPassword: handleMouseDownPasswordMock,
      });

      (
        useAppSelector as unknown as jest.Mock<typeof useAppSelector>
      ).mockReturnValueOnce(tokenFixture);

      const renderResult: RenderResult = render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>,
      );

      const formEmailTextFieldInput: HTMLInputElement | null =
        (renderResult.container.querySelector('.form-login-email')
          ?.childNodes[1]?.firstChild as HTMLInputElement) ?? null;

      inputEmail = formEmailTextFieldInput.value;

      const formPasswordTextFieldInput: HTMLInputElement | null =
        (renderResult.container.querySelector('.form-login-password')
          ?.childNodes[1]?.firstChild as HTMLInputElement) ?? null;

      inputPassword = formPasswordTextFieldInput.value;
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
        showPassword: false,
        handleClickShowPassword: handleClickShowPasswordMock,
        handleMouseDownPassword: handleMouseDownPasswordMock,
      });

      (
        useAppSelector as unknown as jest.Mock<typeof useAppSelector>
      ).mockReturnValueOnce(tokenFixture);

      const renderResult: RenderResult = render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>,
      );

      const formEmailTextFieldParagraph: Text | null =
        (renderResult.container.querySelector('.form-login-email')
          ?.childNodes[2]?.firstChild as Text) ?? null;

      pErrorEmail = formEmailTextFieldParagraph?.textContent;

      const formPasswordTextFieldParagraph: Text | null =
        (renderResult.container.querySelector('.form-login-password')
          ?.childNodes[2]?.firstChild as Text) ?? null;

      pErrorPassword = formPasswordTextFieldParagraph?.textContent;
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
        showPassword: false,
        handleClickShowPassword: handleClickShowPasswordMock,
        handleMouseDownPassword: handleMouseDownPasswordMock,
      });

      (
        useAppSelector as unknown as jest.Mock<typeof useAppSelector>
      ).mockReturnValueOnce(tokenFixture);

      const renderResult: RenderResult = render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>,
      );

      const formErrorMessageAlertMessage: Text | null =
        (renderResult.container.querySelector('.MuiAlert-message')
          ?.childNodes[1] as Text) ?? null;

      pErrorBackend = formErrorMessageAlertMessage.textContent;
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should display a textbox with the message error', () => {
      expect(pErrorBackend).toBe(backendErrorFixture);
    });
  });

  describe('when called, and user exists and navigate to the next page', () => {
    beforeAll(() => {
      tokenFixture = 'jwt token fixture';

      (useNavigate as jest.Mock<typeof useNavigate>).mockReturnValueOnce(
        navigateMock,
      );

      (useLoginForm as jest.Mock<typeof useLoginForm>).mockReturnValueOnce({
        backendError: null,
        formFields: formFieldsFixture,
        formStatus: LoginStatus.backendOK,
        formValidation: {},
        notifyFormFieldsFilled: notifyFormFieldsFilledMock,
        setFormField: setFormFieldMock,
      });

      (
        useShowPassword as jest.Mock<typeof useShowPassword>
      ).mockReturnValueOnce({
        showPassword: false,
        handleClickShowPassword: handleClickShowPasswordMock,
        handleMouseDownPassword: handleMouseDownPasswordMock,
      });

      (
        useAppSelector as unknown as jest.Mock<typeof useAppSelector>
      ).mockReturnValueOnce(tokenFixture);

      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should navigate to the next page', () => {
      expect(navigateMock).toHaveBeenCalledWith('/', { replace: true });
    });

    it('should save token in Local Storage', () => {
      const tokenStorage: string | null = window.localStorage.getItem('token');

      expect(tokenStorage).toBe(tokenFixture);
    });
  });
});
