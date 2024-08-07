import { HttpClient } from '@cornie-js/api-http-client';
import { models as apiModels } from '@cornie-js/api-models';
import {
  BaseQueryFn,
  EndpointBuilder,
  createApi,
  fakeBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';

import { authorizedApiCall } from './auth/actions/authorizedApiCall';
import { AuthorizedEndpointsOptions } from './auth/models/AuthorizedEndpointsOptions';
import { CreateAuthV2Args } from './auth/models/CreateAuthV2Args';
import { createAuthV2 } from './auth/mutations/createAuthV2';
import { ApiTag } from './common/models/ApiTag';
import { SerializableAppError } from './foundation/error/SerializableAppError';
import { QueryReturnValue } from './foundation/http/models/QueryReturnValue';
import { CreateGamesV1Args } from './games/models/CreateGamesV1Args';
import { CreateGamesV1SlotsArgs } from './games/models/CreateGamesV1SlotsArgs';
import { GetGamesV1MineArgs } from './games/models/GetGamesV1MineArgs';
import { createGamesV1 } from './games/mutations/createGamesV1';
import { createGamesV1Slots } from './games/mutations/createGamesV1Slots';
import { getGamesV1Mine } from './games/queries/getGamesV1Mine';
import { CreateUsersV1Args } from './users/models/CreateUsersV1Args';
import { CreateUsersV1EmailCodeArgs } from './users/models/CreateUsersV1EmailCodeArgs';
import { GetUsersV1MeArgs } from './users/models/GetUsersV1MeArgs';
import { UpdateUsersV1MeArgs } from './users/models/UpdateUsersV1MeArgs';
import { createUsersV1 } from './users/mutations/createUsersV1';
import { createUsersV1EmailCode } from './users/mutations/createUsersV1EmailCode';
import { updateUsersV1Me } from './users/mutations/updateUsersV1Me';
import { getUsersV1Me } from './users/queries/getUsersV1Me';
import { getUsersV1MeDetail } from './users/queries/getUsersV1MeDetail';

export type {
  CreateAuthV2Args,
  CreateUsersV1Args,
  CreateUsersV1EmailCodeArgs,
  GetUsersV1MeArgs,
  SerializableAppError,
  UpdateUsersV1MeArgs,
};

export { ApiTag };

export interface BuildApiOptions<TState> {
  httpClient: HttpClient;
  store: {
    login: (auth: apiModels.AuthV2) => {
      payload: apiModels.AuthV2;
      type: string;
    };
    logout: () => {
      payload: undefined;
      type: string;
    };
    selectAccessToken: (state: TState) => string | null;
    selectRefreshToken: (state: TState) => string | null;
  };
}

export function buildApi<TState>(options: BuildApiOptions<TState>) {
  const createAuthV2Fn: (
    args: CreateAuthV2Args,
  ) => Promise<
    QueryReturnValue<apiModels.AuthV2, SerializableAppError, never>
  > = createAuthV2(options.httpClient);

  const authorizedEndpointsOptions: AuthorizedEndpointsOptions<TState> = {
    createAuthV2: createAuthV2Fn,
    login: options.store.login,
    logout: options.store.logout,
    mutex: new Mutex(),
    selectAccessToken: options.store.selectAccessToken,
    selectRefreshToken: options.store.selectRefreshToken,
  };

  // eslint-disable-next-line @typescript-eslint/typedef
  const api = createApi({
    baseQuery: fakeBaseQuery<SerializableAppError>(),
    endpoints: (
      build: EndpointBuilder<
        BaseQueryFn<void, symbol, SerializableAppError>,
        ApiTag,
        'api'
      >,
    ) => ({
      createAuthV2: build.mutation<apiModels.AuthV2, CreateAuthV2Args>({
        queryFn: createAuthV2Fn,
      }),
      createGamesV1: build.mutation<
        apiModels.NonStartedGameV1,
        CreateGamesV1Args
      >({
        queryFn: authorizedApiCall(
          createGamesV1(options.httpClient),
          authorizedEndpointsOptions,
        ),
      }),
      createGamesV1Slots: build.mutation<
        apiModels.NonStartedGameSlotV1,
        CreateGamesV1SlotsArgs
      >({
        queryFn: authorizedApiCall(
          createGamesV1Slots(options.httpClient),
          authorizedEndpointsOptions,
        ),
      }),
      createUsersV1: build.mutation<apiModels.UserV1, CreateUsersV1Args>({
        queryFn: createUsersV1(options.httpClient),
      }),
      createUsersV1EmailCode: build.mutation<
        undefined,
        CreateUsersV1EmailCodeArgs
      >({
        queryFn: createUsersV1EmailCode(options.httpClient),
      }),
      getGamesV1Mine: build.query<apiModels.GameArrayV1, GetGamesV1MineArgs>({
        queryFn: authorizedApiCall(
          getGamesV1Mine(options.httpClient),
          authorizedEndpointsOptions,
        ),
      }),
      getUsersV1Me: build.query<apiModels.UserV1, GetUsersV1MeArgs>({
        providesTags: (result: apiModels.UserV1 | undefined) =>
          result === undefined
            ? [ApiTag.users]
            : [ApiTag.users, { id: result.id, type: ApiTag.users }],
        queryFn: authorizedApiCall(
          getUsersV1Me(options.httpClient),
          authorizedEndpointsOptions,
        ),
      }),
      getUsersV1MeDetail: build.query<apiModels.UserDetailV1, GetUsersV1MeArgs>(
        {
          queryFn: authorizedApiCall(
            getUsersV1MeDetail(options.httpClient),
            authorizedEndpointsOptions,
          ),
        },
      ),
      updateUsersV1Me: build.mutation<apiModels.UserV1, UpdateUsersV1MeArgs>({
        invalidatesTags: (result: apiModels.UserV1 | undefined) =>
          result === undefined ? [] : [{ id: result.id, type: ApiTag.users }],
        queryFn: authorizedApiCall(
          updateUsersV1Me(options.httpClient),
          authorizedEndpointsOptions,
        ),
      }),
    }),
    tagTypes: Object.values(ApiTag),
  });

  return api;
}
