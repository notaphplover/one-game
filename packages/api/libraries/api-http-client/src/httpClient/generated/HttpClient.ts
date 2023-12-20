/* eslint-disable */
/*
 * This file was automatically generated by the api http client generation script.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source OpenAPI schema file and run
 * the generation script to regenerate this file.
 */
import { models as apiModels } from '@cornie-js/api-models';
import { AxiosHttpClient } from '../axios/AxiosHttpClient';
import { Response } from '../models/Response';
export class HttpClient {
  readonly #axiosHttpClient: AxiosHttpClient;
  constructor(baseUrl: string) {
    this.#axiosHttpClient = new AxiosHttpClient(baseUrl);
  }
  public async createAuth(
    headers: {
      [key: string]: string;
    },
    body: apiModels.AuthCreateQueryV1,
  ): Promise<
    | Response<Record<string, string>, apiModels.AuthV1, 200>
    | Response<Record<string, string>, apiModels.ErrorV1, 400>
    | Response<Record<string, string>, apiModels.ErrorV1, 401>
  > {
    return this.#axiosHttpClient.callEndpoint(
      'POST',
      '/v1/auth',
      headers,
      undefined,
      undefined,
      body,
    );
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
    return this.#axiosHttpClient.callEndpoint(
      'POST',
      '/v1/games',
      headers,
      undefined,
      undefined,
      body,
    );
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
    return this.#axiosHttpClient.callEndpoint(
      'GET',
      '/v1/games/mine',
      headers,
      query,
      undefined,
      undefined,
    );
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
    return this.#axiosHttpClient.callEndpoint(
      'GET',
      '/v1/games/{gameId}',
      headers,
      undefined,
      url,
      undefined,
    );
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
    | Response<Record<string, string>, apiModels.ErrorV1, 401>
    | Response<Record<string, string>, apiModels.ErrorV1, 403>
    | Response<Record<string, string>, apiModels.ErrorV1, 404>
  > {
    return this.#axiosHttpClient.callEndpoint(
      'PATCH',
      '/v1/games/{gameId}',
      headers,
      undefined,
      url,
      body,
    );
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
    return this.#axiosHttpClient.callEndpoint(
      'GET',
      '/v1/games/{gameId}/specs',
      headers,
      undefined,
      url,
      undefined,
    );
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
    return this.#axiosHttpClient.callEndpoint(
      'GET',
      '/v1/games/specs',
      headers,
      query,
      undefined,
      undefined,
    );
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
    return this.#axiosHttpClient.callEndpoint(
      'POST',
      '/v1/games/{gameId}/slots',
      headers,
      undefined,
      url,
      body,
    );
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
    return this.#axiosHttpClient.callEndpoint(
      'GET',
      '/v1/games/{gameId}/slots/{gameSlotIndex}/cards',
      headers,
      undefined,
      url,
      undefined,
    );
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
    return this.#axiosHttpClient.callEndpoint(
      'POST',
      '/v1/users',
      headers,
      undefined,
      undefined,
      body,
    );
  }
  public async deleteUserByEmailCode(headers: {
    [key: string]: string;
  }): Promise<
    | Response<Record<string, string>, undefined, 200>
    | Response<Record<string, string>, apiModels.ErrorV1, 422>
  > {
    return this.#axiosHttpClient.callEndpoint(
      'DELETE',
      '/v1/users/email/{email}/code',
      headers,
      undefined,
      undefined,
      undefined,
    );
  }
  public async createUserByEmailCode(headers: {
    [key: string]: string;
  }): Promise<
    | Response<Record<string, string>, undefined, 201>
    | Response<Record<string, string>, apiModels.ErrorV1, 422>
  > {
    return this.#axiosHttpClient.callEndpoint(
      'POST',
      '/v1/users/email/{email}/code',
      headers,
      undefined,
      undefined,
      undefined,
    );
  }
  public async deleteUserMe(headers: {
    [key: string]: string;
  }): Promise<
    | Response<Record<string, string>, undefined, 200>
    | Response<Record<string, string>, apiModels.ErrorV1, 401>
  > {
    return this.#axiosHttpClient.callEndpoint(
      'DELETE',
      '/v1/users/me',
      headers,
      undefined,
      undefined,
      undefined,
    );
  }
  public async getUserMe(headers: {
    [key: string]: string;
  }): Promise<
    | Response<Record<string, string>, apiModels.UserV1, 200>
    | Response<Record<string, string>, apiModels.ErrorV1, 401>
    | Response<Record<string, string>, apiModels.ErrorV1, 403>
  > {
    return this.#axiosHttpClient.callEndpoint(
      'GET',
      '/v1/users/me',
      headers,
      undefined,
      undefined,
      undefined,
    );
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
    return this.#axiosHttpClient.callEndpoint(
      'PATCH',
      '/v1/users/me',
      headers,
      undefined,
      undefined,
      body,
    );
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
    return this.#axiosHttpClient.callEndpoint(
      'GET',
      '/v1/users/{userId}',
      headers,
      undefined,
      url,
      undefined,
    );
  }
}
