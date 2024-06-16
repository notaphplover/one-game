import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../common/helpers/mapUseQueryHookResult');
jest.mock('../../common/http/services/cornieApi');

import { models as apiModels } from '@cornie-js/api-models';
import { UpdateUsersV1MeArgs } from '@cornie-js/frontend-api-rtk-query';
import { QueryStatus } from '@reduxjs/toolkit/query';
import { RenderHookResult, renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';

import { mapUseQueryHookResult } from '../../common/helpers/mapUseQueryHookResult';
import { cornieApi } from '../../common/http/services/cornieApi';
import { Either } from '../../common/models/Either';
import { UserInfoStatus } from '../models/UserInfoStatus';
import { UseUserInfoResult, useUserInfo } from './useUserInfo';

describe(useUserInfo.name, () => {
  describe('when called', () => {
    let useGetUsersV1MeQueryResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useGetUsersV1MeQuery>
    >;
    let useUpdateUsersV1MeMutationResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useUpdateUsersV1MeMutation>
    >;
    let usersV1MeResultFixture: Either<string, apiModels.UserV1> | null;

    let renderResult: RenderHookResult<UseUserInfoResult, unknown>;

    beforeAll(() => {
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

      usersV1MeResultFixture = null;

      (
        mapUseQueryHookResult as jest.Mock<typeof mapUseQueryHookResult>
      ).mockReturnValueOnce(usersV1MeResultFixture);

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

      renderResult = renderHook(() => useUserInfo());

      jest.clearAllMocks();
    });

    describe('when updateUser is called', () => {
      let userMeUpdateQueryV1Fixture: apiModels.UserMeUpdateQueryV1;

      beforeAll(async () => {
        (
          mapUseQueryHookResult as jest.Mock<typeof mapUseQueryHookResult>
        ).mockReturnValueOnce(usersV1MeResultFixture);

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

        userMeUpdateQueryV1Fixture = {
          name: 'name-fixture',
        };

        const updateUser: (
          userMeUpdateQueryV1: apiModels.UserMeUpdateQueryV1,
        ) => void = renderResult.result.current.updateUser;

        act(() => {
          updateUser(userMeUpdateQueryV1Fixture);
        });

        await waitFor(() => {
          // eslint-disable-next-line jest/no-standalone-expect
          expect(renderResult.result.current.status).toBe(
            UserInfoStatus.updatingUser,
          );
        });
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call cornieApi.useGetUsersV1MeQuery()', () => {
        const expectedParams: Parameters<
          typeof cornieApi.useGetUsersV1MeQuery
        > = [
          {
            params: [],
          },
        ];

        expect(cornieApi.useGetUsersV1MeQuery).toHaveBeenCalledTimes(1);
        expect(cornieApi.useGetUsersV1MeQuery).toHaveBeenCalledWith(
          ...expectedParams,
        );
      });

      it('should call cornieApi.useUpdateUsersV1MeMutation', () => {
        expect(cornieApi.useUpdateUsersV1MeMutation).toHaveBeenCalledTimes(1);
        expect(cornieApi.useUpdateUsersV1MeMutation).toHaveBeenCalledWith();
      });

      it('should call mapUseQueryHookResult()', () => {
        expect(mapUseQueryHookResult).toHaveBeenCalledTimes(1);
        expect(mapUseQueryHookResult).toHaveBeenCalledWith(
          useGetUsersV1MeQueryResultMock,
        );
      });

      it('should call triggerUpdateUser()', () => {
        const expected: UpdateUsersV1MeArgs = {
          params: [userMeUpdateQueryV1Fixture],
        };

        const [triggerUpdateUserMock] = useUpdateUsersV1MeMutationResultMock;

        expect(triggerUpdateUserMock).toHaveBeenCalledTimes(1);
        expect(triggerUpdateUserMock).toHaveBeenCalledWith(expected);
      });

      it('should return expected result', () => {
        const expected: UseUserInfoResult = {
          status: UserInfoStatus.updatingUser,
          updateUser: expect.any(Function) as unknown as (
            userMeUpdateQueryV1: apiModels.UserMeUpdateQueryV1,
          ) => void,
          usersV1MeResult: usersV1MeResultFixture,
        };

        expect(renderResult.result.current).toStrictEqual(expected);
      });
    });
  });

  describe('when called, and mapUseQueryHookResult() returns null', () => {
    let useGetUsersV1MeQueryResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useGetUsersV1MeQuery>
    >;
    let useUpdateUsersV1MeMutationResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useUpdateUsersV1MeMutation>
    >;
    let usersV1MeResultFixture: Either<string, apiModels.UserV1> | null;

    let renderResult: RenderHookResult<UseUserInfoResult, unknown>;

    beforeAll(() => {
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

      usersV1MeResultFixture = null;

      (
        mapUseQueryHookResult as jest.Mock<typeof mapUseQueryHookResult>
      ).mockReturnValueOnce(usersV1MeResultFixture);

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

      renderResult = renderHook(() => useUserInfo());
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call cornieApi.useGetUsersV1MeQuery()', () => {
      const expectedParams: Parameters<typeof cornieApi.useGetUsersV1MeQuery> =
        [
          {
            params: [],
          },
        ];

      expect(cornieApi.useGetUsersV1MeQuery).toHaveBeenCalledTimes(1);
      expect(cornieApi.useGetUsersV1MeQuery).toHaveBeenCalledWith(
        ...expectedParams,
      );
    });

    it('should call cornieApi.useUpdateUsersV1MeMutation', () => {
      expect(cornieApi.useUpdateUsersV1MeMutation).toHaveBeenCalledTimes(1);
      expect(cornieApi.useUpdateUsersV1MeMutation).toHaveBeenCalledWith();
    });

    it('should call mapUseQueryHookResult()', () => {
      expect(mapUseQueryHookResult).toHaveBeenCalledTimes(1);
      expect(mapUseQueryHookResult).toHaveBeenCalledWith(
        useGetUsersV1MeQueryResultMock,
      );
    });

    it('should return expected result', () => {
      const expected: UseUserInfoResult = {
        status: UserInfoStatus.fetchingUser,
        updateUser: expect.any(Function) as unknown as (
          userMeUpdateQueryV1: apiModels.UserMeUpdateQueryV1,
        ) => void,
        usersV1MeResult: usersV1MeResultFixture,
      };

      expect(renderResult.result.current).toStrictEqual(expected);
    });
  });

  describe('when called, and mapUseQueryHookResult() returns Left', () => {
    let useGetUsersV1MeQueryResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useGetUsersV1MeQuery>
    >;
    let useUpdateUsersV1MeMutationResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useUpdateUsersV1MeMutation>
    >;
    let usersV1MeResultFixture: Either<string, apiModels.UserV1> | null;

    let renderResult: RenderHookResult<UseUserInfoResult, unknown>;

    beforeAll(() => {
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

      usersV1MeResultFixture = {
        isRight: false,
        value: 'error-message-fixture',
      };

      (mapUseQueryHookResult as jest.Mock<typeof mapUseQueryHookResult>)
        .mockReturnValueOnce(usersV1MeResultFixture)
        .mockReturnValueOnce(usersV1MeResultFixture);

      (
        cornieApi.useGetUsersV1MeQuery as jest.Mock<
          typeof cornieApi.useGetUsersV1MeQuery
        >
      )
        .mockReturnValue(useGetUsersV1MeQueryResultMock)
        .mockReturnValue(useGetUsersV1MeQueryResultMock);

      (
        cornieApi.useUpdateUsersV1MeMutation as jest.Mock<
          typeof cornieApi.useUpdateUsersV1MeMutation
        >
      )
        .mockReturnValueOnce(useUpdateUsersV1MeMutationResultMock)
        .mockReturnValueOnce(useUpdateUsersV1MeMutationResultMock);

      act(() => {
        renderResult = renderHook(() => useUserInfo());
      });
    });

    afterAll(() => {
      jest.clearAllMocks();
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
      expect(mapUseQueryHookResult).toHaveBeenCalledTimes(2);
      expect(mapUseQueryHookResult).toHaveBeenCalledWith(
        useGetUsersV1MeQueryResultMock,
      );
    });

    it('should return expected result', () => {
      const expected: UseUserInfoResult = {
        status: UserInfoStatus.userFetchError,
        updateUser: expect.any(Function) as unknown as (
          userMeUpdateQueryV1: apiModels.UserMeUpdateQueryV1,
        ) => void,
        usersV1MeResult: usersV1MeResultFixture,
      };

      expect(renderResult.result.current).toStrictEqual(expected);
    });
  });

  describe('when called, and mapUseQueryHookResult() returns Right', () => {
    let useGetUsersV1MeQueryResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useGetUsersV1MeQuery>
    >;
    let useUpdateUsersV1MeMutationResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useUpdateUsersV1MeMutation>
    >;
    let usersV1MeResultFixture: Either<string, apiModels.UserV1> | null;

    let renderResult: RenderHookResult<UseUserInfoResult, unknown>;

    beforeAll(() => {
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

      usersV1MeResultFixture = {
        isRight: true,
        value: {
          active: true,
          id: 'id-fixture',
          name: 'name-fixture',
        },
      };

      (mapUseQueryHookResult as jest.Mock<typeof mapUseQueryHookResult>)
        .mockReturnValueOnce(usersV1MeResultFixture)
        .mockReturnValueOnce(usersV1MeResultFixture);

      (
        cornieApi.useGetUsersV1MeQuery as jest.Mock<
          typeof cornieApi.useGetUsersV1MeQuery
        >
      )
        .mockReturnValue(useGetUsersV1MeQueryResultMock)
        .mockReturnValue(useGetUsersV1MeQueryResultMock);

      (
        cornieApi.useUpdateUsersV1MeMutation as jest.Mock<
          typeof cornieApi.useUpdateUsersV1MeMutation
        >
      )
        .mockReturnValueOnce(useUpdateUsersV1MeMutationResultMock)
        .mockReturnValueOnce(useUpdateUsersV1MeMutationResultMock);

      act(() => {
        renderResult = renderHook(() => useUserInfo());
      });
    });

    afterAll(() => {
      jest.clearAllMocks();
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
      expect(mapUseQueryHookResult).toHaveBeenCalledTimes(2);
      expect(mapUseQueryHookResult).toHaveBeenCalledWith(
        useGetUsersV1MeQueryResultMock,
      );
    });

    it('should return expected result', () => {
      const expected: UseUserInfoResult = {
        status: UserInfoStatus.idle,
        updateUser: expect.any(Function) as unknown as (
          userMeUpdateQueryV1: apiModels.UserMeUpdateQueryV1,
        ) => void,
        usersV1MeResult: usersV1MeResultFixture,
      };

      expect(renderResult.result.current).toStrictEqual(expected);
    });
  });
});
