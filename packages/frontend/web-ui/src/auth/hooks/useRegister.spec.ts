import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../common/helpers/mapUseQueryHookResult');
jest.mock('../../common/helpers/mapUseQueryHookResultV2');
jest.mock('../../common/http/services/cornieApi');
jest.mock('../../user/helpers/validateUsername');
jest.mock('../helpers/validateConfirmPassword');
jest.mock('../helpers/validateEmail');
jest.mock('../helpers/validatePassword');

import { models as apiModels } from '@cornie-js/api-models';
import {
  CreateUsersV1Args,
  CreateUsersV1EmailCodeArgs,
} from '@cornie-js/frontend-api-rtk-query';
import { QueryStatus } from '@reduxjs/toolkit/query';
import { renderHook, RenderHookResult } from '@testing-library/react';
import React, { act } from 'react';

import { mapUseQueryHookResult } from '../../common/helpers/mapUseQueryHookResult';
import { mapUseQueryHookResultV2 } from '../../common/helpers/mapUseQueryHookResultV2';
import { cornieApi } from '../../common/http/services/cornieApi';
import { Right } from '../../common/models/Either';
import { validateUsername } from '../../user/helpers/validateUsername';
import { validateConfirmPassword } from '../helpers/validateConfirmPassword';
import { validateEmail } from '../helpers/validateEmail';
import { validatePassword } from '../helpers/validatePassword';
import { UseRegisterActions } from '../models/UseRegisterActions';
import { UseRegisterData } from '../models/UseRegisterData';
import { UseRegisterStatus } from '../models/UseRegisterStatus';
import { useRegister } from './useRegister';

