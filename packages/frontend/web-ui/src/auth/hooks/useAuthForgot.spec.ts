import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../common/helpers/mapUseQueryHookResultV2');
jest.mock('../../common/http/services/cornieApi');
jest.mock('../helpers/validateEmail');
jest.mock('../helpers/getCreateUserCodeErrorMessage');
jest.mock('../../common/helpers/isSerializableAppError');

import {
  DeleteUsersV1EmailCodeArgs,
  SerializableAppError,
} from '@cornie-js/frontend-api-rtk-query';
import { AppErrorKind } from '@cornie-js/frontend-common';
import { QueryStatus } from '@reduxjs/toolkit/query';
import { renderHook, RenderHookResult } from '@testing-library/react';
import React, { act } from 'react';

import { isSerializableAppError } from '../../common/helpers/isSerializableAppError';
import { mapUseQueryHookResultV2 } from '../../common/helpers/mapUseQueryHookResultV2';
import { cornieApi } from '../../common/http/services/cornieApi';
import { Left, Right } from '../../common/models/Either';
import { HTTP_UNPROCESSABLE_USERCODE_ERROR_MESSAGE } from '../helpers/createUserCodeErrorMessage';
import { getCreateUserCodeErrorMessage } from '../helpers/getCreateUserCodeErrorMessage';
import { validateEmail } from '../helpers/validateEmail';
import { UseAuthForgotActions } from '../models/UseAuthForgotActions';
import { UseAuthForgotData } from '../models/UseAuthForgotData';
import { UseAuthForgotStatus } from '../models/UseAuthForgotStatus';
import { useAuthForgot } from './useAuthForgot';

