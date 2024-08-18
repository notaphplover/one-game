import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../auth/helpers/validateConfirmPassword');
jest.mock('../../auth/helpers/validatePassword');
jest.mock('../../common/helpers/mapUseQueryHookResult');
jest.mock('../../common/http/services/cornieApi');
jest.mock('../helpers/validateUsername');

import { models as apiModels } from '@cornie-js/api-models';
import { UpdateUsersV1MeArgs } from '@cornie-js/frontend-api-rtk-query';
import { QueryStatus } from '@reduxjs/toolkit/query';
import { renderHook, RenderHookResult, waitFor } from '@testing-library/react';
import React, { act } from 'react';

import { validateConfirmPassword } from '../../auth/helpers/validateConfirmPassword';
import { validatePassword } from '../../auth/helpers/validatePassword';
import { mapUseQueryHookResult } from '../../common/helpers/mapUseQueryHookResult';
import { cornieApi } from '../../common/http/services/cornieApi';
import { Either, Left, Right } from '../../common/models/Either';
import { validateUsername } from '../helpers/validateUsername';
import { UserInfoStatus } from '../models/UserInfoStatus';
import { UseUserInfoActions } from '../models/UseUserInfoActions';
import { UseUserInfoData } from '../models/UseUserInfoData';
import { useUserInfo } from './useUserInfo';

