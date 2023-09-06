import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { Register } from './Register';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  STATUS_REG_BACKEND_KO,
  STATUS_REG_BACKEND_OK,
  STATUS_REG_INITIAL,
  STATUS_REG_VALIDATION_KO,
  useRegisterForm,
} from '../hooks';
import { useShowPassword } from '../../common/hooks';

jest.mock('../hooks');
jest.mock('../../common/hooks');

describe(Register.name, () => {
  let formFieldsFixture;

  let notifyFormFieldsFilledMock;
  let setFormFieldMock;

  let handleClickShowPasswordMock;
  let handleMouseDownPasswordMock;

  beforeAll(() => {
    formFieldsFixture = {
      name: 'Mariote',
      email: 'mario@google.com',
      password: 'password',
      confirmPassword: 'confirm-password',
    };

    notifyFormFieldsFilledMock = jest.fn();
    setFormFieldMock = jest.fn();

    handleClickShowPasswordMock = jest.fn();
    handleMouseDownPasswordMock = jest.fn();
  });

  // describe('when called, take a snapshot', () => {
  //   let containerForSnapshot;

  //   beforeAll(() => {
  //     const backendErrorFixture = 'backend Error';
  //     useRegisterForm.mockReturnValue({
  //       backendError: backendErrorFixture,
  //       formFields: formFieldsFixture,
  //       formStatus: STATUS_REG_BACKEND_KO,
  //       formValidation: {},
  //       notifyFormFieldsFilled: notifyFormFieldsFilledMock,
  //       setFormField: setFormFieldMock,
  //     });

  //     useShowPassword.mockReturnValue({
  //       showPassword: false,
  //       handleClickShowPassword: handleClickShowPasswordMock,
  //       handleMouseDownPassword: handleMouseDownPasswordMock,
  //     });

  //     const { container } = render(
  //       <MemoryRouter>
  //         <Register />
  //       </MemoryRouter>,
  //     );

  //     containerForSnapshot = container;
  //   });

  //   afterAll(() => {
  //     jest.clearAllMocks();
  //     jest.resetAllMocks();
  //   });

  //   it('should initialize alias', () => {
  //     expect(containerForSnapshot).toMatchSnapshot();
  //   });
  // });

  describe('when called, on an initial state', () => {
    let inputAlias;
    let inputEmail;
    let inputPassword;
    let inputConfirmPassword;

    beforeAll(() => {
      useRegisterForm.mockReturnValue({
        backendError: null,
        formFields: formFieldsFixture,
        formStatus: STATUS_REG_INITIAL,
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
          <Register />
        </MemoryRouter>,
      );

      const formAliasTextField = screen.getByLabelText('form-register-alias');
      const formAliasTextFieldInput = formAliasTextField.querySelector('input');

      inputAlias = formAliasTextFieldInput.value;

      const formEmailTextField = screen.getByLabelText('form-register-email');
      const formEmailTextFieldInput = formEmailTextField.querySelector('input');

      inputEmail = formEmailTextFieldInput.value;

      const formPasswordTextField = screen.getByLabelText(
        'form-register-password',
      );
      const formPasswordTextFieldInput =
        formPasswordTextField.querySelector('input');

      inputPassword = formPasswordTextFieldInput.value;

      const formConfirmPasswordTextField = screen.getByLabelText(
        'form-register-confirm-password',
      );
      const formConfirmPasswordTextFieldInput =
        formConfirmPasswordTextField.querySelector('input');

      inputConfirmPassword = formConfirmPasswordTextFieldInput.value;
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should initialize name', () => {
      expect(inputAlias).toBe(formFieldsFixture.name);
    });

    it('should initialize email', () => {
      expect(inputEmail).toBe(formFieldsFixture.email);
    });

    it('should initialize password', () => {
      expect(inputPassword).toBe(formFieldsFixture.password);
    });

    it('should initialize confirm password', () => {
      expect(inputConfirmPassword).toBe(formFieldsFixture.confirmPassword);
    });
  });

  describe('when called, and input value are invalid and an error is displayed', () => {
    let pErrorName, pErrorEmail, pErrorPassword, pErrorConfirmPassword;
    const nameFixtureError = 'name Error';
    const emailFixtureError = 'email Error';
    const passwordFixtureError = 'password Error';
    const confirmPasswordFixtureError = 'confirmPassword Error';

    beforeAll(() => {
      useRegisterForm.mockReturnValue({
        backendError: null,
        formFields: {},
        formStatus: STATUS_REG_VALIDATION_KO,
        formValidation: {
          name: nameFixtureError,
          email: emailFixtureError,
          password: passwordFixtureError,
          confirmPassword: confirmPasswordFixtureError,
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
          <Register />
        </MemoryRouter>,
      );

      const formNameTextField = screen.getByLabelText('form-register-alias');
      const formNameTextFieldP = formNameTextField.querySelector('p');

      pErrorName = formNameTextFieldP.innerHTML;

      const formEmailTextField = screen.getByLabelText('form-register-email');
      const formEmailTextFieldP = formEmailTextField.querySelector('p');

      pErrorEmail = formEmailTextFieldP.innerHTML;

      const formPasswordTextField = screen.getByLabelText(
        'form-register-password',
      );
      const formPasswordTextFieldP = formPasswordTextField.querySelector('p');

      pErrorPassword = formPasswordTextFieldP.innerHTML;

      const formConfirmPasswordTextField = screen.getByLabelText(
        'form-register-confirm-password',
      );
      const formConfirmPasswordTextFieldP =
        formConfirmPasswordTextField.querySelector('p');

      pErrorConfirmPassword = formConfirmPasswordTextFieldP.innerHTML;
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should name has an error', () => {
      expect(pErrorName).toBe(nameFixtureError);
    });

    it('should email has an error', () => {
      expect(pErrorEmail).toBe(emailFixtureError);
    });

    it('should password has an error', () => {
      expect(pErrorPassword).toBe(passwordFixtureError);
    });

    it('should confirm password has an error', () => {
      expect(pErrorConfirmPassword).toBe(confirmPasswordFixtureError);
    });
  });

  describe('when called, and exist a backend error and error is displayed', () => {
    let pErrorBackend;
    const backendErrorFixture = 'backend error';

    beforeAll(() => {
      useRegisterForm.mockReturnValue({
        backendError: backendErrorFixture,
        formFields: formFieldsFixture,
        formStatus: STATUS_REG_BACKEND_KO,
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
          <Register />
        </MemoryRouter>,
      );

      const formErrorMessageAlert = screen.getByLabelText(
        'form-register-error',
      );
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

  describe('when called, and create user is ok and the message is displayed', () => {
    let userCreateOK;
    const messageConfirmation =
      'User created! We sent an email, please, complete the steps.';

    beforeAll(() => {
      useRegisterForm.mockReturnValue({
        backendError: null,
        formFields: formFieldsFixture,
        formStatus: STATUS_REG_BACKEND_OK,
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
          <Register />
        </MemoryRouter>,
      );

      const formMessageAlert = screen.getByLabelText('form-register-ok');
      const formMessageAlertMessage =
        formMessageAlert.querySelector('.MuiAlert-message');

      userCreateOK = formMessageAlertMessage.childNodes[1].data;
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should display a textbox with the confirmation message', () => {
      expect(userCreateOK).toBe(messageConfirmation);
    });
  });
});
