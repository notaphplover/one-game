/* eslint-disable @typescript-eslint/no-magic-numbers */
import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { HttpClient, HttpClientEndpoints } from '@cornie-js/api-http-client';
import { models as apiModels } from '@cornie-js/api-models';
import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import { Inject, Injectable } from '@nestjs/common';

import { CanonicalResolver } from '../../../foundation/graphql/application/models/CanonicalResolver';
import { Context } from '../../../foundation/graphql/application/models/Context';
import {
  GameGraphQlFromGameV1Builder,
  GameGraphQlFromGameV1BuilderType,
} from '../builders/GameGraphQlFromGameV1Builder';

@Injectable()
export class GameMutationResolver
  implements CanonicalResolver<graphqlModels.GameMutationResolvers<Context>>
{
  readonly #gameGraphQlFromGameV1Builder: GameGraphQlFromGameV1BuilderType;
  readonly #httpClient: HttpClient;

  constructor(
    @Inject(GameGraphQlFromGameV1Builder)
    gameGraphQlFromGameV1Builder: GameGraphQlFromGameV1BuilderType,
    @Inject(HttpClient) httpClient: HttpClient,
  ) {
    this.#gameGraphQlFromGameV1Builder = gameGraphQlFromGameV1Builder;
    this.#httpClient = httpClient;
  }

  public async createGame(
    _: unknown,
    args: graphqlModels.GameMutationCreateGameArgs,
    context: Context,
  ): Promise<Partial<graphqlModels.NonStartedGame>> {
    const gameCreateQuery: apiModels.GameCreateQueryV1 = {
      gameSlotsAmount: args.gameCreateInput.gameSlotsAmount,
      options: {
        ...args.gameCreateInput.options,
      },
    };

    if (args.gameCreateInput.name !== null) {
      gameCreateQuery.name = args.gameCreateInput.name;
    }

    const httpResponse: Awaited<ReturnType<HttpClientEndpoints['createGame']>> =
      await this.#httpClient.endpoints.createGame(
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

  public async createGameSlot(
    _: unknown,
    args: graphqlModels.GameMutationCreateGameSlotArgs,
    context: Context,
  ): Promise<Partial<graphqlModels.NonStartedGameSlot>> {
    const gameSlotCreateQuery: apiModels.GameIdSlotCreateQueryV1 = {
      userId: args.gameSlotCreateInput.userId,
    };

    const httpResponse: Awaited<
      ReturnType<HttpClientEndpoints['createGameSlot']>
    > = await this.#httpClient.endpoints.createGameSlot(
      context.request.headers,
      {
        gameId: args.gameSlotCreateInput.gameId,
      },
      gameSlotCreateQuery,
    );

    switch (httpResponse.statusCode) {
      case 200:
        return httpResponse.body;
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
      case 409:
        throw new AppError(
          AppErrorKind.entityConflict,
          httpResponse.body.description,
        );
      case 422:
        throw new AppError(
          AppErrorKind.unprocessableOperation,
          httpResponse.body.description,
        );
    }
  }

  public async drawGameCards(
    _: unknown,
    args: graphqlModels.GameMutationDrawGameCardsArgs,
    context: Context,
  ): Promise<Partial<graphqlModels.Game> | null> {
    const gamePassTurnQueryV1: apiModels.GameIdDrawCardsQueryV1 = {
      kind: 'drawCards',
      slotIndex: args.gameDrawCardsInput.slotIndex,
    };

    return this.#handleUpdateGameV1(
      context.request.headers,
      args.gameId,
      gamePassTurnQueryV1,
    );
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
    const httpResponse: Awaited<ReturnType<HttpClientEndpoints['updateGame']>> =
      await this.#httpClient.endpoints.updateGame(
        headers,
        { gameId: gameId },
        gameUpdateQueryV1,
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
      case 404:
        return null;
      case 422:
        throw new AppError(
          AppErrorKind.unprocessableOperation,
          httpResponse.body.description,
        );
    }
  }
}