describe(useUserInfo.name, () => {
  describe('when called, and mapUseQueryHookResult() returns Right', () => {
    let useGetUsersV1MeDetailQueryResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useGetUsersV1MeDetailQuery>
    >;
    let useGetUsersV1MeQueryResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useGetUsersV1MeQuery>
    >;
    let useUpdateUsersV1MeMutationResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useUpdateUsersV1MeMutation>
    >;
    let usersV1MeDetailResultFixture: Right<apiModels.UserDetailV1>;
    let usersV1MeResultFixture: Either<string, apiModels.UserV1> | null;

    let renderResult: RenderHookResult<
      [UseUserInfoData, UseUserInfoActions],
      unknown
    >;

    beforeAll(async () => {
      useGetUsersV1MeDetailQueryResultMock = {
        data: undefined,
        error: undefined,
        isLoading: false,
        refetch: jest.fn(),
      };

      useGetUsersV1MeQueryResultMock = {
        data: undefined,
        error: undefined,
        isLoading: false,
        refetch: jest.fn(),
      };

      useUpdateUsersV1MeMutationResultMock = [
        jest.fn(),
        {
          reset: jest.fn(),
          status: QueryStatus.uninitialized,
        },
      ];

      usersV1MeDetailResultFixture = {
        isRight: true,
        value: {
          email: 'mail@sample.com',
        },
      };

      usersV1MeResultFixture = {
        isRight: true,
        value: {
          active: true,
          id: 'id-fixture',
          name: 'name-fixture',
        },
      };

      (mapUseQueryHookResult as jest.Mock<typeof mapUseQueryHookResult>)
        .mockReturnValueOnce(usersV1MeDetailResultFixture)
        .mockReturnValueOnce(usersV1MeResultFixture);

      (
        cornieApi.useGetUsersV1MeDetailQuery as jest.Mock<
          typeof cornieApi.useGetUsersV1MeDetailQuery
        >
      ).mockReturnValue(useGetUsersV1MeDetailQueryResultMock);

      (
        cornieApi.useGetUsersV1MeQuery as jest.Mock<
          typeof cornieApi.useGetUsersV1MeQuery
        >
      ).mockReturnValue(useGetUsersV1MeQueryResultMock);

      (
        cornieApi.useUpdateUsersV1MeMutation as jest.Mock<
          typeof cornieApi.useUpdateUsersV1MeMutation
        >
      ).mockReturnValue(useUpdateUsersV1MeMutationResultMock);

      await act(async () => {
        renderResult = renderHook(() => useUserInfo());
      });

      jest.clearAllMocks();
    });

    describe('when onSubmit is called', () => {
      let confirmPasswordFixture: string;
      let nameFixture: string;
      let passwordFixture: string;
      let eventMock: jest.Mocked<React.FormEvent>;

      beforeAll(async () => {
        eventMock = {
          preventDefault: jest.fn(),
        } as Partial<
          jest.Mocked<React.FormEvent>
        > as jest.Mocked<React.FormEvent>;

        (mapUseQueryHookResult as jest.Mock<typeof mapUseQueryHookResult>)
          .mockReturnValueOnce(usersV1MeDetailResultFixture)
          .mockReturnValueOnce(usersV1MeResultFixture)
          .mockReturnValueOnce(usersV1MeDetailResultFixture)
          .mockReturnValueOnce(usersV1MeResultFixture)
          .mockReturnValueOnce(usersV1MeDetailResultFixture)
          .mockReturnValueOnce(usersV1MeResultFixture)
          .mockReturnValueOnce(usersV1MeDetailResultFixture)
          .mockReturnValueOnce(usersV1MeResultFixture);

        (
          cornieApi.useGetUsersV1MeDetailQuery as jest.Mock<
            typeof cornieApi.useGetUsersV1MeDetailQuery
          >
        ).mockReturnValue(useGetUsersV1MeDetailQueryResultMock);

        (
          cornieApi.useGetUsersV1MeQuery as jest.Mock<
            typeof cornieApi.useGetUsersV1MeQuery
          >
        ).mockReturnValue(useGetUsersV1MeQueryResultMock);

        (
          cornieApi.useUpdateUsersV1MeMutation as jest.Mock<
            typeof cornieApi.useUpdateUsersV1MeMutation
          >
        ).mockReturnValueOnce(useUpdateUsersV1MeMutationResultMock);

        confirmPasswordFixture = 'password-fixture';
        nameFixture = 'name-fixture';
        passwordFixture = 'password-fixture';

        (
          validateConfirmPassword as jest.Mocked<typeof validateConfirmPassword>
        ).mockReturnValueOnce({
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

        await waitFor(() => {
          const [data] = renderResult.result.current;

          // eslint-disable-next-line jest/no-standalone-expect
          expect(data.status).toBe(UserInfoStatus.idle);
        });

        act(() => {
          const [, actions] = renderResult.result.current;

          const onSubmit: (event: React.FormEvent) => void =
            actions.handlers.onSubmit;

          onSubmit(eventMock);
        });

        await waitFor(() => {
          const [data] = renderResult.result.current;

          // eslint-disable-next-line jest/no-standalone-expect
          expect(data.status).toBe(UserInfoStatus.updatingUser);
        });
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call cornieApi.useGetUsersV1MeDetailQuery()', () => {
        const expectedParams: Parameters<
          typeof cornieApi.useGetUsersV1MeDetailQuery
        > = [
          {
            params: [],
          },
        ];

        expect(cornieApi.useGetUsersV1MeDetailQuery).toHaveBeenCalledTimes(4);
        expect(cornieApi.useGetUsersV1MeDetailQuery).toHaveBeenCalledWith(
          ...expectedParams,
        );
      });

      it('should call cornieApi.useGetUsersV1MeQuery()', () => {
        const expectedParams: Parameters<
          typeof cornieApi.useGetUsersV1MeQuery
        > = [
          {
            params: [],
          },
        ];

        expect(cornieApi.useGetUsersV1MeQuery).toHaveBeenCalledTimes(4);
        expect(cornieApi.useGetUsersV1MeQuery).toHaveBeenCalledWith(
          ...expectedParams,
        );
      });

      it('should call cornieApi.useUpdateUsersV1MeMutation', () => {
        expect(cornieApi.useUpdateUsersV1MeMutation).toHaveBeenCalledTimes(4);
        expect(cornieApi.useUpdateUsersV1MeMutation).toHaveBeenCalledWith();
      });

      it('should call mapUseQueryHookResult()', () => {
        expect(mapUseQueryHookResult).toHaveBeenCalledTimes(8);
        expect(mapUseQueryHookResult).toHaveBeenCalledWith(
          useGetUsersV1MeDetailQueryResultMock,
        );
      });

      it('should call triggerUpdateUser()', () => {
        const expected: UpdateUsersV1MeArgs = {
          params: [
            {
              name: nameFixture,
              password: passwordFixture,
            },
          ],
        };

        const [triggerUpdateUserMock] = useUpdateUsersV1MeMutationResultMock;

        expect(triggerUpdateUserMock).toHaveBeenCalledTimes(1);
        expect(triggerUpdateUserMock).toHaveBeenCalledWith(expected);
      });

      it('should return expected result', () => {
        const expected: [UseUserInfoData, UseUserInfoActions] = [
          {
            form: {
              fields: {
                confirmPassword: confirmPasswordFixture,
                email: usersV1MeDetailResultFixture.value.email,
                name: nameFixture,
                password: passwordFixture,
              },
              validation: {},
            },
            status: UserInfoStatus.updatingUser,
          },
          {
            handlers: {
              onConfirmPasswordChanged: expect.any(Function) as unknown as (
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

        expect(renderResult.result.current).toStrictEqual(expected);
      });
    });
  });

  describe('when called, and mapUseQueryHookResult() returns Left', () => {
    let useGetUsersV1MeDetailQueryResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useGetUsersV1MeDetailQuery>
    >;
    let useGetUsersV1MeQueryResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useGetUsersV1MeQuery>
    >;
    let useUpdateUsersV1MeMutationResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useUpdateUsersV1MeMutation>
    >;
    let usersV1MeDetailResultFixture: Left<string>;
    let usersV1MeResultFixture: Left<string>;

    let renderResult: RenderHookResult<
      [UseUserInfoData, UseUserInfoActions],
      unknown
    >;

    beforeAll(async () => {
      useGetUsersV1MeDetailQueryResultMock = {
        data: undefined,
        error: undefined,
        isLoading: false,
        refetch: jest.fn(),
      };

      useGetUsersV1MeQueryResultMock = {
        data: undefined,
        error: undefined,
        isLoading: false,
        refetch: jest.fn(),
      };

      useUpdateUsersV1MeMutationResultMock = [
        jest.fn(),
        {
          reset: jest.fn(),
          status: QueryStatus.uninitialized,
        },
      ];

      usersV1MeDetailResultFixture = {
        isRight: false,
        value: 'error-message-fixture',
      };

      usersV1MeResultFixture = {
        isRight: false,
        value: 'error-message-fixture',
      };

      (mapUseQueryHookResult as jest.Mock<typeof mapUseQueryHookResult>)
        .mockReturnValueOnce(usersV1MeDetailResultFixture)
        .mockReturnValueOnce(usersV1MeResultFixture)
        .mockReturnValueOnce(usersV1MeDetailResultFixture)
        .mockReturnValueOnce(usersV1MeResultFixture);

      (
        cornieApi.useGetUsersV1MeDetailQuery as jest.Mock<
          typeof cornieApi.useGetUsersV1MeDetailQuery
        >
      ).mockReturnValue(useGetUsersV1MeDetailQueryResultMock);

      (
        cornieApi.useGetUsersV1MeQuery as jest.Mock<
          typeof cornieApi.useGetUsersV1MeQuery
        >
      ).mockReturnValue(useGetUsersV1MeQueryResultMock);

      (
        cornieApi.useUpdateUsersV1MeMutation as jest.Mock<
          typeof cornieApi.useUpdateUsersV1MeMutation
        >
      ).mockReturnValue(useUpdateUsersV1MeMutationResultMock);

      await act(async () => {
        renderResult = renderHook(() => useUserInfo());
      });
    });

    it('should call cornieApi.useGetUsersV1MeDetailQuery()', () => {
      const expectedParams: Parameters<
        typeof cornieApi.useGetUsersV1MeDetailQuery
      > = [
        {
          params: [],
        },
      ];

      expect(cornieApi.useGetUsersV1MeDetailQuery).toHaveBeenCalledTimes(2);
      expect(cornieApi.useGetUsersV1MeDetailQuery).toHaveBeenCalledWith(
        ...expectedParams,
      );
    });

    it('should call cornieApi.useGetUsersV1MeQuery()', () => {
      const expectedParams: Parameters<typeof cornieApi.useGetUsersV1MeQuery> =
        [
          {
            params: [],
          },
        ];

      expect(cornieApi.useGetUsersV1MeQuery).toHaveBeenCalledTimes(2);
      expect(cornieApi.useGetUsersV1MeQuery).toHaveBeenCalledWith(
        ...expectedParams,
      );
    });

    it('should call cornieApi.useUpdateUsersV1MeMutation', () => {
      expect(cornieApi.useUpdateUsersV1MeMutation).toHaveBeenCalledTimes(2);
      expect(cornieApi.useUpdateUsersV1MeMutation).toHaveBeenCalledWith();
    });

    it('should call mapUseQueryHookResult()', () => {
      expect(mapUseQueryHookResult).toHaveBeenCalledTimes(4);
      expect(mapUseQueryHookResult).toHaveBeenCalledWith(
        useGetUsersV1MeDetailQueryResultMock,
      );
    });

    it('should return expected result', () => {
      const expected: [UseUserInfoData, UseUserInfoActions] = [
        {
          form: {
            fields: {
              confirmPassword: null,
              email: null,
              name: null,
              password: null,
            },
            validation: {},
          },
          status: UserInfoStatus.userFetchError,
        },
        {
          handlers: {
            onConfirmPasswordChanged: expect.any(Function) as unknown as (
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

      expect(renderResult.result.current).toStrictEqual(expected);
    });
  });
});
