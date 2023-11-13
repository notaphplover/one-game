/* eslint-disable @typescript-eslint/no-magic-numbers */

import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { HttpClient } from '@cornie-js/api-http-client';
import { models as apiModels } from '@cornie-js/api-models';
import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import { Request } from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

import { GameGraphQlFromGameV1Builder } from '../builders/GameGraphQlFromGameV1Builder';

interface GetGamesMineQueryArgs extends Record<string, string | string[]> {
  status?: string | string[];
  page?: string | string[];
  pageSize?: string | string[];
}

@Injectable()
export class GameQueryResolver
  implements graphqlModels.GameQueryResolvers<Request>
{
  readonly #gameGraphQlFromGameV1Builder: Builder<
    graphqlModels.Game,
    [apiModels.GameV1]
  >;
  readonly #httpClient: HttpClient;

  constructor(
    @Inject(GameGraphQlFromGameV1Builder)
    gameGraphQlFromGameV1Builder: Builder<
      graphqlModels.Game,
      [apiModels.GameV1]
    >,
    @Inject(HttpClient) httpClient: HttpClient,
  ) {
    this.#gameGraphQlFromGameV1Builder = gameGraphQlFromGameV1Builder;
    this.#httpClient = httpClient;
  }

  public async myGames(
    _: unknown,
    args: Partial<graphqlModels.GameQueryMyGamesArgs>,
    request: Request,
  ): Promise<graphqlModels.Game[]> {
    const httpResponse: Awaited<ReturnType<HttpClient['getGamesMine']>> =
      await this.#httpClient.getGamesMine(
        request.headers,
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
