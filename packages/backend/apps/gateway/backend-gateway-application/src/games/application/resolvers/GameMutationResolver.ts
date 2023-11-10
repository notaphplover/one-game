/* eslint-disable @typescript-eslint/no-magic-numbers */
import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { HttpClient } from '@cornie-js/api-http-client';
import { models as apiModels } from '@cornie-js/api-models';
import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import { Request } from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

import { GameGraphQlFromGameV1Builder } from '../builders/GameGraphQlFromGameV1Builder';

@Injectable()
export class GameMutationResolver
  implements graphqlModels.GameMutationResolvers<Request>
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

  public async createGame(
    _: unknown,
    args: graphqlModels.GameMutationCreateGameArgs,
    request: Request,
  ): Promise<graphqlModels.Game> {
    const gameCreateQuery: apiModels.GameCreateQueryV1 = {
      gameSlotsAmount: args.gameCreateInput.gameSlotsAmount,
      options: {
        ...args.gameCreateInput.options,
      },
    };

    if (args.gameCreateInput.name !== null) {
      gameCreateQuery.name = args.gameCreateInput.name;
    }

    const httpResponse: Awaited<ReturnType<HttpClient['createGame']>> =
      await this.#httpClient.createGame(request.headers, gameCreateQuery);

    switch (httpResponse.statusCode) {
      case 200:
        return this.#gameGraphQlFromGameV1Builder.build(httpResponse.body);
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
      case 403:
        throw new AppError(
          AppErrorKind.invalidCredentials,
          httpResponse.body.description,
        );
    }
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public __resolveType(): never {
    throw new Error('Method not implemented');
  }
}