describe(useAuthForgot.name, () => {
  describe('when called', () => {
    let useCreateUsersV1EmailCodeMutationResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useCreateUsersV1EmailCodeMutation>
    >;
    let useDeleteUsersV1EmailCodeMutationResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useDeleteUsersV1EmailCodeMutation>
    >;

    let renderResult: RenderHookResult<
      [UseAuthForgotData, UseAuthForgotActions],
      unknown
    >;

    beforeAll(() => {
      useCreateUsersV1EmailCodeMutationResultMock = [
        jest.fn(),
        {
          reset: jest.fn(),
          status: QueryStatus.uninitialized,
        },
      ];

      useDeleteUsersV1EmailCodeMutationResultMock = [
        jest.fn(),
        {
          reset: jest.fn(),
          status: QueryStatus.uninitialized,
        },
      ];

      (
        mapUseQueryHookResultV2 as jest.Mock<typeof mapUseQueryHookResultV2>
      ).mockReturnValue(null);

      (
        cornieApi.useCreateUsersV1EmailCodeMutation as jest.Mock<
          typeof cornieApi.useCreateUsersV1EmailCodeMutation
        >
      ).mockReturnValue(useCreateUsersV1EmailCodeMutationResultMock);

      (
        cornieApi.useDeleteUsersV1EmailCodeMutation as jest.Mock<
          typeof cornieApi.useDeleteUsersV1EmailCodeMutation
        >
      ).mockReturnValue(useDeleteUsersV1EmailCodeMutationResultMock);

      renderResult = renderHook(() => useAuthForgot());
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should return cornieApi.useCreateUsersV1EmailCodeMutation()', () => {
      expect(cornieApi.useCreateUsersV1EmailCodeMutation).toHaveBeenCalledTimes(
        1,
      );
      expect(
        cornieApi.useCreateUsersV1EmailCodeMutation,
      ).toHaveBeenCalledWith();
    });

    it('should return cornieApi.useDeleteUsersV1EmailCodeMutation()', () => {
      expect(cornieApi.useDeleteUsersV1EmailCodeMutation).toHaveBeenCalledTimes(
        1,
      );
      expect(
        cornieApi.useDeleteUsersV1EmailCodeMutation,
      ).toHaveBeenCalledWith();
    });

    it('should call mapUseQueryHookResultV2()', () => {
      expect(mapUseQueryHookResultV2).toHaveBeenCalledTimes(2);
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        1,
        useCreateUsersV1EmailCodeMutationResultMock[1],
      );
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        2,
        useDeleteUsersV1EmailCodeMutationResultMock[1],
      );
    });

    it('should return expected result', () => {
      const expectedResult: [UseAuthForgotData, UseAuthForgotActions] = [
        {
          form: {
            fields: {
              email: '',
            },
            validation: {},
          },
          status: UseAuthForgotStatus.idle,
        },
        {
          handlers: {
            onEmailChanged: expect.any(Function) as unknown as (
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

  describe('when called, parameters are set, and onSubmit() is called', () => {
    let useCreateUsersV1EmailCodeMutationResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useCreateUsersV1EmailCodeMutation>
    >;
    let useDeleteUsersV1EmailCodeMutationResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useDeleteUsersV1EmailCodeMutation>
    >;

    let emailFixture: string;
    let eventMock: jest.Mocked<React.FormEvent>;

    let renderResult: RenderHookResult<
      [UseAuthForgotData, UseAuthForgotActions],
      unknown
    >;

    beforeAll(() => {
      useCreateUsersV1EmailCodeMutationResultMock = [
        jest.fn(),
        {
          reset: jest.fn(),
          status: QueryStatus.uninitialized,
        },
      ];

      useDeleteUsersV1EmailCodeMutationResultMock = [
        jest.fn(),
        {
          reset: jest.fn(),
          status: QueryStatus.uninitialized,
        },
      ];

      emailFixture = 'mail@sample.com';

      eventMock = {
        preventDefault: jest.fn(),
      } as Partial<
        jest.Mocked<React.FormEvent>
      > as jest.Mocked<React.FormEvent>;

      (
        mapUseQueryHookResultV2 as jest.Mock<typeof mapUseQueryHookResultV2>
      ).mockReturnValue(null);

      (
        cornieApi.useCreateUsersV1EmailCodeMutation as jest.Mock<
          typeof cornieApi.useCreateUsersV1EmailCodeMutation
        >
      ).mockReturnValue(useCreateUsersV1EmailCodeMutationResultMock);

      (
        cornieApi.useDeleteUsersV1EmailCodeMutation as jest.Mock<
          typeof cornieApi.useDeleteUsersV1EmailCodeMutation
        >
      ).mockReturnValue(useDeleteUsersV1EmailCodeMutationResultMock);

      (validateEmail as jest.Mocked<typeof validateEmail>).mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

      renderResult = renderHook(() => useAuthForgot());

      act(() => {
        const [, actions] = renderResult.result.current;

        const onEmailChanged: (
          event: React.ChangeEvent<HTMLInputElement>,
        ) => void = actions.handlers.onEmailChanged;

        const changedEvent: React.ChangeEvent<HTMLInputElement> = {
          currentTarget: {
            value: emailFixture,
          },
        } as Partial<
          React.ChangeEvent<HTMLInputElement>
        > as React.ChangeEvent<HTMLInputElement>;

        onEmailChanged(changedEvent);
      });

      act(() => {
        const [, actions] = renderResult.result.current;

        const onSubmit: (event: React.FormEvent) => void =
          actions.handlers.onSubmit;

        onSubmit(eventMock);
      });
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should call triggerDeleteUserCode()', () => {
      const expected: DeleteUsersV1EmailCodeArgs = {
        params: [
          {
            email: emailFixture,
          },
        ],
      };

      const [triggerDeleteUserCode] =
        useDeleteUsersV1EmailCodeMutationResultMock;

      expect(triggerDeleteUserCode).toHaveBeenCalledTimes(1);
      expect(triggerDeleteUserCode).toHaveBeenCalledWith(expected);
    });

    it('should return expected result', () => {
      const expectedResult: [UseAuthForgotData, UseAuthForgotActions] = [
        {
          form: {
            fields: {
              email: emailFixture,
            },
            validation: {},
          },
          status: UseAuthForgotStatus.deletingUserCode,
        },
        {
          handlers: {
            onEmailChanged: expect.any(Function) as unknown as (
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

  describe('when called, and cornieApi.useDeleteUsersV1EmailCodeMutation() returns Left result error', () => {
    let useCreateUsersV1EmailCodeMutationResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useCreateUsersV1EmailCodeMutation>
    >;
    let useDeleteUsersV1EmailCodeMutationResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useDeleteUsersV1EmailCodeMutation>
    >;

    let userCodeDeletedResultFixture: Left<SerializableAppError>;
    let errorMessageFixture: string;

    let renderResult: RenderHookResult<
      [UseAuthForgotData, UseAuthForgotActions],
      unknown
    >;

    beforeAll(() => {
      useCreateUsersV1EmailCodeMutationResultMock = [
        jest.fn(),
        {
          reset: jest.fn(),
          status: QueryStatus.uninitialized,
        },
      ];

      useDeleteUsersV1EmailCodeMutationResultMock = [
        jest.fn(),
        {
          reset: jest.fn(),
          status: QueryStatus.uninitialized,
        },
      ];

      userCodeDeletedResultFixture = {
        isRight: false,
        value: {
          kind: AppErrorKind.unprocessableOperation,
          message: 'message-fixture',
        },
      };

      errorMessageFixture = HTTP_UNPROCESSABLE_USERCODE_ERROR_MESSAGE;

      (mapUseQueryHookResultV2 as jest.Mock<typeof mapUseQueryHookResultV2>)
        .mockReturnValueOnce(userCodeDeletedResultFixture)
        .mockReturnValueOnce(userCodeDeletedResultFixture);

      (
        isSerializableAppError as unknown as jest.Mock<
          typeof isSerializableAppError
        >
      ).mockReturnValue(true);

      (
        getCreateUserCodeErrorMessage as jest.Mock<
          typeof getCreateUserCodeErrorMessage
        >
      ).mockReturnValue(errorMessageFixture);

      (
        cornieApi.useCreateUsersV1EmailCodeMutation as jest.Mock<
          typeof cornieApi.useCreateUsersV1EmailCodeMutation
        >
      ).mockReturnValue(useCreateUsersV1EmailCodeMutationResultMock);

      (
        cornieApi.useDeleteUsersV1EmailCodeMutation as jest.Mock<
          typeof cornieApi.useDeleteUsersV1EmailCodeMutation
        >
      ).mockReturnValue(useDeleteUsersV1EmailCodeMutationResultMock);

      renderResult = renderHook(() => useAuthForgot());
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should return cornieApi.useCreateUsersV1EmailCodeMutation()', () => {
      expect(cornieApi.useCreateUsersV1EmailCodeMutation).toHaveBeenCalledTimes(
        2,
      );
      expect(
        cornieApi.useCreateUsersV1EmailCodeMutation,
      ).toHaveBeenCalledWith();
    });

    it('should return cornieApi.useDeleteUsersV1EmailCodeMutation()', () => {
      expect(cornieApi.useDeleteUsersV1EmailCodeMutation).toHaveBeenCalledTimes(
        2,
      );
      expect(
        cornieApi.useDeleteUsersV1EmailCodeMutation,
      ).toHaveBeenCalledWith();
    });

    it('should call mapUseQueryHookResultV2()', () => {
      expect(mapUseQueryHookResultV2).toHaveBeenCalledTimes(4);
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        1,
        useCreateUsersV1EmailCodeMutationResultMock[1],
      );
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        2,
        useDeleteUsersV1EmailCodeMutationResultMock[1],
      );
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        3,
        useCreateUsersV1EmailCodeMutationResultMock[1],
      );
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        4,
        useDeleteUsersV1EmailCodeMutationResultMock[1],
      );
    });

    it('should call isSerializableAppError()', () => {
      expect(isSerializableAppError).toHaveBeenCalledTimes(2);
      expect(isSerializableAppError).toHaveBeenNthCalledWith(
        1,
        userCodeDeletedResultFixture.value,
      );
      expect(isSerializableAppError).toHaveBeenNthCalledWith(
        2,
        userCodeDeletedResultFixture.value,
      );
    });

    it('should call getCreateUserCodeErrorMessage()', () => {
      expect(getCreateUserCodeErrorMessage).toHaveBeenCalledTimes(2);
      expect(getCreateUserCodeErrorMessage).toHaveBeenNthCalledWith(
        1,
        userCodeDeletedResultFixture.value.kind,
      );
      expect(isSerializableAppError).toHaveBeenNthCalledWith(
        2,
        userCodeDeletedResultFixture.value,
      );
    });

    it('should return expected result', () => {
      const expectedResult: [UseAuthForgotData, UseAuthForgotActions] = [
        {
          form: {
            errorMessage: HTTP_UNPROCESSABLE_USERCODE_ERROR_MESSAGE,
            fields: {
              email: '',
            },
            validation: {},
          },
          status: UseAuthForgotStatus.backendError,
        },
        {
          handlers: {
            onEmailChanged: expect.any(Function) as unknown as (
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

  describe('when called, and cornieApi.useDeleteUsersV1EmailCodeMutation() returns Right and cornieApi.useCreateUsersV1EmailCodeMutation() returns Right result user code', () => {
    let useCreateUsersV1EmailCodeMutationResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useCreateUsersV1EmailCodeMutation>
    >;
    let useDeleteUsersV1EmailCodeMutationResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useDeleteUsersV1EmailCodeMutation>
    >;

    let userCodeDeletedResultFixture: Right<undefined>;

    let userCodeCreatedResultFixture: Right<undefined>;

    let renderResult: RenderHookResult<
      [UseAuthForgotData, UseAuthForgotActions],
      unknown
    >;

    beforeAll(() => {
      useCreateUsersV1EmailCodeMutationResultMock = [
        jest.fn(),
        {
          reset: jest.fn(),
          status: QueryStatus.uninitialized,
        },
      ];

      useDeleteUsersV1EmailCodeMutationResultMock = [
        jest.fn(),
        {
          reset: jest.fn(),
          status: QueryStatus.uninitialized,
        },
      ];

      userCodeDeletedResultFixture = {
        isRight: true,
        value: undefined,
      };

      userCodeCreatedResultFixture = {
        isRight: true,
        value: undefined,
      };

      (mapUseQueryHookResultV2 as jest.Mock<typeof mapUseQueryHookResultV2>)
        .mockReturnValueOnce(userCodeCreatedResultFixture)
        .mockReturnValueOnce(userCodeDeletedResultFixture)
        .mockReturnValueOnce(userCodeCreatedResultFixture)
        .mockReturnValueOnce(userCodeDeletedResultFixture);

      (
        cornieApi.useCreateUsersV1EmailCodeMutation as jest.Mock<
          typeof cornieApi.useCreateUsersV1EmailCodeMutation
        >
      ).mockReturnValue(useCreateUsersV1EmailCodeMutationResultMock);

      (
        cornieApi.useDeleteUsersV1EmailCodeMutation as jest.Mock<
          typeof cornieApi.useDeleteUsersV1EmailCodeMutation
        >
      ).mockReturnValue(useDeleteUsersV1EmailCodeMutationResultMock);

      renderResult = renderHook(() => useAuthForgot());
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should call cornieApi.useDeleteUsersV1EmailCodeMutationResultMock()', () => {
      expect(cornieApi.useCreateUsersV1EmailCodeMutation).toHaveBeenCalledTimes(
        2,
      );
      expect(
        cornieApi.useDeleteUsersV1EmailCodeMutation,
      ).toHaveBeenCalledWith();
    });

    it('should call cornieApi.useCreateUsersV1EmailCodeMutationResultMock()', () => {
      expect(cornieApi.useCreateUsersV1EmailCodeMutation).toHaveBeenCalledTimes(
        2,
      );
      expect(
        cornieApi.useCreateUsersV1EmailCodeMutation,
      ).toHaveBeenCalledWith();
    });

    it('should call mapUseQueryHookResultV2()', () => {
      expect(mapUseQueryHookResultV2).toHaveBeenCalledTimes(4);
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        1,
        useCreateUsersV1EmailCodeMutationResultMock[1],
      );
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        2,
        useDeleteUsersV1EmailCodeMutationResultMock[1],
      );
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        3,
        useCreateUsersV1EmailCodeMutationResultMock[1],
      );
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        4,
        useDeleteUsersV1EmailCodeMutationResultMock[1],
      );
    });

    it('should return expected result', () => {
      const expectedResult: [UseAuthForgotData, UseAuthForgotActions] = [
        {
          form: {
            fields: {
              email: '',
            },
            validation: {},
          },
          status: UseAuthForgotStatus.success,
        },
        {
          handlers: {
            onEmailChanged: expect.any(Function) as unknown as (
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

  describe('when called, and cornieApi.useDeleteUsersV1EmailCodeMutation() returns Right and cornieApi.useCreateUsersV1EmailCodeMutation() returns Left user error', () => {
    let useCreateUsersV1EmailCodeMutationResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useCreateUsersV1EmailCodeMutation>
    >;
    let useDeleteUsersV1EmailCodeMutationResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useDeleteUsersV1EmailCodeMutation>
    >;

    let userCodeDeletedResultFixture: Right<undefined>;
    let userCodeCreatedResultFixture: Left<SerializableAppError>;
    let errorMessageFixture: string;

    let renderResult: RenderHookResult<
      [UseAuthForgotData, UseAuthForgotActions],
      unknown
    >;

    beforeAll(() => {
      useCreateUsersV1EmailCodeMutationResultMock = [
        jest.fn(),
        {
          reset: jest.fn(),
          status: QueryStatus.uninitialized,
        },
      ];

      useDeleteUsersV1EmailCodeMutationResultMock = [
        jest.fn(),
        {
          reset: jest.fn(),
          status: QueryStatus.uninitialized,
        },
      ];

      userCodeCreatedResultFixture = {
        isRight: false,
        value: {
          kind: AppErrorKind.unprocessableOperation,
          message: 'message-fixture',
        },
      };

      userCodeDeletedResultFixture = {
        isRight: true,
        value: undefined,
      };

      errorMessageFixture = HTTP_UNPROCESSABLE_USERCODE_ERROR_MESSAGE;

      (mapUseQueryHookResultV2 as jest.Mock<typeof mapUseQueryHookResultV2>)
        .mockReturnValueOnce(userCodeCreatedResultFixture)
        .mockReturnValueOnce(userCodeDeletedResultFixture)
        .mockReturnValueOnce(userCodeCreatedResultFixture)
        .mockReturnValueOnce(userCodeDeletedResultFixture);

      (
        isSerializableAppError as unknown as jest.Mock<
          typeof isSerializableAppError
        >
      ).mockReturnValue(true);

      (
        getCreateUserCodeErrorMessage as jest.Mock<
          typeof getCreateUserCodeErrorMessage
        >
      ).mockReturnValue(errorMessageFixture);

      (
        cornieApi.useCreateUsersV1EmailCodeMutation as jest.Mock<
          typeof cornieApi.useCreateUsersV1EmailCodeMutation
        >
      ).mockReturnValue(useCreateUsersV1EmailCodeMutationResultMock);

      (
        cornieApi.useDeleteUsersV1EmailCodeMutation as jest.Mock<
          typeof cornieApi.useDeleteUsersV1EmailCodeMutation
        >
      ).mockReturnValue(useDeleteUsersV1EmailCodeMutationResultMock);

      renderResult = renderHook(() => useAuthForgot());
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should return cornieApi.useCreateUsersV1EmailCodeMutation()', () => {
      expect(cornieApi.useCreateUsersV1EmailCodeMutation).toHaveBeenCalledTimes(
        2,
      );
      expect(
        cornieApi.useCreateUsersV1EmailCodeMutation,
      ).toHaveBeenCalledWith();
    });

    it('should return cornieApi.useDeleteUsersV1EmailCodeMutation()', () => {
      expect(cornieApi.useDeleteUsersV1EmailCodeMutation).toHaveBeenCalledTimes(
        2,
      );
      expect(
        cornieApi.useDeleteUsersV1EmailCodeMutation,
      ).toHaveBeenCalledWith();
    });

    it('should call mapUseQueryHookResultV2()', () => {
      expect(mapUseQueryHookResultV2).toHaveBeenCalledTimes(4);
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        1,
        useCreateUsersV1EmailCodeMutationResultMock[1],
      );
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        2,
        useDeleteUsersV1EmailCodeMutationResultMock[1],
      );
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        3,
        useCreateUsersV1EmailCodeMutationResultMock[1],
      );
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        4,
        useDeleteUsersV1EmailCodeMutationResultMock[1],
      );
    });

    it('should call isSerializableAppError()', () => {
      expect(isSerializableAppError).toHaveBeenCalledTimes(1);
      expect(isSerializableAppError).toHaveBeenNthCalledWith(
        1,
        userCodeCreatedResultFixture.value,
      );
    });

    it('should call getCreateUserCodeErrorMessage()', () => {
      expect(getCreateUserCodeErrorMessage).toHaveBeenCalledTimes(1);
      expect(getCreateUserCodeErrorMessage).toHaveBeenNthCalledWith(
        1,
        userCodeCreatedResultFixture.value.kind,
      );
    });

    it('should return expected result', () => {
      const expectedResult: [UseAuthForgotData, UseAuthForgotActions] = [
        {
          form: {
            errorMessage: HTTP_UNPROCESSABLE_USERCODE_ERROR_MESSAGE,
            fields: {
              email: '',
            },
            validation: {},
          },
          status: UseAuthForgotStatus.backendError,
        },
        {
          handlers: {
            onEmailChanged: expect.any(Function) as unknown as (
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
