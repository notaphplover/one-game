import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../common/helpers/mapUseQueryHookResultV2');
jest.mock('../../common/http/services/cornieApi');
jest.mock('../helpers/getCreateAuthErrorMessage');
jest.mock('../helpers/getUpdateUserMeErrorMessage');
jest.mock('../../common/helpers/isSerializableAppError');
jest.mock('../../common/hooks/useUrlLikeLocation');
jest.mock('../../app/store/hooks');
jest.mock('../../app/store/actions/login');

import { models as apiModels } from '@cornie-js/api-models';
import { SerializableAppError } from '@cornie-js/frontend-api-rtk-query';
import { AppErrorKind } from '@cornie-js/frontend-common';
import { SerializedError } from '@reduxjs/toolkit';
import { QueryStatus } from '@reduxjs/toolkit/query';
import { renderHook, RenderHookResult } from '@testing-library/react';
import React from 'react';

import login from '../../app/store/actions/login';
import { useAppDispatch } from '../../app/store/hooks';
import { isSerializableAppError } from '../../common/helpers/isSerializableAppError';
import { mapUseQueryHookResultV2 } from '../../common/helpers/mapUseQueryHookResultV2';
import { useUrlLikeLocation } from '../../common/hooks/useUrlLikeLocation';
import { cornieApi } from '../../common/http/services/cornieApi';
import { Left, Right } from '../../common/models/Either';
import { UrlLikeLocation } from '../../common/models/UrlLikeLocation';
import {
  HTTP_UNAUTHORIZED_AUTH_ERROR_MESSAGE,
  UNEXPECTED_AUTH_ERROR_MESSAGE,
} from '../helpers/createAuthErrorMessages';
import { getCreateAuthErrorMessage } from '../helpers/getCreateAuthErrorMessage';
import { getUpdateUserMeErrorMessage } from '../helpers/getUpdateUserMeErrorMessage';
import { HTTP_FORBIDDEN_UPD_USER_ME_ERROR_MESSAGE } from '../helpers/updateUserMeErrorMessage';
import { UseResetPasswordActions } from '../models/UseResetPasswordActions';
import { UseResetPasswordData } from '../models/UseResetPasswordData';
import { UseResetPasswordStatus } from '../models/UseResetPasswordStatus';
import { useResetPassword } from './useResetPassword';

