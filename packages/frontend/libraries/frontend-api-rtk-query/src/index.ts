import { HttpClient } from '@cornie-js/api-http-client';
import { models as apiModels } from '@cornie-js/api-models';
import {
  BaseQueryFn,
  createApi,
  EndpointBuilder,
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
import { GetGamesGameIdSpecsV1Args } from './games/models/GetGamesGameIdSpecsV1Args';
import { GetGamesSpecsV1Args } from './games/models/GetGamesSpecsV1Args';
import { GetGamesV1Args } from './games/models/GetGamesV1Args';
import { GetGamesV1GameIdArgs } from './games/models/GetGamesV1GameIdArgs';
import { GetGamesV1GameIdSlotsSlotIdCardsArgs } from './games/models/GetGamesV1GameIdSlotsSlotIdCardsArgs';
import { GetGamesV1MineArgs } from './games/models/GetGamesV1MineArgs';
import { UpdateGameV1Args } from './games/models/UpdateGameV1Args';
import { createGamesV1 } from './games/mutations/createGamesV1';
import { createGamesV1Slots } from './games/mutations/createGamesV1Slots';
import { updateGameV1 } from './games/mutations/updateGameV1';
import { getGamesGameIdSpecsV1 } from './games/queries/getGamesGameIdSpecsV1';
import { getGamesSpecsV1 } from './games/queries/getGamesSpecsV1';
import { getGamesV1 } from './games/queries/getGamesV1';
import { getGamesV1GameId } from './games/queries/getGamesV1GameId';
import { getGamesV1GameIdSlotsSlotIdCards } from './games/queries/getGamesV1GameIdSlotsSlotIdCards';
import { getGamesV1Mine } from './games/queries/getGamesV1Mine';
import { CreateUsersV1Args } from './users/models/CreateUsersV1Args';
import { CreateUsersV1EmailCodeArgs } from './users/models/CreateUsersV1EmailCodeArgs';
import { DeleteUsersV1EmailCodeArgs } from './users/models/DeleteUsersV1EmailCodeArgs';
import { GetUsersV1MeArgs } from './users/models/GetUsersV1MeArgs';
import { GetUserV1Args } from './users/models/GetUserV1Args';
import { UpdateUsersV1MeArgs } from './users/models/UpdateUsersV1MeArgs';
import { createUsersV1 } from './users/mutations/createUsersV1';
import { createUsersV1EmailCode } from './users/mutations/createUsersV1EmailCode';
import { deleteUsersV1EmailCode } from './users/mutations/deleteUsersV1EmailCode';
import { updateUsersV1Me } from './users/mutations/updateUsersV1Me';
import { getUsersV1Me } from './users/queries/getUsersV1Me';
import { getUsersV1MeDetail } from './users/queries/getUsersV1MeDetail';
import { getUserV1 } from './users/queries/getUserV1';

export type {
  CreateAuthV2Args,
  CreateGamesV1Args,
  CreateGamesV1SlotsArgs,
  CreateUsersV1Args,
  CreateUsersV1EmailCodeArgs,
  DeleteUsersV1EmailCodeArgs,
  GetGamesGameIdSpecsV1Args,
  GetGamesSpecsV1Args,
  GetGamesV1Args,
  GetGamesV1GameIdArgs,
  GetGamesV1GameIdSlotsSlotIdCardsArgs,
  GetGamesV1MineArgs,
  GetUsersV1MeArgs,
  GetUserV1Args,
  SerializableAppError,
  UpdateGameV1Args,
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
      deleteUsersV1EmailCode: build.mutation<
        undefined,
        DeleteUsersV1EmailCodeArgs
      >({
        queryFn: deleteUsersV1EmailCode(options.httpClient),
      }),
      getGamesGameIdSpecsV1: build.query<
        apiModels.GameSpecV1,
        GetGamesGameIdSpecsV1Args
      >({
        queryFn: authorizedApiCall(
          getGamesGameIdSpecsV1(options.httpClient),
          authorizedEndpointsOptions,
        ),
      }),
      getGamesSpecsV1: build.query<
        apiModels.GameSpecArrayV1,
        GetGamesSpecsV1Args
      >({
        queryFn: authorizedApiCall(
          getGamesSpecsV1(options.httpClient),
          authorizedEndpointsOptions,
        ),
      }),
      getGamesV1: build.query<apiModels.GameArrayV1, GetGamesV1Args>({
        queryFn: authorizedApiCall(
          getGamesV1(options.httpClient),
          authorizedEndpointsOptions,
        ),
      }),
      getGamesV1GameId: build.query<
        apiModels.GameV1 | undefined,
        GetGamesV1GameIdArgs
      >({
        queryFn: authorizedApiCall(
          getGamesV1GameId(options.httpClient),
          authorizedEndpointsOptions,
        ),
      }),
      getGamesV1GameIdSlotsSlotIdCards: build.query<
        apiModels.CardArrayV1,
        GetGamesV1GameIdSlotsSlotIdCardsArgs
      >({
        queryFn: authorizedApiCall(
          getGamesV1GameIdSlotsSlotIdCards(options.httpClient),
          authorizedEndpointsOptions,
        ),
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
      getUserV1: build.query<apiModels.UserV1 | undefined, GetUserV1Args>({
        queryFn: authorizedApiCall(
          getUserV1(options.httpClient),
          authorizedEndpointsOptions,
        ),
      }),
      updateGameV1: build.mutation<apiModels.GameV1, UpdateGameV1Args>({
        queryFn: authorizedApiCall(
          updateGameV1(options.httpClient),
          authorizedEndpointsOptions,
        ),
      }),
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
