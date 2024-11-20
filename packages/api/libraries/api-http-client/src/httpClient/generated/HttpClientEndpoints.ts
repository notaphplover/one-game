/* eslint-disable */
/*
 * This file was automatically generated by the api http client generation script.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source OpenAPI schema file and run
 * the generation script to regenerate this file.
 */
import { models as apiModels } from '@cornie-js/api-models';
import { InternalHttpClient } from '../internal/InternalHttpClient';
import { Response } from '../models/Response';
export class HttpClientEndpoints {
  readonly #internalHttpClient: InternalHttpClient;
  constructor(internalHttpClient: InternalHttpClient) {
    this.#internalHttpClient = internalHttpClient;
  }
  public async getGames(
    headers: {
      [key: string]: string;
    },
    query: {
      [key: string]: string | string[];
      isPublic?: string | string[];
      status?: string | string[];
      page?: string | string[];
      pageSize?: string | string[];
    },
  ): Promise<
    | Response<Record<string, string>, apiModels.GameArrayV1, 200>
    | Response<Record<string, string>, apiModels.ErrorV1, 400>
    | Response<Record<string, string>, apiModels.ErrorV1, 401>
    | Response<Record<string, string>, apiModels.ErrorV1, 403>
  > {
    return this.#internalHttpClient.callEndpoint({
      body: undefined,
      headers: headers,
      method: 'GET',
      path: '/v1/games',
      queryParams: query,
      urlParameters: undefined,
    });
  }
  public async createGame(
    headers: {
      [key: string]: string;
    },
    body: apiModels.GameCreateQueryV1,
  ): Promise<
    | Response<Record<string, string>, apiModels.NonStartedGameV1, 200>
    | Response<Record<string, string>, apiModels.ErrorV1, 400>
    | Response<Record<string, string>, apiModels.ErrorV1, 401>
    | Response<Record<string, string>, apiModels.ErrorV1, 403>
  > {
    return this.#internalHttpClient.callEndpoint({
      body: body,
      headers: headers,
      method: 'POST',
      path: '/v1/games',
      queryParams: undefined,
      urlParameters: undefined,
    });
  }
  public async getGamesMine(
    headers: {
      [key: string]: string;
    },
    query: {
      [key: string]: string | string[];
      status?: string | string[];
      page?: string | string[];
      pageSize?: string | string[];
    },
  ): Promise<
    | Response<Record<string, string>, apiModels.GameArrayV1, 200>
    | Response<Record<string, string>, apiModels.ErrorV1, 400>
    | Response<Record<string, string>, apiModels.ErrorV1, 401>
  > {
    return this.#internalHttpClient.callEndpoint({
      body: undefined,
      headers: headers,
      method: 'GET',
      path: '/v1/games/mine',
      queryParams: query,
      urlParameters: undefined,
    });
  }
  public async getGame(
    headers: {
      [key: string]: string;
    },
    url: {
      [key: string]: string;
      gameId: string;
    },
  ): Promise<
    | Response<Record<string, string>, apiModels.GameV1, 200>
    | Response<Record<string, string>, apiModels.ErrorV1, 401>
    | Response<Record<string, string>, apiModels.ErrorV1, 403>
    | Response<Record<string, string>, apiModels.ErrorV1, 404>
  > {
    return this.#internalHttpClient.callEndpoint({
      body: undefined,
      headers: headers,
      method: 'GET',
      path: '/v1/games/{gameId}',
      queryParams: undefined,
      urlParameters: url,
    });
  }
  public async updateGame(
    headers: {
      [key: string]: string;
    },
    url: {
      [key: string]: string;
      gameId: string;
    },
    body: apiModels.GameIdUpdateQueryV1,
  ): Promise<
    | Response<Record<string, string>, apiModels.GameV1, 200>
    | Response<Record<string, string>, apiModels.ErrorV1, 400>
    | Response<Record<string, string>, apiModels.ErrorV1, 401>
    | Response<Record<string, string>, apiModels.ErrorV1, 403>
    | Response<Record<string, string>, apiModels.ErrorV1, 404>
    | Response<Record<string, string>, apiModels.ErrorV1, 422>
  > {
    return this.#internalHttpClient.callEndpoint({
      body: body,
      headers: headers,
      method: 'PATCH',
      path: '/v1/games/{gameId}',
      queryParams: undefined,
      urlParameters: url,
    });
  }
  public async getGameGameIdSpec(
    headers: {
      [key: string]: string;
    },
    url: {
      [key: string]: string;
      gameId: string;
    },
  ): Promise<
    | Response<Record<string, string>, apiModels.GameSpecV1, 200>
    | Response<Record<string, string>, apiModels.ErrorV1, 401>
    | Response<Record<string, string>, apiModels.ErrorV1, 403>
    | Response<Record<string, string>, apiModels.ErrorV1, 404>
  > {
    return this.#internalHttpClient.callEndpoint({
      body: undefined,
      headers: headers,
      method: 'GET',
      path: '/v1/games/{gameId}/specs',
      queryParams: undefined,
      urlParameters: url,
    });
  }
  public async getGamesSpecs(
    headers: {
      [key: string]: string;
    },
    query: {
      [key: string]: string | string[];
      gameId?: string | string[];
      page?: string | string[];
      pageSize?: string | string[];
      sort?: string | string[];
    },
  ): Promise<
    | Response<Record<string, string>, apiModels.GameSpecArrayV1, 200>
    | Response<Record<string, string>, apiModels.ErrorV1, 401>
    | Response<Record<string, string>, apiModels.ErrorV1, 403>
  > {
    return this.#internalHttpClient.callEndpoint({
      body: undefined,
      headers: headers,
      method: 'GET',
      path: '/v1/games/specs',
      queryParams: query,
      urlParameters: undefined,
    });
  }
  public async createGameSlot(
    headers: {
      [key: string]: string;
    },
    url: {
      [key: string]: string;
      gameId: string;
    },
    body: apiModels.GameIdSlotCreateQueryV1,
  ): Promise<
    | Response<Record<string, string>, apiModels.GameSlotV1, 200>
    | Response<Record<string, string>, apiModels.ErrorV1, 400>
    | Response<Record<string, string>, apiModels.ErrorV1, 401>
    | Response<Record<string, string>, apiModels.ErrorV1, 403>
    | Response<Record<string, string>, apiModels.ErrorV1, 409>
    | Response<Record<string, string>, apiModels.ErrorV1, 422>
  > {
    return this.#internalHttpClient.callEndpoint({
      body: body,
      headers: headers,
      method: 'POST',
      path: '/v1/games/{gameId}/slots',
      queryParams: undefined,
      urlParameters: url,
    });
  }
  public async getGameSlotCards(
    headers: {
      [key: string]: string;
    },
    url: {
      [key: string]: string;
      gameId: string;
      gameSlotIndex: string;
    },
  ): Promise<
    | Response<Record<string, string>, apiModels.CardArrayV1, 200>
    | Response<Record<string, string>, apiModels.ErrorV1, 401>
    | Response<Record<string, string>, apiModels.ErrorV1, 403>
    | Response<Record<string, string>, apiModels.ErrorV1, 422>
  > {
    return this.#internalHttpClient.callEndpoint({
      body: undefined,
      headers: headers,
      method: 'GET',
      path: '/v1/games/{gameId}/slots/{gameSlotIndex}/cards',
      queryParams: undefined,
      urlParameters: url,
    });
  }
  public async createUser(
    headers: {
      [key: string]: string;
    },
    body: apiModels.UserCreateQueryV1,
  ): Promise<
    | Response<Record<string, string>, apiModels.UserV1, 200>
    | Response<Record<string, string>, apiModels.ErrorV1, 400>
    | Response<Record<string, string>, apiModels.ErrorV1, 409>
  > {
    return this.#internalHttpClient.callEndpoint({
      body: body,
      headers: headers,
      method: 'POST',
      path: '/v1/users',
      queryParams: undefined,
      urlParameters: undefined,
    });
  }
  public async deleteUserByEmailCode(
    headers: {
      [key: string]: string;
    },
    url: {
      [key: string]: string;
      email: string;
    },
  ): Promise<
    | Response<Record<string, string>, undefined, 200>
    | Response<Record<string, string>, apiModels.ErrorV1, 422>
  > {
    return this.#internalHttpClient.callEndpoint({
      body: undefined,
      headers: headers,
      method: 'DELETE',
      path: '/v1/users/email/{email}/code',
      queryParams: undefined,
      urlParameters: url,
    });
  }
  public async createUserByEmailCode(
    headers: {
      [key: string]: string;
    },
    url: {
      [key: string]: string;
      email: string;
    },
    body: apiModels.UserCodeCreateQueryV1 | undefined,
  ): Promise<
    | Response<Record<string, string>, undefined, 201>
    | Response<Record<string, string>, apiModels.ErrorV1, 409>
    | Response<Record<string, string>, apiModels.ErrorV1, 422>
  > {
    return this.#internalHttpClient.callEndpoint({
      body: body,
      headers: headers,
      method: 'POST',
      path: '/v1/users/email/{email}/code',
      queryParams: undefined,
      urlParameters: url,
    });
  }
  public async deleteUserMe(headers: {
    [key: string]: string;
  }): Promise<
    | Response<Record<string, string>, undefined, 200>
    | Response<Record<string, string>, apiModels.ErrorV1, 401>
  > {
    return this.#internalHttpClient.callEndpoint({
      body: undefined,
      headers: headers,
      method: 'DELETE',
      path: '/v1/users/me',
      queryParams: undefined,
      urlParameters: undefined,
    });
  }
  public async getUserMe(headers: {
    [key: string]: string;
  }): Promise<
    | Response<Record<string, string>, apiModels.UserV1, 200>
    | Response<Record<string, string>, apiModels.ErrorV1, 401>
    | Response<Record<string, string>, apiModels.ErrorV1, 403>
  > {
    return this.#internalHttpClient.callEndpoint({
      body: undefined,
      headers: headers,
      method: 'GET',
      path: '/v1/users/me',
      queryParams: undefined,
      urlParameters: undefined,
    });
  }
  public async updateUserMe(
    headers: {
      [key: string]: string;
    },
    body: apiModels.UserMeUpdateQueryV1,
  ): Promise<
    | Response<Record<string, string>, apiModels.UserV1, 200>
    | Response<Record<string, string>, apiModels.ErrorV1, 401>
    | Response<Record<string, string>, apiModels.ErrorV1, 403>
  > {
    return this.#internalHttpClient.callEndpoint({
      body: body,
      headers: headers,
      method: 'PATCH',
      path: '/v1/users/me',
      queryParams: undefined,
      urlParameters: undefined,
    });
  }
  public async getUserMeDetail(headers: {
    [key: string]: string;
  }): Promise<
    | Response<Record<string, string>, apiModels.UserDetailV1, 200>
    | Response<Record<string, string>, apiModels.ErrorV1, 401>
    | Response<Record<string, string>, apiModels.ErrorV1, 403>
  > {
    return this.#internalHttpClient.callEndpoint({
      body: undefined,
      headers: headers,
      method: 'GET',
      path: '/v1/users/me/detail',
      queryParams: undefined,
      urlParameters: undefined,
    });
  }
  public async getUser(
    headers: {
      [key: string]: string;
    },
    url: {
      [key: string]: string;
      userId: string;
    },
  ): Promise<
    | Response<Record<string, string>, apiModels.UserV1, 200>
    | Response<Record<string, string>, apiModels.ErrorV1, 401>
    | Response<Record<string, string>, apiModels.ErrorV1, 404>
  > {
    return this.#internalHttpClient.callEndpoint({
      body: undefined,
      headers: headers,
      method: 'GET',
      path: '/v1/users/{userId}',
      queryParams: undefined,
      urlParameters: url,
    });
  }
  public async createAuthV2(
    headers: {
      [key: string]: string;
    },
    body: apiModels.AuthCreateQueryV2 | undefined,
  ): Promise<
    | Response<Record<string, string>, apiModels.AuthV2, 200>
    | Response<Record<string, string>, apiModels.ErrorV1, 400>
    | Response<Record<string, string>, apiModels.ErrorV1, 401>
  > {
    return this.#internalHttpClient.callEndpoint({
      body: body,
      headers: headers,
      method: 'POST',
      path: '/v2/auth',
      queryParams: undefined,
      urlParameters: undefined,
    });
  }
  public async getGameEventsV2(
    headers: {
      [key: string]: string;
    },
    url: {
      [key: string]: string;
      gameId: string;
    },
  ): Promise<
    | Response<Record<string, string>, unknown, 200>
    | Response<Record<string, string>, apiModels.ErrorV1, 401>
  > {
    return this.#internalHttpClient.callEndpoint({
      body: undefined,
      headers: headers,
      method: 'GET',
      path: '/v2/events/games/{gameId}',
      queryParams: undefined,
      urlParameters: url,
    });
  }
}