describe(useResetPassword.name, () => {
  let dispatchMock: ReturnType<typeof useAppDispatch> &
    jest.Mock<ReturnType<typeof useAppDispatch>>;
  let useCreateAuthV2MutationResultMock: jest.Mocked<
    ReturnType<typeof cornieApi.useCreateAuthV2Mutation>
  >;
  let useUpdateUserMeV1MutationResultMock: jest.Mocked<
    ReturnType<typeof cornieApi.useUpdateUsersV1MeMutation>
  >;
  let urlLikeLocationFixture: UrlLikeLocation;
  let loginResult: ReturnType<typeof login>;

  beforeAll(() => {
    loginResult = {
      payload: {
        accessToken: 'accessToken-fixture',
        refreshToken: 'refreshToken-fixture',
      },
      type: 'login',
    } as unknown as ReturnType<typeof login>;
  });

  describe('when called, and useUrlLikeLocation returns location without code query', () => {
    let renderResult: RenderHookResult<
      [UseResetPasswordData, UseResetPasswordActions],
      unknown
    >;

    beforeAll(() => {
      urlLikeLocationFixture = {
        pathname: '/path',
        searchParams: new URLSearchParams(),
      } as Partial<UrlLikeLocation> as UrlLikeLocation;

      useCreateAuthV2MutationResultMock = [
        jest.fn(),
        {
          reset: jest.fn(),
          status: QueryStatus.uninitialized,
        },
      ];

      useUpdateUserMeV1MutationResultMock = [
        jest.fn(),
        {
          reset: jest.fn(),
          status: QueryStatus.uninitialized,
        },
      ];

      (
        useUrlLikeLocation as jest.Mock<typeof useUrlLikeLocation>
      ).mockReturnValue(urlLikeLocationFixture);

      (
        mapUseQueryHookResultV2 as jest.Mock<typeof mapUseQueryHookResultV2>
      ).mockReturnValue(null);

      (
        cornieApi.useCreateAuthV2Mutation as jest.Mock<
          typeof cornieApi.useCreateAuthV2Mutation
        >
      ).mockReturnValue(useCreateAuthV2MutationResultMock);

      (
        cornieApi.useUpdateUsersV1MeMutation as jest.Mock<
          typeof cornieApi.useUpdateUsersV1MeMutation
        >
      ).mockReturnValue(useUpdateUserMeV1MutationResultMock);

      renderResult = renderHook(() => useResetPassword());
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should return cornieApi.useCreateAuthV2Mutation()', () => {
      expect(cornieApi.useCreateAuthV2Mutation).toHaveBeenCalledTimes(2);
      expect(cornieApi.useCreateAuthV2Mutation).toHaveBeenCalledWith();
    });

    it('should return cornieApi.useUpdateUsersV1MeMutation()', () => {
      expect(cornieApi.useUpdateUsersV1MeMutation).toHaveBeenCalledTimes(2);
      expect(cornieApi.useUpdateUsersV1MeMutation).toHaveBeenCalledWith();
    });

    it('should call mapUseQueryHookResultV2()', () => {
      expect(mapUseQueryHookResultV2).toHaveBeenCalledTimes(4);
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        1,
        useCreateAuthV2MutationResultMock[1],
      );
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        2,
        useUpdateUserMeV1MutationResultMock[1],
      );
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        3,
        useCreateAuthV2MutationResultMock[1],
      );
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        4,
        useUpdateUserMeV1MutationResultMock[1],
      );
    });

    it('should return expected result', () => {
      const expectedResult: [UseResetPasswordData, UseResetPasswordActions] = [
        {
          form: {
            errorMessage: UNEXPECTED_AUTH_ERROR_MESSAGE,
            fields: {
              confirmPassword: '',
              password: '',
            },
            validation: {},
          },
          status: UseResetPasswordStatus.backendError,
        },
        {
          handlers: {
            onConfirmPasswordChanged: expect.any(Function) as unknown as (
              event: React.ChangeEvent<HTMLInputElement>,
            ) => void,
            onPasswordChanged: expect.any(Function) as unknown as (
              event: React.ChangeEvent<HTMLInputElement>,
            ) => void,
            onSubmit: expect.any(Function) as unknown as (
              event: React.FormEvent,
            ) => void,
          },
        },
      ];

      expect(renderResult.result.current).toStrictEqual(expectedResult);
    });
  });

  describe('when called, and useUrlLikeLocation returns location with code query and cornieApi.useCreateAuthV2Mutation() returns Right', () => {
    let createAuthFixtureResult: Right<apiModels.AuthV2>;
    let renderResult: RenderHookResult<
      [UseResetPasswordData, UseResetPasswordActions],
      unknown
    >;

    beforeAll(() => {
      urlLikeLocationFixture = {
        pathname: '/path',
        searchParams: new URLSearchParams('?code=code'),
      } as Partial<UrlLikeLocation> as UrlLikeLocation;

      useCreateAuthV2MutationResultMock = [
        jest.fn(),
        {
          reset: jest.fn(),
          status: QueryStatus.uninitialized,
        },
      ];

      useUpdateUserMeV1MutationResultMock = [
        jest.fn(),
        {
          reset: jest.fn(),
          status: QueryStatus.uninitialized,
        },
      ];

      createAuthFixtureResult = {
        isRight: true,
        value: {
          accessToken: 'accessToken-fixture',
          refreshToken: 'refreshToken-fixture',
        },
      };

      (
        useUrlLikeLocation as jest.Mock<typeof useUrlLikeLocation>
      ).mockReturnValue(urlLikeLocationFixture);

      (mapUseQueryHookResultV2 as jest.Mock<typeof mapUseQueryHookResultV2>)
        .mockReturnValueOnce(createAuthFixtureResult)
        .mockReturnValueOnce(null);

      (
        cornieApi.useCreateAuthV2Mutation as jest.Mock<
          typeof cornieApi.useCreateAuthV2Mutation
        >
      ).mockReturnValue(useCreateAuthV2MutationResultMock);

      (
        cornieApi.useUpdateUsersV1MeMutation as jest.Mock<
          typeof cornieApi.useUpdateUsersV1MeMutation
        >
      ).mockReturnValue(useUpdateUserMeV1MutationResultMock);

      (login as unknown as jest.Mock<typeof login>).mockReturnValueOnce(
        loginResult,
      );

      dispatchMock = jest
        .fn<ReturnType<typeof useAppDispatch>>()
        .mockImplementationOnce(
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
          <TReturn, TAction>(): TAction | TReturn => loginResult as TReturn,
        ) as ReturnType<typeof useAppDispatch> &
        jest.Mock<ReturnType<typeof useAppDispatch>>;

      (
        useAppDispatch as unknown as jest.Mock<typeof useAppDispatch>
      ).mockReturnValue(dispatchMock);

      renderResult = renderHook(() => useResetPassword());
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should return cornieApi.useCreateAuthV2Mutation()', () => {
      expect(cornieApi.useCreateAuthV2Mutation).toHaveBeenCalledTimes(2);
      expect(cornieApi.useCreateAuthV2Mutation).toHaveBeenCalledWith();
    });

    it('should return cornieApi.useUpdateUsersV1MeMutation()', () => {
      expect(cornieApi.useUpdateUsersV1MeMutation).toHaveBeenCalledTimes(2);
      expect(cornieApi.useUpdateUsersV1MeMutation).toHaveBeenCalledWith();
    });

    it('should call mapUseQueryHookResultV2()', () => {
      expect(mapUseQueryHookResultV2).toHaveBeenCalledTimes(4);
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        1,
        useCreateAuthV2MutationResultMock[1],
      );
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        2,
        useUpdateUserMeV1MutationResultMock[1],
      );
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        3,
        useCreateAuthV2MutationResultMock[1],
      );
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        4,
        useUpdateUserMeV1MutationResultMock[1],
      );
    });

    it('should called useAppDispatch()', () => {
      expect(dispatchMock).toHaveBeenCalled();
      expect(dispatchMock).toHaveBeenCalledWith(loginResult);
    });

    it('should return expected result', () => {
      const expectedResult: [UseResetPasswordData, UseResetPasswordActions] = [
        {
          form: {
            fields: {
              confirmPassword: '',
              password: '',
            },
            validation: {},
          },
          status: UseResetPasswordStatus.pending,
        },
        {
          handlers: {
            onConfirmPasswordChanged: expect.any(Function) as unknown as (
              event: React.ChangeEvent<HTMLInputElement>,
            ) => void,
            onPasswordChanged: expect.any(Function) as unknown as (
              event: React.ChangeEvent<HTMLInputElement>,
            ) => void,
            onSubmit: expect.any(Function) as unknown as (
              event: React.FormEvent,
            ) => void,
          },
        },
      ];

      expect(renderResult.result.current).toStrictEqual(expectedResult);
    });
  });

  describe('when called, and useUrlLikeLocation returns location with code query and cornieApi.useCreateAuthV2Mutation() returns Left', () => {
    let createAuthFixtureResult: Left<SerializableAppError | SerializedError>;
    let renderResult: RenderHookResult<
      [UseResetPasswordData, UseResetPasswordActions],
      unknown
    >;
    let errorMessageFixture: string;

    beforeAll(() => {
      urlLikeLocationFixture = {
        pathname: '/path',
        searchParams: new URLSearchParams('?code=code'),
      } as Partial<UrlLikeLocation> as UrlLikeLocation;

      useCreateAuthV2MutationResultMock = [
        jest.fn(),
        {
          reset: jest.fn(),
          status: QueryStatus.uninitialized,
        },
      ];

      useUpdateUserMeV1MutationResultMock = [
        jest.fn(),
        {
          reset: jest.fn(),
          status: QueryStatus.uninitialized,
        },
      ];

      createAuthFixtureResult = {
        isRight: false,
        value: {
          kind: AppErrorKind.missingCredentials,
          message: 'message-fixture',
        },
      };

      errorMessageFixture = HTTP_UNAUTHORIZED_AUTH_ERROR_MESSAGE;

      (
        useUrlLikeLocation as jest.Mock<typeof useUrlLikeLocation>
      ).mockReturnValue(urlLikeLocationFixture);

      (mapUseQueryHookResultV2 as jest.Mock<typeof mapUseQueryHookResultV2>)
        .mockReturnValueOnce(createAuthFixtureResult)
        .mockReturnValueOnce(null);

      (
        cornieApi.useCreateAuthV2Mutation as jest.Mock<
          typeof cornieApi.useCreateAuthV2Mutation
        >
      ).mockReturnValue(useCreateAuthV2MutationResultMock);

      (
        cornieApi.useUpdateUsersV1MeMutation as jest.Mock<
          typeof cornieApi.useUpdateUsersV1MeMutation
        >
      ).mockReturnValue(useUpdateUserMeV1MutationResultMock);

      (
        isSerializableAppError as unknown as jest.Mock<
          typeof isSerializableAppError
        >
      ).mockReturnValue(true);

      (
        getCreateAuthErrorMessage as jest.Mock<typeof getCreateAuthErrorMessage>
      ).mockReturnValue(errorMessageFixture);

      renderResult = renderHook(() => useResetPassword());
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should return cornieApi.useCreateAuthV2Mutation()', () => {
      expect(cornieApi.useCreateAuthV2Mutation).toHaveBeenCalledTimes(2);
      expect(cornieApi.useCreateAuthV2Mutation).toHaveBeenCalledWith();
    });

    it('should return cornieApi.useUpdateUsersV1MeMutation()', () => {
      expect(cornieApi.useUpdateUsersV1MeMutation).toHaveBeenCalledTimes(2);
      expect(cornieApi.useUpdateUsersV1MeMutation).toHaveBeenCalledWith();
    });

    it('should call mapUseQueryHookResultV2()', () => {
      expect(mapUseQueryHookResultV2).toHaveBeenCalledTimes(4);
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        1,
        useCreateAuthV2MutationResultMock[1],
      );
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        2,
        useUpdateUserMeV1MutationResultMock[1],
      );
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        3,
        useCreateAuthV2MutationResultMock[1],
      );
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        4,
        useUpdateUserMeV1MutationResultMock[1],
      );
    });

    it('should return expected result', () => {
      const expectedResult: [UseResetPasswordData, UseResetPasswordActions] = [
        {
          form: {
            errorMessage: HTTP_UNAUTHORIZED_AUTH_ERROR_MESSAGE,
            fields: {
              confirmPassword: '',
              password: '',
            },
            validation: {},
          },
          status: UseResetPasswordStatus.backendError,
        },
        {
          handlers: {
            onConfirmPasswordChanged: expect.any(Function) as unknown as (
              event: React.ChangeEvent<HTMLInputElement>,
            ) => void,
            onPasswordChanged: expect.any(Function) as unknown as (
              event: React.ChangeEvent<HTMLInputElement>,
            ) => void,
            onSubmit: expect.any(Function) as unknown as (
              event: React.FormEvent,
            ) => void,
          },
        },
      ];

      expect(renderResult.result.current).toStrictEqual(expectedResult);
    });
  });

  describe('when called, and useUrlLikeLocation returns location with code query and cornieApi.useCreateAuthV2Mutation() returns Right and cornieApi.useUpdateUserMeV1Mutation() returns Right', () => {
    let createAuthFixtureResult: Right<apiModels.AuthV2>;
    let updateUserMeFixtureResult: Right<apiModels.UserV1>;
    let renderResult: RenderHookResult<
      [UseResetPasswordData, UseResetPasswordActions],
      unknown
    >;

    beforeAll(() => {
      urlLikeLocationFixture = {
        pathname: '/path',
        searchParams: new URLSearchParams('?code=code'),
      } as Partial<UrlLikeLocation> as UrlLikeLocation;

      useCreateAuthV2MutationResultMock = [
        jest.fn(),
        {
          reset: jest.fn(),
          status: QueryStatus.uninitialized,
        },
      ];

      useUpdateUserMeV1MutationResultMock = [
        jest.fn(),
        {
          reset: jest.fn(),
          status: QueryStatus.uninitialized,
        },
      ];

      createAuthFixtureResult = {
        isRight: true,
        value: {
          accessToken: 'accessToken-fixture',
          refreshToken: 'refreshToken-fixture',
        },
      };

      updateUserMeFixtureResult = {
        isRight: true,
        value: {
          active: true,
          id: 'id',
          name: 'name',
        },
      };

      (
        useUrlLikeLocation as jest.Mock<typeof useUrlLikeLocation>
      ).mockReturnValue(urlLikeLocationFixture);

      (mapUseQueryHookResultV2 as jest.Mock<typeof mapUseQueryHookResultV2>)
        .mockReturnValueOnce(createAuthFixtureResult)
        .mockReturnValueOnce(updateUserMeFixtureResult);

      (
        cornieApi.useCreateAuthV2Mutation as jest.Mock<
          typeof cornieApi.useCreateAuthV2Mutation
        >
      ).mockReturnValue(useCreateAuthV2MutationResultMock);

      (
        cornieApi.useUpdateUsersV1MeMutation as jest.Mock<
          typeof cornieApi.useUpdateUsersV1MeMutation
        >
      ).mockReturnValue(useUpdateUserMeV1MutationResultMock);

      (login as unknown as jest.Mock<typeof login>).mockReturnValueOnce(
        loginResult,
      );

      dispatchMock = jest
        .fn<ReturnType<typeof useAppDispatch>>()
        .mockImplementationOnce(
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
          <TReturn, TAction>(): TAction | TReturn => loginResult as TReturn,
        ) as ReturnType<typeof useAppDispatch> &
        jest.Mock<ReturnType<typeof useAppDispatch>>;

      (
        useAppDispatch as unknown as jest.Mock<typeof useAppDispatch>
      ).mockReturnValue(dispatchMock);

      renderResult = renderHook(() => useResetPassword());
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should return cornieApi.useCreateAuthV2Mutation()', () => {
      expect(cornieApi.useCreateAuthV2Mutation).toHaveBeenCalledTimes(2);
      expect(cornieApi.useCreateAuthV2Mutation).toHaveBeenCalledWith();
    });

    it('should return cornieApi.useUpdateUsersV1MeMutation()', () => {
      expect(cornieApi.useUpdateUsersV1MeMutation).toHaveBeenCalledTimes(2);
      expect(cornieApi.useUpdateUsersV1MeMutation).toHaveBeenCalledWith();
    });

    it('should call mapUseQueryHookResultV2()', () => {
      expect(mapUseQueryHookResultV2).toHaveBeenCalledTimes(4);
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        1,
        useCreateAuthV2MutationResultMock[1],
      );
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        2,
        useUpdateUserMeV1MutationResultMock[1],
      );
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        3,
        useCreateAuthV2MutationResultMock[1],
      );
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        4,
        useUpdateUserMeV1MutationResultMock[1],
      );
    });

    it('should called useAppDispatch()', () => {
      expect(dispatchMock).toHaveBeenCalled();
      expect(dispatchMock).toHaveBeenCalledWith(loginResult);
    });

    it('should return expected result', () => {
      const expectedResult: [UseResetPasswordData, UseResetPasswordActions] = [
        {
          form: {
            fields: {
              confirmPassword: '',
              password: '',
            },
            validation: {},
          },
          status: UseResetPasswordStatus.success,
        },
        {
          handlers: {
            onConfirmPasswordChanged: expect.any(Function) as unknown as (
              event: React.ChangeEvent<HTMLInputElement>,
            ) => void,
            onPasswordChanged: expect.any(Function) as unknown as (
              event: React.ChangeEvent<HTMLInputElement>,
            ) => void,
            onSubmit: expect.any(Function) as unknown as (
              event: React.FormEvent,
            ) => void,
          },
        },
      ];

      expect(renderResult.result.current).toStrictEqual(expectedResult);
    });
  });

  describe('when called, and useUrlLikeLocation returns location with code query and cornieApi.useCreateAuthV2Mutation() returns Right and cornieApi.useUpdateUserMeV1Mutation() returns Left', () => {
    let createAuthFixtureResult: Right<apiModels.AuthV2>;
    let updateUserMeFixtureResult: Left<SerializableAppError | SerializedError>;
    let renderResult: RenderHookResult<
      [UseResetPasswordData, UseResetPasswordActions],
      unknown
    >;
    let errorMessageFixture: string;

    beforeAll(() => {
      urlLikeLocationFixture = {
        pathname: '/path',
        searchParams: new URLSearchParams('?code=code'),
      } as Partial<UrlLikeLocation> as UrlLikeLocation;

      useCreateAuthV2MutationResultMock = [
        jest.fn(),
        {
          reset: jest.fn(),
          status: QueryStatus.uninitialized,
        },
      ];

      useUpdateUserMeV1MutationResultMock = [
        jest.fn(),
        {
          reset: jest.fn(),
          status: QueryStatus.uninitialized,
        },
      ];

      createAuthFixtureResult = {
        isRight: true,
        value: {
          accessToken: 'accessToken-fixture',
          refreshToken: 'refreshToken-fixture',
        },
      };

      updateUserMeFixtureResult = {
        isRight: false,
        value: {
          kind: AppErrorKind.invalidCredentials,
          message: 'message-fixture',
        },
      };

      errorMessageFixture = HTTP_FORBIDDEN_UPD_USER_ME_ERROR_MESSAGE;

      (
        useUrlLikeLocation as jest.Mock<typeof useUrlLikeLocation>
      ).mockReturnValue(urlLikeLocationFixture);

      (mapUseQueryHookResultV2 as jest.Mock<typeof mapUseQueryHookResultV2>)
        .mockReturnValueOnce(createAuthFixtureResult)
        .mockReturnValueOnce(updateUserMeFixtureResult);

      (
        cornieApi.useCreateAuthV2Mutation as jest.Mock<
          typeof cornieApi.useCreateAuthV2Mutation
        >
      ).mockReturnValue(useCreateAuthV2MutationResultMock);

      (
        cornieApi.useUpdateUsersV1MeMutation as jest.Mock<
          typeof cornieApi.useUpdateUsersV1MeMutation
        >
      ).mockReturnValue(useUpdateUserMeV1MutationResultMock);

      (login as unknown as jest.Mock<typeof login>).mockReturnValueOnce(
        loginResult,
      );

      dispatchMock = jest
        .fn<ReturnType<typeof useAppDispatch>>()
        .mockImplementationOnce(
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
          <TReturn, TAction>(): TAction | TReturn => loginResult as TReturn,
        ) as ReturnType<typeof useAppDispatch> &
        jest.Mock<ReturnType<typeof useAppDispatch>>;

      (
        useAppDispatch as unknown as jest.Mock<typeof useAppDispatch>
      ).mockReturnValue(dispatchMock);

      (
        isSerializableAppError as unknown as jest.Mock<
          typeof isSerializableAppError
        >
      ).mockReturnValue(true);

      (
        getUpdateUserMeErrorMessage as jest.Mock<
          typeof getUpdateUserMeErrorMessage
        >
      ).mockReturnValue(errorMessageFixture);

      renderResult = renderHook(() => useResetPassword());
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should return cornieApi.useCreateAuthV2Mutation()', () => {
      expect(cornieApi.useCreateAuthV2Mutation).toHaveBeenCalledTimes(2);
      expect(cornieApi.useCreateAuthV2Mutation).toHaveBeenCalledWith();
    });

    it('should return cornieApi.useUpdateUsersV1MeMutation()', () => {
      expect(cornieApi.useUpdateUsersV1MeMutation).toHaveBeenCalledTimes(2);
      expect(cornieApi.useUpdateUsersV1MeMutation).toHaveBeenCalledWith();
    });

    it('should call mapUseQueryHookResultV2()', () => {
      expect(mapUseQueryHookResultV2).toHaveBeenCalledTimes(4);
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        1,
        useCreateAuthV2MutationResultMock[1],
      );
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        2,
        useUpdateUserMeV1MutationResultMock[1],
      );
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        3,
        useCreateAuthV2MutationResultMock[1],
      );
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        4,
        useUpdateUserMeV1MutationResultMock[1],
      );
    });

    it('should called useAppDispatch()', () => {
      expect(dispatchMock).toHaveBeenCalled();
      expect(dispatchMock).toHaveBeenCalledWith(loginResult);
    });

    it('should return expected result', () => {
      const expectedResult: [UseResetPasswordData, UseResetPasswordActions] = [
        {
          form: {
            errorMessage: HTTP_FORBIDDEN_UPD_USER_ME_ERROR_MESSAGE,
            fields: {
              confirmPassword: '',
              password: '',
            },
            validation: {},
          },
          status: UseResetPasswordStatus.backendError,
        },
        {
          handlers: {
            onConfirmPasswordChanged: expect.any(Function) as unknown as (
              event: React.ChangeEvent<HTMLInputElement>,
            ) => void,
            onPasswordChanged: expect.any(Function) as unknown as (
              event: React.ChangeEvent<HTMLInputElement>,
            ) => void,
            onSubmit: expect.any(Function) as unknown as (
              event: React.FormEvent,
            ) => void,
          },
        },
      ];

      expect(renderResult.result.current).toStrictEqual(expectedResult);
    });
  });
});
