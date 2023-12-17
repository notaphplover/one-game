/* eslint-disable @typescript-eslint/no-magic-numbers */
import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { HttpClient } from '@cornie-js/api-http-client';
import { models as apiModels } from '@cornie-js/api-models';
import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import { Inject, Injectable } from '@nestjs/common';

import { CanonicalResolver } from '../../../foundation/graphql/application/models/CanonicalResolver';
import { Context } from '../../../foundation/graphql/application/models/Context';
import { GameGraphQlFromGameV1Builder } from '../builders/GameGraphQlFromGameV1Builder';

@Injectable()
export class GameMutationResolver
  implements CanonicalResolver<graphqlModels.GameMutationResolvers<Context>>
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

  public async createGame(
    _: unknown,
    args: graphqlModels.GameMutationCreateGameArgs,
    context: Context,
  ): Promise<Partial<graphqlModels.Game>> {
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
      await this.#httpClient.createGame(
        context.request.headers,
        gameCreateQuery,
      );

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

  public async passGameTurn(
    _: unknown,
    args: graphqlModels.GameMutationPassGameTurnArgs,
    context: Context,
  ): Promise<Partial<graphqlModels.Game> | null> {
    const gamePassTurnQueryV1: apiModels.GameIdPassTurnQueryV1 = {
      kind: 'passTurn',
      slotIndex: args.gamePassTurnInput.slotIndex,
    };

    return this.#handleUpdateGameV1(
      context.request.headers,
      args.gameId,
      gamePassTurnQueryV1,
    );
  }

  public async playGameCards(
    _: unknown,
    args: graphqlModels.GameMutationPlayGameCardsArgs,
    context: Context,
  ): Promise<Partial<graphqlModels.Game> | null> {
    const gamePlayCardsQueryV1: apiModels.GameIdPlayCardsQueryV1 = {
      cardIndexes: args.gamePlayCardsInput.cardIndexes,
      kind: 'playCards',
      slotIndex: args.gamePlayCardsInput.slotIndex,
    };

    if (args.gamePlayCardsInput.colorChoice !== null) {
      gamePlayCardsQueryV1.colorChoice = args.gamePlayCardsInput.colorChoice;
    }

    return this.#handleUpdateGameV1(
      context.request.headers,
      args.gameId,
      gamePlayCardsQueryV1,
    );
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public __resolveType(): never {
    throw new Error('Method not implemented');
  }

  async #handleUpdateGameV1(
    headers: Record<string, string>,
    gameId: string,
    gameUpdateQueryV1: apiModels.GameIdUpdateQueryV1,
  ): Promise<Partial<graphqlModels.Game> | null> {
    const httpResponse: Awaited<ReturnType<HttpClient['updateGame']>> =
      await this.#httpClient.updateGame(
        headers,
        { gameId: gameId },
        gameUpdateQueryV1,
      );

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
}
