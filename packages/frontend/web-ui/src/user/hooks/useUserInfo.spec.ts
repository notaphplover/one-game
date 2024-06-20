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
import { Either, Right } from '../../common/models/Either';
import { UserInfoStatus } from '../models/UserInfoStatus';
import { UseUserInfoResult } from '../models/UseUserInfoResult';
import { useUserInfo } from './useUserInfo';

describe(useUserInfo.name, () => {
  describe('when called', () => {
    let useGetUsersV1MeDetailQueryResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useGetUsersV1MeDetailQuery>
    >;
    let useGetUsersV1MeQueryResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useGetUsersV1MeQuery>
    >;
    let useUpdateUsersV1MeMutationResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useUpdateUsersV1MeMutation>
    >;
    let usersV1MeDetailResultFixture: Either<
      string,
      apiModels.UserDetailV1
    > | null;
    let usersV1MeResultFixture: Either<string, apiModels.UserV1> | null;

    let renderResult: RenderHookResult<UseUserInfoResult, unknown>;

    beforeAll(() => {
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

      usersV1MeDetailResultFixture = null;

      usersV1MeResultFixture = null;

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
      ).mockReturnValueOnce(useUpdateUsersV1MeMutationResultMock);

      renderResult = renderHook(() => useUserInfo());

      jest.clearAllMocks();
    });

    describe('when updateUser is called', () => {
      let userMeUpdateQueryV1Fixture: apiModels.UserMeUpdateQueryV1;

      beforeAll(async () => {
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

      it('should call cornieApi.useGetUsersV1MeDetailQuery()', () => {
        const expectedParams: Parameters<
          typeof cornieApi.useGetUsersV1MeDetailQuery
        > = [
          {
            params: [],
          },
        ];

        expect(cornieApi.useGetUsersV1MeDetailQuery).toHaveBeenCalledTimes(1);
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
        expect(mapUseQueryHookResult).toHaveBeenCalledTimes(2);
        expect(mapUseQueryHookResult).toHaveBeenNthCalledWith(
          1,
          useGetUsersV1MeDetailQueryResultMock,
        );
        expect(mapUseQueryHookResult).toHaveBeenNthCalledWith(
          2,
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
          userDetailV1: null,
          userV1: null,
        };

        expect(renderResult.result.current).toStrictEqual(expected);
      });
    });
  });

  describe('when called, and mapUseQueryHookResult() returns null', () => {
    let useGetUsersV1MeDetailQueryResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useGetUsersV1MeDetailQuery>
    >;
    let useGetUsersV1MeQueryResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useGetUsersV1MeQuery>
    >;
    let useUpdateUsersV1MeMutationResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useUpdateUsersV1MeMutation>
    >;
    let usersV1MeDetailResultFixture: Either<
      string,
      apiModels.UserDetailV1
    > | null;
    let usersV1MeResultFixture: Either<string, apiModels.UserV1> | null;

    let renderResult: RenderHookResult<UseUserInfoResult, unknown>;

    beforeAll(() => {
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

      usersV1MeDetailResultFixture = null;

      usersV1MeResultFixture = null;

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
      ).mockReturnValueOnce(useUpdateUsersV1MeMutationResultMock);

      renderResult = renderHook(() => useUserInfo());
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

      expect(cornieApi.useGetUsersV1MeDetailQuery).toHaveBeenCalledTimes(1);
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
      expect(mapUseQueryHookResult).toHaveBeenCalledTimes(2);
      expect(mapUseQueryHookResult).toHaveBeenNthCalledWith(
        1,
        useGetUsersV1MeDetailQueryResultMock,
      );
      expect(mapUseQueryHookResult).toHaveBeenNthCalledWith(
        2,
        useGetUsersV1MeQueryResultMock,
      );
    });

    it('should return expected result', () => {
      const expected: UseUserInfoResult = {
        status: UserInfoStatus.fetchingUser,
        updateUser: expect.any(Function) as unknown as (
          userMeUpdateQueryV1: apiModels.UserMeUpdateQueryV1,
        ) => void,
        userDetailV1: null,
        userV1: null,
      };

      expect(renderResult.result.current).toStrictEqual(expected);
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
    let usersV1MeDetailResultFixture: Either<
      string,
      apiModels.UserDetailV1
    > | null;
    let usersV1MeResultFixture: Either<string, apiModels.UserV1> | null;

    let renderResult: RenderHookResult<UseUserInfoResult, unknown>;

    beforeAll(() => {
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
      expect(mapUseQueryHookResult).toHaveBeenNthCalledWith(
        1,
        useGetUsersV1MeDetailQueryResultMock,
      );
      expect(mapUseQueryHookResult).toHaveBeenNthCalledWith(
        2,
        useGetUsersV1MeQueryResultMock,
      );
      expect(mapUseQueryHookResult).toHaveBeenNthCalledWith(
        3,
        useGetUsersV1MeDetailQueryResultMock,
      );
      expect(mapUseQueryHookResult).toHaveBeenNthCalledWith(
        4,
        useGetUsersV1MeQueryResultMock,
      );
    });

    it('should return expected result', () => {
      const expected: UseUserInfoResult = {
        status: UserInfoStatus.userFetchError,
        updateUser: expect.any(Function) as unknown as (
          userMeUpdateQueryV1: apiModels.UserMeUpdateQueryV1,
        ) => void,
        userDetailV1: null,
        userV1: null,
      };

      expect(renderResult.result.current).toStrictEqual(expected);
    });
  });

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
    let usersV1MeResultFixture: Right<apiModels.UserV1>;

    let renderResult: RenderHookResult<UseUserInfoResult, unknown>;

    beforeAll(() => {
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
          email: 'email-fixture',
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
        .mockReturnValueOnce(usersV1MeResultFixture)
        .mockReturnValueOnce(usersV1MeDetailResultFixture)
        .mockReturnValueOnce(usersV1MeResultFixture);

      (
        cornieApi.useGetUsersV1MeQuery as jest.Mock<
          typeof cornieApi.useGetUsersV1MeQuery
        >
      ).mockReturnValue(useGetUsersV1MeQueryResultMock);

      (
        cornieApi.useGetUsersV1MeDetailQuery as jest.Mock<
          typeof cornieApi.useGetUsersV1MeDetailQuery
        >
      ).mockReturnValue(useGetUsersV1MeDetailQueryResultMock);

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
      expect(mapUseQueryHookResult).toHaveBeenNthCalledWith(
        1,
        useGetUsersV1MeDetailQueryResultMock,
      );
      expect(mapUseQueryHookResult).toHaveBeenNthCalledWith(
        2,
        useGetUsersV1MeQueryResultMock,
      );
      expect(mapUseQueryHookResult).toHaveBeenNthCalledWith(
        3,
        useGetUsersV1MeDetailQueryResultMock,
      );
      expect(mapUseQueryHookResult).toHaveBeenNthCalledWith(
        4,
        useGetUsersV1MeQueryResultMock,
      );
    });

    it('should return expected result', () => {
      const expected: UseUserInfoResult = {
        status: UserInfoStatus.idle,
        updateUser: expect.any(Function) as unknown as (
          userMeUpdateQueryV1: apiModels.UserMeUpdateQueryV1,
        ) => void,
        userDetailV1: usersV1MeDetailResultFixture.value,
        userV1: usersV1MeResultFixture.value,
      };

      expect(renderResult.result.current).toStrictEqual(expected);
    });
  });
});
