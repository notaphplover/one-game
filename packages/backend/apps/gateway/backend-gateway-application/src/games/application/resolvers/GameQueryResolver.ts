/* eslint-disable @typescript-eslint/no-magic-numbers */

import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { HttpClient, HttpClientEndpoints } from '@cornie-js/api-http-client';
import { models as apiModels } from '@cornie-js/api-models';
import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import { Inject, Injectable } from '@nestjs/common';

import { CanonicalResolver } from '../../../foundation/graphql/application/models/CanonicalResolver';
import { Context } from '../../../foundation/graphql/application/models/Context';
import { GameGraphQlFromGameV1Builder } from '../builders/GameGraphQlFromGameV1Builder';

interface GetGamesMineQueryArgs extends Record<string, string | string[]> {
  status?: string | string[];
  page?: string | string[];
  pageSize?: string | string[];
}

@Injectable()
export class GameQueryResolver
  implements CanonicalResolver<graphqlModels.GameQueryResolvers<Context>>
{
  readonly #gameGraphQlFromGameV1Builder: Builder<
    Partial<graphqlModels.Game>,
    [apiModels.GameV1]
  >;
  readonly #httpClient: HttpClient;

  constructor(
    @Inject(GameGraphQlFromGameV1Builder)
    gameGraphQlFromGameV1Builder: Builder<
      Partial<graphqlModels.Game>,
      [apiModels.GameV1]
    >,
    @Inject(HttpClient) httpClient: HttpClient,
  ) {
    this.#gameGraphQlFromGameV1Builder = gameGraphQlFromGameV1Builder;
    this.#httpClient = httpClient;
  }

  public async gameById(
    _: unknown,
    args: graphqlModels.GameQueryGameByIdArgs,
    context: Context,
  ): Promise<Partial<graphqlModels.Game> | null> {
    const httpResponse: Awaited<ReturnType<HttpClientEndpoints['getGame']>> =
      await this.#httpClient.endpoints.getGame(context.request.headers, {
        gameId: args.id,
      });

    switch (httpResponse.statusCode) {
      case 200:
        return this.#gameGraphQlFromGameV1Builder.build(httpResponse.body);
      case 401:
        throw new AppError(
          AppErrorKind.missingCredentials,
          httpResponse.body.description,
        );
      case 403:
        throw new AppError(
          AppErrorKind.invalidCredentials,
          httpResponse.body.description,
        );
      case 404:
        return null;
    }
  }

  public async myGames(
    _: unknown,
    args: Partial<graphqlModels.GameQueryMyGamesArgs>,
    context: Context,
  ): Promise<Partial<graphqlModels.Game>[]> {
    const httpResponse: Awaited<
      ReturnType<HttpClientEndpoints['getGamesMine']>
    > = await this.#httpClient.endpoints.getGamesMine(
      context.request.headers,
      this.#buildGetGamesMineQuery(args),
    );

    switch (httpResponse.statusCode) {
      case 200:
        return httpResponse.body.map((gameV1: apiModels.GameV1) =>
          this.#gameGraphQlFromGameV1Builder.build(gameV1),
        );
      case 400:
        throw new AppError(
          AppErrorKind.contractViolation,
          httpResponse.body.description,
        );
      case 401:
        throw new AppError(
          AppErrorKind.missingCredentials,
          httpResponse.body.description,
        );
    }
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public __resolveType(): never {
    throw new Error('Method not implemented');
  }

  #buildGetGamesMineQuery(
    args: Partial<graphqlModels.GameQueryMyGamesArgs>,
  ): GetGamesMineQueryArgs {
    const getGamesMineQueryArgs: GetGamesMineQueryArgs = {};

    if (args.findMyGamesInput != undefined) {
      if (args.findMyGamesInput.page !== null) {
        getGamesMineQueryArgs.page = args.findMyGamesInput.page.toString();
      }

      if (args.findMyGamesInput.pageSize !== null) {
        getGamesMineQueryArgs.pageSize =
          args.findMyGamesInput.pageSize.toString();
      }

      if (args.findMyGamesInput.status !== null) {
        getGamesMineQueryArgs.status = args.findMyGamesInput.status;
      }
    }

    return getGamesMineQueryArgs;
  }
}
