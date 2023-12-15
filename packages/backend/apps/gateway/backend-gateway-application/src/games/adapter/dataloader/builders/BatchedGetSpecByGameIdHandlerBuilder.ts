import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { HttpClient } from '@cornie-js/api-http-client';
import { models as apiModels } from '@cornie-js/api-models';
import { Builder, Handler } from '@cornie-js/backend-common';
import { Request } from '@cornie-js/backend-http';
import { Inject, Injectable } from '@nestjs/common';

import { GameSpecGraphqlFromGameSpecV1Builder } from '../../../application/builders/GameSpecGraphqlFromGameSpecV1Builder';
import { BatchedGetSpecByGameIdHandler } from '../handlers/BatchedGetSpecByGameIdHandler';

@Injectable()
export class BatchedGetSpecByGameIdHandlerBuilder
  implements
    Builder<Handler<[string], graphqlModels.GameSpec | undefined>, [Request]>
{
  readonly #gameSpecGraphqlFromGameSpecV1Builder: Builder<
    graphqlModels.GameSpec,
    [apiModels.GameSpecV1]
  >;
  readonly #httpClient: HttpClient;

  constructor(
    @Inject(GameSpecGraphqlFromGameSpecV1Builder)
    gameSpecGraphqlFromGameSpecV1Builder: Builder<
      graphqlModels.GameSpec,
      [apiModels.GameSpecV1]
    >,
    @Inject(HttpClient)
    httpClient: HttpClient,
  ) {
    this.#gameSpecGraphqlFromGameSpecV1Builder =
      gameSpecGraphqlFromGameSpecV1Builder;
    this.#httpClient = httpClient;
  }

  public build(
    request: Request,
  ): Handler<[string], graphqlModels.GameSpec | undefined> {
    return new BatchedGetSpecByGameIdHandler(
      this.#gameSpecGraphqlFromGameSpecV1Builder,
      this.#httpClient,
      request,
    );
  }
}