describe(useRegister.name, () => {
  describe('when called', () => {
    let useCreateUsersV1MutationResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useCreateUsersV1Mutation>
    >;
    let useCreateUsersV1EmailCodeMutationResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useCreateUsersV1EmailCodeMutation>
    >;

    let renderResult: RenderHookResult<
      [UseRegisterData, UseRegisterActions],
      unknown
    >;

    beforeAll(() => {
      useCreateUsersV1MutationResultMock = [
        jest.fn(),
        {
          reset: jest.fn(),
          status: QueryStatus.uninitialized,
        },
      ];

      useCreateUsersV1EmailCodeMutationResultMock = [
        jest.fn(),
        {
          reset: jest.fn(),
          status: QueryStatus.uninitialized,
        },
      ];

      (
        mapUseQueryHookResult as jest.Mock<typeof mapUseQueryHookResult>
      ).mockReturnValue(null);

      (
        mapUseQueryHookResultV2 as jest.Mock<typeof mapUseQueryHookResultV2>
      ).mockReturnValue(null);

      (
        cornieApi.useCreateUsersV1Mutation as jest.Mock<
          typeof cornieApi.useCreateUsersV1Mutation
        >
      ).mockReturnValue(useCreateUsersV1MutationResultMock);

      (
        cornieApi.useCreateUsersV1EmailCodeMutation as jest.Mock<
          typeof cornieApi.useCreateUsersV1EmailCodeMutation
        >
      ).mockReturnValue(useCreateUsersV1EmailCodeMutationResultMock);

      renderResult = renderHook(() => useRegister());
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should return cornieApi.useCreateUsersV1Mutation()', () => {
      expect(cornieApi.useCreateUsersV1Mutation).toHaveBeenCalledTimes(1);
      expect(cornieApi.useCreateUsersV1Mutation).toHaveBeenCalledWith();
    });

    it('should return cornieApi.useCreateUsersV1EmailCodeMutation()', () => {
      expect(cornieApi.useCreateUsersV1EmailCodeMutation).toHaveBeenCalledTimes(
        1,
      );
      expect(
        cornieApi.useCreateUsersV1EmailCodeMutation,
      ).toHaveBeenCalledWith();
    });

    it('should call mapUseQueryHookResultV2()', () => {
      expect(mapUseQueryHookResultV2).toHaveBeenCalledTimes(1);
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        1,
        useCreateUsersV1MutationResultMock[1],
      );
    });

    it('should call mapUseQueryHookResult()', () => {
      expect(mapUseQueryHookResult).toHaveBeenCalledTimes(1);
      expect(mapUseQueryHookResult).toHaveBeenNthCalledWith(
        1,
        useCreateUsersV1EmailCodeMutationResultMock[1],
      );
    });

    it('should return expected result', () => {
      const expectedResult: [UseRegisterData, UseRegisterActions] = [
        {
          form: {
            fields: {
              confirmPassword: '',
              email: '',
              name: '',
              password: '',
            },
            validation: {},
          },
          status: UseRegisterStatus.idle,
        },
        {
          handlers: {
            onConfirmPasswordChanged: expect.any(Function) as unknown as (
              event: React.ChangeEvent<HTMLInputElement>,
            ) => void,
            onEmailChanged: expect.any(Function) as unknown as (
              event: React.ChangeEvent<HTMLInputElement>,
            ) => void,
            onNameChanged: expect.any(Function) as unknown as (
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

  describe('when called, parameters are set, and onSubmit() is called', () => {
    let useCreateUsersV1MutationResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useCreateUsersV1Mutation>
    >;
    let useCreateUsersV1EmailCodeMutationResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useCreateUsersV1EmailCodeMutation>
    >;

    let confirmPasswordFixture: string;
    let emailFixture: string;
    let nameFixture: string;
    let passwordFixture: string;
    let eventMock: jest.Mocked<React.FormEvent>;

    let renderResult: RenderHookResult<
      [UseRegisterData, UseRegisterActions],
      unknown
    >;

    beforeAll(() => {
      useCreateUsersV1MutationResultMock = [
        jest.fn(),
        {
          reset: jest.fn(),
          status: QueryStatus.uninitialized,
        },
      ];

      useCreateUsersV1EmailCodeMutationResultMock = [
        jest.fn(),
        {
          reset: jest.fn(),
          status: QueryStatus.uninitialized,
        },
      ];

      confirmPasswordFixture = 'confirm-pasword-fixture';
      emailFixture = 'mail@sample.com';
      nameFixture = 'username-fixture';
      passwordFixture = 'password-fixture';

      eventMock = {
        preventDefault: jest.fn(),
      } as Partial<
        jest.Mocked<React.FormEvent>
      > as jest.Mocked<React.FormEvent>;

      (
        mapUseQueryHookResult as jest.Mock<typeof mapUseQueryHookResult>
      ).mockReturnValue(null);

      (
        mapUseQueryHookResultV2 as jest.Mock<typeof mapUseQueryHookResultV2>
      ).mockReturnValue(null);

      (
        cornieApi.useCreateUsersV1Mutation as jest.Mock<
          typeof cornieApi.useCreateUsersV1Mutation
        >
      ).mockReturnValue(useCreateUsersV1MutationResultMock);

      (
        cornieApi.useCreateUsersV1EmailCodeMutation as jest.Mock<
          typeof cornieApi.useCreateUsersV1EmailCodeMutation
        >
      ).mockReturnValue(useCreateUsersV1EmailCodeMutationResultMock);

      (
        validateConfirmPassword as jest.Mocked<typeof validateConfirmPassword>
      ).mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

      (validateEmail as jest.Mocked<typeof validateEmail>).mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

      (
        validateUsername as jest.Mocked<typeof validateUsername>
      ).mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

      (
        validatePassword as jest.Mocked<typeof validatePassword>
      ).mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

      renderResult = renderHook(() => useRegister());

      act(() => {
        const [, actions] = renderResult.result.current;

        const onConfirmPasswordChanged: (
          event: React.ChangeEvent<HTMLInputElement>,
        ) => void = actions.handlers.onConfirmPasswordChanged;

        const changedEvent: React.ChangeEvent<HTMLInputElement> = {
          currentTarget: {
            value: confirmPasswordFixture,
          },
        } as Partial<
          React.ChangeEvent<HTMLInputElement>
        > as React.ChangeEvent<HTMLInputElement>;

        onConfirmPasswordChanged(changedEvent);
      });

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

        const onNameChanged: (
          event: React.ChangeEvent<HTMLInputElement>,
        ) => void = actions.handlers.onNameChanged;

        const changedEvent: React.ChangeEvent<HTMLInputElement> = {
          currentTarget: {
            value: nameFixture,
          },
        } as Partial<
          React.ChangeEvent<HTMLInputElement>
        > as React.ChangeEvent<HTMLInputElement>;

        onNameChanged(changedEvent);
      });

      act(() => {
        const [, actions] = renderResult.result.current;

        const onPasswordChanged: (
          event: React.ChangeEvent<HTMLInputElement>,
        ) => void = actions.handlers.onPasswordChanged;

        const changedEvent: React.ChangeEvent<HTMLInputElement> = {
          currentTarget: {
            value: passwordFixture,
          },
        } as Partial<
          React.ChangeEvent<HTMLInputElement>
        > as React.ChangeEvent<HTMLInputElement>;

        onPasswordChanged(changedEvent);
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

    it('should call triggerCreateUser()', () => {
      const expected: CreateUsersV1Args = {
        params: [
          {
            email: emailFixture,
            name: nameFixture,
            password: passwordFixture,
          },
        ],
      };

      const [triggerCreateUserMock] = useCreateUsersV1MutationResultMock;

      expect(triggerCreateUserMock).toHaveBeenCalledTimes(1);
      expect(triggerCreateUserMock).toHaveBeenCalledWith(expected);
    });

    it('should return expected result', () => {
      const expectedResult: [UseRegisterData, UseRegisterActions] = [
        {
          form: {
            fields: {
              confirmPassword: confirmPasswordFixture,
              email: emailFixture,
              name: nameFixture,
              password: passwordFixture,
            },
            validation: {},
          },
          status: UseRegisterStatus.creatingUser,
        },
        {
          handlers: {
            onConfirmPasswordChanged: expect.any(Function) as unknown as (
              event: React.ChangeEvent<HTMLInputElement>,
            ) => void,
            onEmailChanged: expect.any(Function) as unknown as (
              event: React.ChangeEvent<HTMLInputElement>,
            ) => void,
            onNameChanged: expect.any(Function) as unknown as (
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

  describe('when called, and cornieApi.useCreateUsersV1Mutation() returns Right user result', () => {
    let useCreateUsersV1MutationResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useCreateUsersV1Mutation>
    >;
    let useCreateUsersV1EmailCodeMutationResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useCreateUsersV1EmailCodeMutation>
    >;

    let userCreatedResultFixture: Right<apiModels.UserV1>;
    let userCodeCreatedResultFixture: null;

    let renderResult: RenderHookResult<
      [UseRegisterData, UseRegisterActions],
      unknown
    >;

    beforeAll(() => {
      useCreateUsersV1MutationResultMock = [
        jest.fn(),
        {
          reset: jest.fn(),
          status: QueryStatus.uninitialized,
        },
      ];

      useCreateUsersV1EmailCodeMutationResultMock = [
        jest.fn(),
        {
          reset: jest.fn(),
          status: QueryStatus.uninitialized,
        },
      ];

      userCreatedResultFixture = {
        isRight: true,
        value: {
          active: true,
          id: 'id-fixture',
          name: 'name-fixtures',
        },
      };

      userCodeCreatedResultFixture = null;

      (mapUseQueryHookResult as jest.Mock<typeof mapUseQueryHookResult>)
        .mockReturnValueOnce(userCodeCreatedResultFixture)
        .mockReturnValueOnce(userCodeCreatedResultFixture);

      (mapUseQueryHookResultV2 as jest.Mock<typeof mapUseQueryHookResultV2>)
        .mockReturnValueOnce(userCreatedResultFixture)
        .mockReturnValueOnce(userCreatedResultFixture);

      (
        cornieApi.useCreateUsersV1Mutation as jest.Mock<
          typeof cornieApi.useCreateUsersV1Mutation
        >
      ).mockReturnValue(useCreateUsersV1MutationResultMock);

      (
        cornieApi.useCreateUsersV1EmailCodeMutation as jest.Mock<
          typeof cornieApi.useCreateUsersV1EmailCodeMutation
        >
      ).mockReturnValue(useCreateUsersV1EmailCodeMutationResultMock);

      renderResult = renderHook(() => useRegister());
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should return cornieApi.useCreateUsersV1Mutation()', () => {
      expect(cornieApi.useCreateUsersV1Mutation).toHaveBeenCalledTimes(2);
      expect(cornieApi.useCreateUsersV1Mutation).toHaveBeenCalledWith();
    });

    it('should return cornieApi.useCreateUsersV1EmailCodeMutation()', () => {
      expect(cornieApi.useCreateUsersV1EmailCodeMutation).toHaveBeenCalledTimes(
        2,
      );
      expect(
        cornieApi.useCreateUsersV1EmailCodeMutation,
      ).toHaveBeenCalledWith();
    });

    it('should call mapUseQueryHookResultV2()', () => {
      expect(mapUseQueryHookResultV2).toHaveBeenCalledTimes(2);
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        1,
        useCreateUsersV1MutationResultMock[1],
      );
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        1,
        useCreateUsersV1MutationResultMock[1],
      );
    });

    it('should call mapUseQueryHookResult()', () => {
      expect(mapUseQueryHookResult).toHaveBeenCalledTimes(2);
      expect(mapUseQueryHookResult).toHaveBeenNthCalledWith(
        1,
        useCreateUsersV1EmailCodeMutationResultMock[1],
      );
      expect(mapUseQueryHookResult).toHaveBeenNthCalledWith(
        2,
        useCreateUsersV1EmailCodeMutationResultMock[1],
      );
    });

    it('should call triggerCreateUserCode()', () => {
      const expected: CreateUsersV1EmailCodeArgs = {
        params: [
          {
            email: '',
          },
          {
            kind: 'registerConfirm',
          },
        ],
      };

      const [triggerCreateUserCodeMock] =
        useCreateUsersV1EmailCodeMutationResultMock;

      expect(triggerCreateUserCodeMock).toHaveBeenCalledTimes(1);
      expect(triggerCreateUserCodeMock).toHaveBeenCalledWith(expected);
    });

    it('should return expected result', () => {
      const expectedResult: [UseRegisterData, UseRegisterActions] = [
        {
          form: {
            fields: {
              confirmPassword: '',
              email: '',
              name: '',
              password: '',
            },
            validation: {},
          },
          status: UseRegisterStatus.creatingUserCode,
        },
        {
          handlers: {
            onConfirmPasswordChanged: expect.any(Function) as unknown as (
              event: React.ChangeEvent<HTMLInputElement>,
            ) => void,
            onEmailChanged: expect.any(Function) as unknown as (
              event: React.ChangeEvent<HTMLInputElement>,
            ) => void,
            onNameChanged: expect.any(Function) as unknown as (
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

  describe('when called, and cornieApi.useCreateUsersV1EmailCodeMutation() returns Right user code result', () => {
    let useCreateUsersV1MutationResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useCreateUsersV1Mutation>
    >;
    let useCreateUsersV1EmailCodeMutationResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useCreateUsersV1EmailCodeMutation>
    >;

    let userCreatedResultFixture: null;
    let userCodeCreatedResultFixture: Right<undefined>;

    let renderResult: RenderHookResult<
      [UseRegisterData, UseRegisterActions],
      unknown
    >;

    beforeAll(() => {
      useCreateUsersV1MutationResultMock = [
        jest.fn(),
        {
          reset: jest.fn(),
          status: QueryStatus.uninitialized,
        },
      ];

      useCreateUsersV1EmailCodeMutationResultMock = [
        jest.fn(),
        {
          reset: jest.fn(),
          status: QueryStatus.uninitialized,
        },
      ];

      userCreatedResultFixture = null;

      userCodeCreatedResultFixture = {
        isRight: true,
        value: undefined,
      };

      (mapUseQueryHookResult as jest.Mock<typeof mapUseQueryHookResult>)
        .mockReturnValueOnce(userCodeCreatedResultFixture)
        .mockReturnValueOnce(userCodeCreatedResultFixture);

      (mapUseQueryHookResultV2 as jest.Mock<typeof mapUseQueryHookResultV2>)
        .mockReturnValueOnce(userCreatedResultFixture)
        .mockReturnValueOnce(userCreatedResultFixture);

      (
        cornieApi.useCreateUsersV1Mutation as jest.Mock<
          typeof cornieApi.useCreateUsersV1Mutation
        >
      ).mockReturnValue(useCreateUsersV1MutationResultMock);

      (
        cornieApi.useCreateUsersV1EmailCodeMutation as jest.Mock<
          typeof cornieApi.useCreateUsersV1EmailCodeMutation
        >
      ).mockReturnValue(useCreateUsersV1EmailCodeMutationResultMock);

      renderResult = renderHook(() => useRegister());
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should call cornieApi.useCreateUsersV1Mutation()', () => {
      expect(cornieApi.useCreateUsersV1Mutation).toHaveBeenCalledTimes(2);
      expect(cornieApi.useCreateUsersV1Mutation).toHaveBeenCalledWith();
    });

    it('should call cornieApi.useCreateUsersV1EmailCodeMutation()', () => {
      expect(cornieApi.useCreateUsersV1EmailCodeMutation).toHaveBeenCalledTimes(
        2,
      );
      expect(
        cornieApi.useCreateUsersV1EmailCodeMutation,
      ).toHaveBeenCalledWith();
    });

    it('should call mapUseQueryHookResultV2()', () => {
      expect(mapUseQueryHookResultV2).toHaveBeenCalledTimes(2);
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        1,
        useCreateUsersV1MutationResultMock[1],
      );
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        2,
        useCreateUsersV1MutationResultMock[1],
      );
    });

    it('should call mapUseQueryHookResult()', () => {
      expect(mapUseQueryHookResult).toHaveBeenCalledTimes(2);
      expect(mapUseQueryHookResult).toHaveBeenNthCalledWith(
        1,
        useCreateUsersV1EmailCodeMutationResultMock[1],
      );
      expect(mapUseQueryHookResult).toHaveBeenNthCalledWith(
        2,
        useCreateUsersV1EmailCodeMutationResultMock[1],
      );
    });

    it('should return expected result', () => {
      const expectedResult: [UseRegisterData, UseRegisterActions] = [
        {
          form: {
            fields: {
              confirmPassword: '',
              email: '',
              name: '',
              password: '',
            },
            validation: {},
          },
          status: UseRegisterStatus.success,
        },
        {
          handlers: {
            onConfirmPasswordChanged: expect.any(Function) as unknown as (
              event: React.ChangeEvent<HTMLInputElement>,
            ) => void,
            onEmailChanged: expect.any(Function) as unknown as (
              event: React.ChangeEvent<HTMLInputElement>,
            ) => void,
            onNameChanged: expect.any(Function) as unknown as (
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
