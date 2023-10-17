import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { Login } from './Login';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  STATUS_LOG_BACKEND_KO,
  STATUS_LOG_BACKEND_OK,
  STATUS_LOG_INITIAL,
  STATUS_LOG_VALIDATION_KO,
  useLoginForm,
} from '../hooks';
import { useShowPassword } from '../../common/hooks';

jest.mock('../hooks');
jest.mock('../../common/hooks');

describe(Login.name, () => {
  let formFieldsFixture;

  let notifyFormFieldsFilledMock;
  let setFormFieldMock;

  let handleClickShowPasswordMock;
  let handleMouseDownPasswordMock;

  let navigateMock;

  beforeAll(() => {
    formFieldsFixture = {
      email: 'mario@google.com',
      password: 'password',
    };

    notifyFormFieldsFilledMock = jest.fn();
    setFormFieldMock = jest.fn();

    handleClickShowPasswordMock = jest.fn();
    handleMouseDownPasswordMock = jest.fn();

    navigateMock = jest.fn();
  });

  describe('when called, on an initial state', () => {
    let inputEmail;
    let inputPassword;

    beforeAll(() => {
      useLoginForm.mockReturnValue({
        backendError: null,
        formFields: formFieldsFixture,
        formStatus: STATUS_LOG_INITIAL,
        formValidation: {},
        notifyFormFieldsFilled: notifyFormFieldsFilledMock,
        setFormField: setFormFieldMock,
      });

      useShowPassword.mockReturnValue({
        showPassword: false,
        handleClickShowPassword: handleClickShowPasswordMock,
        handleMouseDownPassword: handleMouseDownPasswordMock,
      });

      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>,
      );

      const formEmailTextField = screen.getByLabelText('form-login-email');
      const formEmailTextFieldInput = formEmailTextField.querySelector('input');

      inputEmail = formEmailTextFieldInput.value;

      const formPasswordTextField = screen.getByLabelText(
        'form-login-password',
      );
      const formPasswordTextFieldInput =
        formPasswordTextField.querySelector('input');

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
    let pErrorEmail, pErrorPassword;
    const emailFixtureError = 'email Error';
    const passwordFixtureError = 'password Error';

    beforeAll(() => {
      useLoginForm.mockReturnValue({
        backendError: null,
        formFields: {},
        formStatus: STATUS_LOG_VALIDATION_KO,
        formValidation: {
          email: emailFixtureError,
          password: passwordFixtureError,
        },
        notifyFormFieldsFilled: notifyFormFieldsFilledMock,
        setFormField: setFormFieldMock,
      });

      useShowPassword.mockReturnValue({
        showPassword: false,
        handleClickShowPassword: handleClickShowPasswordMock,
        handleMouseDownPassword: handleMouseDownPasswordMock,
      });

      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>,
      );

      const formEmailTextField = screen.getByLabelText('form-login-email');
      const formEmailTextFieldP = formEmailTextField.querySelector('p');

      pErrorEmail = formEmailTextFieldP.innerHTML;

      const formPasswordTextField = screen.getByLabelText(
        'form-login-password',
      );
      const formPasswordTextFieldP = formPasswordTextField.querySelector('p');

      pErrorPassword = formPasswordTextFieldP.innerHTML;
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
    let pErrorBackend;
    const backendErrorFixture = 'backend error';

    beforeAll(() => {
      useLoginForm.mockReturnValue({
        backendError: backendErrorFixture,
        formFields: formFieldsFixture,
        formStatus: STATUS_LOG_BACKEND_KO,
        formValidation: {},
        notifyFormFieldsFilled: notifyFormFieldsFilledMock,
        setFormField: setFormFieldMock,
      });

      useShowPassword.mockReturnValue({
        showPassword: false,
        handleClickShowPassword: handleClickShowPasswordMock,
        handleMouseDownPassword: handleMouseDownPasswordMock,
      });

      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>,
      );

      const formErrorMessageAlert = screen.getByLabelText('form-login-error');
      const formErrorMessageAlertMessage =
        formErrorMessageAlert.querySelector('.MuiAlert-message');

      pErrorBackend = formErrorMessageAlertMessage.childNodes[1].data;
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
