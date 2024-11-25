import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('react-router');

jest.mock('../../app/store/hooks');
jest.mock('../../common/hooks/useRedirectAuthorized');
jest.mock('../helpers/validateEmail');
jest.mock('../helpers/validatePassword');
jest.mock('../../common/http/services/cornieApi');
jest.mock('../../common/helpers/isSerializableAppError');
jest.mock('../../common/helpers/mapUseQueryHookResultV2');
jest.mock('../helpers/getCreateAuthErrorMessage');
jest.mock('../../app/store/actions/login');

import { models as apiModels } from '@cornie-js/api-models';
import { SerializableAppError } from '@cornie-js/frontend-api-rtk-query';
import { AppErrorKind } from '@cornie-js/frontend-common';
import { PayloadAction } from '@reduxjs/toolkit';
import { QueryStatus } from '@reduxjs/toolkit/query';
import { act, renderHook, RenderHookResult } from '@testing-library/react';
import { Location as ReactRouterLocation, useLocation } from 'react-router';

import login from '../../app/store/actions/login';
import { useAppDispatch } from '../../app/store/hooks';
import { isSerializableAppError } from '../../common/helpers/isSerializableAppError';
import { mapUseQueryHookResultV2 } from '../../common/helpers/mapUseQueryHookResultV2';
import { cornieApi } from '../../common/http/services/cornieApi';
import { Left, Right } from '../../common/models/Either';
import { HTTP_UNAUTHORIZED_AUTH_ERROR_MESSAGE } from '../helpers/createAuthErrorMessages';
import { getCreateAuthErrorMessage } from '../helpers/getCreateAuthErrorMessage';
import { validateEmail } from '../helpers/validateEmail';
import { validatePassword } from '../helpers/validatePassword';
import { FormFieldsLogin } from '../models/FormFieldsLogin';
import { FormValidationResult } from '../models/FormValidationResult';
import { LoginStatus } from '../models/LoginStatus';
import {
  UseLoginFormParams,
  UseLoginFormResult,
} from '../models/UseLoginFormResult';
import { useLoginForm } from './useLoginForm';

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

  describe('when called', () => {
    let reactRouterLocationFixture: ReactRouterLocation;
    let useCreateAuthV2MutationResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useCreateAuthV2Mutation>
    >;

    let result: RenderHookResult<UseLoginFormResult, unknown>;
    let formFields: FormFieldsLogin;
    let formStatus: LoginStatus;

    beforeAll(() => {
      reactRouterLocationFixture = {
        pathname: '/path-fixture',
        search: '?search=fixture',
      } as Partial<ReactRouterLocation> as ReactRouterLocation;

      useCreateAuthV2MutationResultMock = [
        jest.fn(),
        {
          reset: jest.fn(),
          status: QueryStatus.uninitialized,
        },
      ];

      (useLocation as jest.Mock<typeof useLocation>).mockReturnValueOnce(
        reactRouterLocationFixture,
      );

      (
        mapUseQueryHookResultV2 as jest.Mock<typeof mapUseQueryHookResultV2>
      ).mockReturnValueOnce(null);

      (
        cornieApi.useCreateAuthV2Mutation as jest.Mock<
          typeof cornieApi.useCreateAuthV2Mutation
        >
      ).mockReturnValueOnce(useCreateAuthV2MutationResultMock);

      result = renderHook(() => useLoginForm(initialForm));

      formFields = result.result.current.formFields;
      formStatus = result.result.current.formStatus;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call useLocation()', () => {
      expect(useLocation).toHaveBeenCalledTimes(1);
      expect(useLocation).toHaveBeenCalledWith();
    });

    it('should return cornieApi.useCreateAuthV2Mutation()', () => {
      expect(cornieApi.useCreateAuthV2Mutation).toHaveBeenCalledTimes(1);
      expect(cornieApi.useCreateAuthV2Mutation).toHaveBeenCalledWith();
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

  describe('when called, and validateEmail() returns Left', () => {
    let reactRouterLocationFixture: ReactRouterLocation;
    let useCreateAuthV2MutationResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useCreateAuthV2Mutation>
    >;
    let result: RenderHookResult<UseLoginFormResult, unknown>;
    let formValidation: FormValidationResult;

    beforeAll(() => {
      reactRouterLocationFixture = {
        pathname: '/path-fixture',
        search: '?search=fixture',
      } as Partial<ReactRouterLocation> as ReactRouterLocation;

      (useLocation as jest.Mock<typeof useLocation>)
        .mockReturnValueOnce(reactRouterLocationFixture)
        .mockReturnValueOnce(reactRouterLocationFixture)
        .mockReturnValueOnce(reactRouterLocationFixture);

      useCreateAuthV2MutationResultMock = [
        jest.fn(),
        {
          reset: jest.fn(),
          status: QueryStatus.uninitialized,
        },
      ];

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

      (
        mapUseQueryHookResultV2 as jest.Mock<typeof mapUseQueryHookResultV2>
      ).mockReturnValueOnce(null);

      (
        cornieApi.useCreateAuthV2Mutation as jest.Mock<
          typeof cornieApi.useCreateAuthV2Mutation
        >
      )
        .mockReturnValueOnce(useCreateAuthV2MutationResultMock)
        .mockReturnValueOnce(useCreateAuthV2MutationResultMock)
        .mockReturnValueOnce(useCreateAuthV2MutationResultMock);

      result = renderHook(() => useLoginForm(initialForm));

      const notifyFormFieldsFilled: () => void =
        result.result.current.notifyFormFieldsFilled;

      act(() => {
        notifyFormFieldsFilled();
      });

      formValidation = result.result.current.formValidation;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call useLocation()', () => {
      expect(useLocation).toHaveBeenCalledTimes(3);
      expect(useLocation).toHaveBeenCalledWith();
    });

    it('should return cornieApi.useCreateAuthV2Mutation()', () => {
      expect(cornieApi.useCreateAuthV2Mutation).toHaveBeenCalledTimes(3);
      expect(cornieApi.useCreateAuthV2Mutation).toHaveBeenCalledWith();
    });

    it('should call validateEmail()', () => {
      expect(validateEmail).toHaveBeenCalledTimes(1);
      expect(validateEmail).toHaveBeenCalledWith(initialForm.email);
    });

    it('should return error object', () => {
      const expected: FormValidationResult = { email: emailErrorFixture };
      expect(formValidation).toStrictEqual(expected);
    });
  });

  describe('when called, and validatePassword() returns Left', () => {
    let reactRouterLocationFixture: ReactRouterLocation;
    let useCreateAuthV2MutationResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useCreateAuthV2Mutation>
    >;

    let result: RenderHookResult<UseLoginFormResult, unknown>;
    let formValidation: FormValidationResult;

    beforeAll(() => {
      reactRouterLocationFixture = {
        pathname: '/path-fixture',
        search: '?search=fixture',
      } as Partial<ReactRouterLocation> as ReactRouterLocation;

      (useLocation as jest.Mock<typeof useLocation>)
        .mockReturnValueOnce(reactRouterLocationFixture)
        .mockReturnValueOnce(reactRouterLocationFixture)
        .mockReturnValueOnce(reactRouterLocationFixture);

      useCreateAuthV2MutationResultMock = [
        jest.fn(),
        {
          reset: jest.fn(),
          status: QueryStatus.uninitialized,
        },
      ];

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

      (
        mapUseQueryHookResultV2 as jest.Mock<typeof mapUseQueryHookResultV2>
      ).mockReturnValueOnce(null);

      (
        cornieApi.useCreateAuthV2Mutation as jest.Mock<
          typeof cornieApi.useCreateAuthV2Mutation
        >
      )
        .mockReturnValueOnce(useCreateAuthV2MutationResultMock)
        .mockReturnValueOnce(useCreateAuthV2MutationResultMock)
        .mockReturnValueOnce(useCreateAuthV2MutationResultMock);

      result = renderHook(() => useLoginForm(initialForm));

      const notifyFormFieldsFilled: () => void =
        result.result.current.notifyFormFieldsFilled;

      act(() => {
        notifyFormFieldsFilled();
      });

      formValidation = result.result.current.formValidation;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call useLocation()', () => {
      expect(useLocation).toHaveBeenCalledTimes(3);
      expect(useLocation).toHaveBeenCalledWith();
    });

    it('should return cornieApi.useCreateAuthV2Mutation()', () => {
      expect(cornieApi.useCreateAuthV2Mutation).toHaveBeenCalledTimes(3);
      expect(cornieApi.useCreateAuthV2Mutation).toHaveBeenCalledWith();
    });

    it('should call validateFormPassword()', () => {
      expect(validatePassword).toHaveBeenCalledTimes(1);
      expect(validatePassword).toHaveBeenCalledWith(initialForm.password);
    });

    it('should return error object', () => {
      const expected: FormValidationResult = { password: passwordErrorFixture };
      expect(formValidation).toStrictEqual(expected);
    });
  });

  describe('when called, and cornieApi.useCreateAuthV2Mutation() returns Left auth error', () => {
    let reactRouterLocationFixture: ReactRouterLocation;
    let useCreateAuthV2MutationResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useCreateAuthV2Mutation>
    >;

    let formStatus: LoginStatus;
    let createAuthResultFixture: Left<SerializableAppError>;
    let errorMessageFixture: string;
    let result: RenderHookResult<UseLoginFormResult, unknown>;

    beforeAll(async () => {
      reactRouterLocationFixture = {
        pathname: '/path-fixture',
        search: '?search=fixture',
      } as Partial<ReactRouterLocation> as ReactRouterLocation;

      (useLocation as jest.Mock<typeof useLocation>)
        .mockReturnValueOnce(reactRouterLocationFixture)
        .mockReturnValueOnce(reactRouterLocationFixture);

      useCreateAuthV2MutationResultMock = [
        jest.fn(),
        {
          reset: jest.fn(),
          status: QueryStatus.uninitialized,
        },
      ];

      createAuthResultFixture = {
        isRight: false,
        value: {
          kind: AppErrorKind.missingCredentials,
          message: 'message-fixture',
        },
      };

      errorMessageFixture = HTTP_UNAUTHORIZED_AUTH_ERROR_MESSAGE;

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

      (
        cornieApi.useCreateAuthV2Mutation as jest.Mock<
          typeof cornieApi.useCreateAuthV2Mutation
        >
      )
        .mockReturnValueOnce(useCreateAuthV2MutationResultMock)
        .mockReturnValueOnce(useCreateAuthV2MutationResultMock);

      (
        mapUseQueryHookResultV2 as jest.Mock<typeof mapUseQueryHookResultV2>
      ).mockReturnValueOnce(createAuthResultFixture);

      (
        isSerializableAppError as unknown as jest.Mock<
          typeof isSerializableAppError
        >
      ).mockReturnValueOnce(true);

      (
        getCreateAuthErrorMessage as jest.Mock<typeof getCreateAuthErrorMessage>
      ).mockReturnValueOnce(errorMessageFixture);

      result = renderHook(() => useLoginForm(initialForm));

      formStatus = result.result.current.formStatus;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call useLocation()', () => {
      expect(useLocation).toHaveBeenCalledTimes(2);
      expect(useLocation).toHaveBeenCalledWith();
    });

    it('should call mapUseQueryHookResultV2()', () => {
      expect(mapUseQueryHookResultV2).toHaveBeenCalledTimes(2);
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        1,
        useCreateAuthV2MutationResultMock[1],
      );
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        2,
        useCreateAuthV2MutationResultMock[1],
      );
    });

    it('should call isSerializableAppError()', () => {
      expect(isSerializableAppError).toHaveBeenCalledTimes(1);
      expect(isSerializableAppError).toHaveBeenNthCalledWith(
        1,
        createAuthResultFixture.value,
      );
    });

    it('should call getCreateAuthErrorMessage()', () => {
      expect(getCreateAuthErrorMessage).toHaveBeenCalledTimes(1);
      expect(getCreateAuthErrorMessage).toHaveBeenNthCalledWith(
        1,
        createAuthResultFixture.value.kind,
      );
    });

    it('should return an status backend KO', () => {
      expect(formStatus).toBe(LoginStatus.backendKO);
    });
  });

  describe('when called, and cornieApi.useCreateAuthV2Mutation() returns Right and dispatch() is executed', () => {
    let reactRouterLocationFixture: ReactRouterLocation;
    let useCreateAuthV2MutationResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useCreateAuthV2Mutation>
    >;

    let formStatus: LoginStatus;
    let createAuthResultFixture: Right<apiModels.AuthV2>;
    let result: RenderHookResult<UseLoginFormResult, unknown>;

    let loginResult: ReturnType<typeof login>;

    beforeAll(async () => {
      reactRouterLocationFixture = {
        pathname: '/path-fixture',
        search: '?search=fixture',
      } as Partial<ReactRouterLocation> as ReactRouterLocation;

      (useLocation as jest.Mock<typeof useLocation>)
        .mockReturnValueOnce(reactRouterLocationFixture)
        .mockReturnValueOnce(reactRouterLocationFixture);

      useCreateAuthV2MutationResultMock = [
        jest.fn(),
        {
          reset: jest.fn(),
          status: QueryStatus.uninitialized,
        },
      ];

      createAuthResultFixture = {
        isRight: true,
        value: {
          accessToken: 'accessToken-fixture',
          refreshToken: 'refreshToken-fixture',
        },
      };

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

      (
        cornieApi.useCreateAuthV2Mutation as jest.Mock<
          typeof cornieApi.useCreateAuthV2Mutation
        >
      )
        .mockReturnValueOnce(useCreateAuthV2MutationResultMock)
        .mockReturnValueOnce(useCreateAuthV2MutationResultMock);

      (
        mapUseQueryHookResultV2 as jest.Mock<typeof mapUseQueryHookResultV2>
      ).mockReturnValueOnce(createAuthResultFixture);

      loginResult = {
        payload: {
          accessToken: 'accessToken-fixture',
          refreshToken: 'refreshToken-fixture',
        },
        type: 'login',
      } as unknown as ReturnType<typeof login>;

      const payloadActionFixture: PayloadAction<apiModels.AuthV2> = {
        payload: {
          accessToken: 'accessToken-fixture',
          refreshToken: 'refreshToken-fixture',
        },
        type: 'login-fixture',
      };

      (login as unknown as jest.Mock<typeof login>).mockReturnValueOnce(
        loginResult,
      );

      dispatchMock = jest
        .fn<ReturnType<typeof useAppDispatch>>()
        .mockImplementationOnce(
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
          <TReturn, TAction>(): TAction | TReturn =>
            payloadActionFixture as TReturn,
        ) as ReturnType<typeof useAppDispatch> &
        jest.Mock<ReturnType<typeof useAppDispatch>>;

      (
        useAppDispatch as unknown as jest.Mock<typeof useAppDispatch>
      ).mockReturnValue(dispatchMock);

      result = renderHook(() => useLoginForm(initialForm));

      formStatus = result.result.current.formStatus;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call useLocation()', () => {
      expect(useLocation).toHaveBeenCalledTimes(2);
      expect(useLocation).toHaveBeenCalledWith();
    });

    it('should call mapUseQueryHookResultV2()', () => {
      expect(mapUseQueryHookResultV2).toHaveBeenCalledTimes(2);
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        1,
        useCreateAuthV2MutationResultMock[1],
      );
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        2,
        useCreateAuthV2MutationResultMock[1],
      );
    });

    it('should called useAppDispatch()', () => {
      expect(dispatchMock).toHaveBeenCalled();
      expect(dispatchMock).toHaveBeenCalledWith(loginResult);
    });

    it('should return an status backend OK', () => {
      expect(formStatus).toBe(LoginStatus.backendOK);
    });
  });
});
