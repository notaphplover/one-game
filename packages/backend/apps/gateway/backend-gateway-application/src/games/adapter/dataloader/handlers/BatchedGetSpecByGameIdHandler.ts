/* eslint-disable @typescript-eslint/no-magic-numbers */
import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { HttpClient, HttpClientEndpoints } from '@cornie-js/api-http-client';
import { models as apiModels } from '@cornie-js/api-models';
import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import { Request } from '@cornie-js/backend-http';

import { BatchedGetByIdHandler } from '../../../../foundation/graphql/adapter/dataloader/handlers/BatchedGetByIdHandler';

const MAX_BATCH_SIZE: number = 50;

export class BatchedGetSpecByGameIdHandler extends BatchedGetByIdHandler<
  string,
  apiModels.GameSpecV1,
  graphqlModels.GameSpec
> {
  readonly #gameSpecGraphqlFromGameSpecV1Builder: Builder<
    graphqlModels.GameSpec,
    [apiModels.GameSpecV1]
  >;
  readonly #httpClient: HttpClient;
  readonly #request: Request;

  constructor(
    gameSpecGraphqlFromGameSpecV1Builder: Builder<
      graphqlModels.GameSpec,
      [apiModels.GameSpecV1]
    >,
    httpClient: HttpClient,
    request: Request,
  ) {
    super({
      maxBatchSize: MAX_BATCH_SIZE,
    });

    this.#gameSpecGraphqlFromGameSpecV1Builder =
      gameSpecGraphqlFromGameSpecV1Builder;
    this.#httpClient = httpClient;
    this.#request = request;
  }

  protected override _buildOutput(
    gameSpecV1: apiModels.GameSpecV1,
  ): graphqlModels.GameSpec {
    return this.#gameSpecGraphqlFromGameSpecV1Builder.build(gameSpecV1);
  }

  protected override _getId(entity: apiModels.GameSpecV1): string {
    return entity.gameId;
  }

  protected override async _getByIds(
    gameIds: readonly string[],
  ): Promise<apiModels.GameSpecV1[]> {
    const gameSpecSortOptionV1: apiModels.GameSpecSortOptionV1 = 'gameIds';
    const httpResponse: Awaited<
      ReturnType<HttpClientEndpoints['getGamesSpecs']>
    > = await this.#httpClient.endpoints.getGamesSpecs(this.#request.headers, {
      gameId: gameIds as string[],
      sort: gameSpecSortOptionV1,
    });

    switch (httpResponse.statusCode) {
      case 200:
        return httpResponse.body;
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
}
