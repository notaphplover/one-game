import { afterAll, beforeAll, describe, expect, jest, it } from '@jest/globals';

jest.mock('../hooks/useRegisterForm');
jest.mock('../../app/store/hooks');
jest.mock('../../common/hooks/useShowPassword');

import { RenderResult, fireEvent, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { AuthenticatedAuthState } from '../../app/store/helpers/models/AuthState';
import { useAppSelector } from '../../app/store/hooks';
import { useShowPassword } from '../../common/hooks/useShowPassword';
import { useRegisterForm } from '../hooks/useRegisterForm';
import { FormValidationResult } from '../models/FormValidationResult';
import { RegisterStatus } from '../models/RegisterStatus';
import { UseRegisterFormParams } from '../models/UseRegisterFormResult';
import { Register } from './Register';

describe(Register.name, () => {
  let formFieldsFixture: UseRegisterFormParams;
  let authFixture: AuthenticatedAuthState | null;

  let notifyFormFieldsFilledMock: jest.Mock<() => void>;
  let setFormFieldMock: jest.Mock<
    (event: React.ChangeEvent<HTMLInputElement>) => void
  >;

  let handleClickShowPasswordMock: jest.Mock<() => void>;
  let handleMouseDownPasswordMock: jest.Mock<
    (event: React.MouseEvent<HTMLElement>) => void
  >;

  let formValidationResult: FormValidationResult;

  beforeAll(() => {
    formFieldsFixture = {
      confirmPassword: 'confirm-password-fixture',
      email: 'name@fixture.com',
      name: 'name fixture',
      password: 'password-fixture',
    };

    authFixture = null;

    notifyFormFieldsFilledMock = jest.fn();
    setFormFieldMock = jest.fn();

    handleClickShowPasswordMock = jest.fn();
    handleMouseDownPasswordMock = jest.fn();

    formValidationResult = {
      confirmPassword: 'confirmPassword Error',
      email: 'email Error',
      name: 'name Error',
      password: 'password Error',
    };
  });

  describe('when called, on an initial state', () => {
    let inputAlias: string;
    let inputEmail: string;
    let inputPassword: string;
    let inputConfirmPassword: string;

    beforeAll(() => {
      (
        useRegisterForm as jest.Mock<typeof useRegisterForm>
      ).mockReturnValueOnce({
        backendError: null,
        formFields: formFieldsFixture,
        formStatus: RegisterStatus.initial,
        formValidation: {},
        notifyFormFieldsFilled: notifyFormFieldsFilledMock,
        setFormField: setFormFieldMock,
      });

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

      const formAliasTextFieldInput: HTMLInputElement | null =
        (renderResult.container.querySelector('.form-register-alias')
          ?.childNodes[1]?.firstChild as HTMLInputElement) ?? null;

      inputAlias = formAliasTextFieldInput.value;

      const formEmailTextFieldInput: HTMLInputElement | null =
        (renderResult.container.querySelector('.form-register-email')
          ?.childNodes[1]?.firstChild as HTMLInputElement) ?? null;

      inputEmail = formEmailTextFieldInput.value;

      const formPasswordTextFieldInput: HTMLInputElement | null =
        (renderResult.container.querySelector('.form-register-password')
          ?.childNodes[1]?.firstChild as HTMLInputElement) ?? null;

      inputPassword = formPasswordTextFieldInput.value;

      const formConfirmPasswordTextFieldInput: HTMLInputElement | null =
        (renderResult.container.querySelector('.form-register-confirm-password')
          ?.childNodes[1]?.firstChild as HTMLInputElement) ?? null;

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
    let pErrorName: string | null, pErrorEmail: string | null;
    let pErrorPassword: string | null, pErrorConfirmPassword: string | null;

    beforeAll(() => {
      (
        useRegisterForm as jest.Mock<typeof useRegisterForm>
      ).mockReturnValueOnce({
        backendError: null,
        formFields: {
          confirmPassword: '',
          email: '',
          name: '',
          password: '',
        },
        formStatus: RegisterStatus.validationKO,
        formValidation: formValidationResult,
        notifyFormFieldsFilled: notifyFormFieldsFilledMock,
        setFormField: setFormFieldMock,
      });

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

      const formAliasTextFieldParagraph: Text | null =
        (renderResult.container.querySelector('.form-register-alias')
          ?.childNodes[2]?.firstChild as Text) ?? null;

      pErrorName = formAliasTextFieldParagraph?.textContent;

      const formEmailTextFieldParagraph: Text | null =
        (renderResult.container.querySelector('.form-register-email')
          ?.childNodes[2]?.firstChild as Text) ?? null;

      pErrorEmail = formEmailTextFieldParagraph?.textContent;

      const formPasswordTextFieldParagraph: Text | null =
        (renderResult.container.querySelector('.form-register-password')
          ?.childNodes[2]?.firstChild as Text) ?? null;

      pErrorPassword = formPasswordTextFieldParagraph?.textContent;

      const formConfirmPasswordTextFieldParagraph: Text | null =
        (renderResult.container.querySelector('.form-register-confirm-password')
          ?.childNodes[2]?.firstChild as Text) ?? null;

      pErrorConfirmPassword =
        formConfirmPasswordTextFieldParagraph?.textContent;
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should name has an error', () => {
      expect(pErrorName).toBe(formValidationResult.name);
    });

    it('should email has an error', () => {
      expect(pErrorEmail).toBe(formValidationResult.email);
    });

    it('should password has an error', () => {
      expect(pErrorPassword).toBe(formValidationResult.password);
    });

    it('should confirm password has an error', () => {
      expect(pErrorConfirmPassword).toBe(formValidationResult.confirmPassword);
    });
  });

  describe('when called, and exist a backend error and error is displayed', () => {
    let pErrorBackend: string | null;
    const backendErrorFixture: string = 'backend error';

    beforeAll(() => {
      (
        useRegisterForm as jest.Mock<typeof useRegisterForm>
      ).mockReturnValueOnce({
        backendError: backendErrorFixture,
        formFields: formFieldsFixture,
        formStatus: RegisterStatus.backendKO,
        formValidation: {},
        notifyFormFieldsFilled: notifyFormFieldsFilledMock,
        setFormField: setFormFieldMock,
      });

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

  describe('when called, and create user is ok and the message is displayed', () => {
    let userCreateOk: string | null;
    const messageConfirmation: string =
      'User created! We sent an email, please, complete the steps.';

    beforeAll(() => {
      (
        useRegisterForm as jest.Mock<typeof useRegisterForm>
      ).mockReturnValueOnce({
        backendError: null,
        formFields: formFieldsFixture,
        formStatus: RegisterStatus.backendOK,
        formValidation: {},
        notifyFormFieldsFilled: notifyFormFieldsFilledMock,
        setFormField: setFormFieldMock,
      });

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

      const formMessageAlertMessage: Text | null =
        (renderResult.container.querySelector('.form-register-success')
          ?.childNodes[0]?.childNodes[1]?.lastChild as Text) ?? null;

      userCreateOk = formMessageAlertMessage.textContent;
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should display a textbox with the confirmation message', () => {
      expect(userCreateOk).toBe(messageConfirmation);
    });
  });

  describe('when called, and the Create button is pressed', () => {
    beforeAll(() => {
      (
        useRegisterForm as jest.Mock<typeof useRegisterForm>
      ).mockReturnValueOnce({
        backendError: null,
        formFields: formFieldsFixture,
        formStatus: RegisterStatus.initial,
        formValidation: {},
        notifyFormFieldsFilled: notifyFormFieldsFilledMock,
        setFormField: setFormFieldMock,
      });

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

      const buttonCreate: Element = renderResult.container.querySelector(
        '.register-button',
      ) as Element;

      fireEvent.click(buttonCreate);
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should call to notifyFormFieldsFilled', () => {
      expect(notifyFormFieldsFilledMock).toHaveBeenCalledTimes(1);
      expect(notifyFormFieldsFilledMock).toHaveBeenCalledWith();
    });
  });
});
