import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { HttpClient } from '@cornie-js/api-http-client';
import { models as apiModels } from '@cornie-js/api-models';
import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import { Request } from '@cornie-js/backend-http';
import { HttpStatus } from '@nestjs/common';

import { GameMutationResolver } from './GameMutationResolver';

describe(GameMutationResolver.name, () => {
  let httpClientMock: jest.Mocked<HttpClient>;

  let gameMutationResolver: GameMutationResolver;
  let gameGraphQlFromGameV1BuilderMock: jest.Mocked<
    Builder<graphqlModels.Game, [apiModels.GameV1]>
  >;

  beforeAll(() => {
    gameGraphQlFromGameV1BuilderMock = {
      build: jest.fn(),
    };

    httpClientMock = {
      createGame: jest.fn(),
    } as Partial<jest.Mocked<HttpClient>> as jest.Mocked<HttpClient>;

    gameMutationResolver = new GameMutationResolver(
      gameGraphQlFromGameV1BuilderMock,
      httpClientMock,
    );
  });

  describe('.createGame', () => {
    let gameSlotsAmountFixture: number;
    let nameFixture: string;
    let optionsFixture: graphqlModels.GameCreateInputOptions;

    beforeAll(() => {
      gameSlotsAmountFixture = 2;
      nameFixture = 'name-fixture';
      optionsFixture = {
        chainDraw2Draw2Cards: true,
        chainDraw2Draw4Cards: true,
        chainDraw4Draw2Cards: true,
        chainDraw4Draw4Cards: true,
        playCardIsMandatory: false,
        playMultipleSameCards: true,
        playWildDraw4IfNoOtherAlternative: true,
      };
    });

    describe('when called, and httpClient.createGame() returns an OK response', () => {
      let gameV1Fixture: apiModels.NonStartedGameV1;
      let gameGraphQlFixture: graphqlModels.Game;

      let requestFixture: Request;

      let result: unknown;

      beforeAll(async () => {
        gameV1Fixture = Symbol() as unknown as apiModels.NonStartedGameV1;
        gameGraphQlFixture = Symbol() as unknown as graphqlModels.Game;

        requestFixture = {
          headers: {
            foo: 'bar',
          },
          query: {},
          urlParameters: {},
        };

        httpClientMock.createGame.mockResolvedValueOnce({
          body: gameV1Fixture,
          headers: {},
          statusCode: HttpStatus.OK,
        });

        gameGraphQlFromGameV1BuilderMock.build.mockReturnValueOnce(
          gameGraphQlFixture,
        );

        result = await gameMutationResolver.createGame(
          undefined,
          {
            gameCreateInput: {
              gameSlotsAmount: gameSlotsAmountFixture,
              name: nameFixture,
              options: optionsFixture,
            },
          },
          requestFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call httpClient.createGame()', () => {
        const expectedBody: apiModels.GameCreateQueryV1 = {
          gameSlotsAmount: gameSlotsAmountFixture,
          name: nameFixture,
          options: optionsFixture,
        };

        expect(httpClientMock.createGame).toHaveBeenCalledTimes(1);
        expect(httpClientMock.createGame).toHaveBeenCalledWith(
          requestFixture.headers,
          expectedBody,
        );
      });

      it('should call gameGraphQlFromGameV1Builder.build()', () => {
        expect(gameGraphQlFromGameV1BuilderMock.build).toHaveBeenCalledTimes(1);
        expect(gameGraphQlFromGameV1BuilderMock.build).toHaveBeenCalledWith(
          gameV1Fixture,
        );
      });

      it('should return GraphQl Game', () => {
        expect(result).toBe(gameGraphQlFixture);
      });
    });

    describe('when called, and httpClient.createGame() returns an BAD_REQUEST response', () => {
      let errorV1: apiModels.ErrorV1;
      let requestFixture: Request;

      let result: unknown;

      beforeAll(async () => {
        errorV1 = {
          description: 'error description fixture',
        };

        requestFixture = {
          headers: {
            foo: 'bar',
          },
          query: {},
          urlParameters: {},
        };

        httpClientMock.createGame.mockResolvedValueOnce({
          body: errorV1,
          headers: {},
          statusCode: HttpStatus.BAD_REQUEST,
        });

        try {
          await gameMutationResolver.createGame(
            undefined,
            {
              gameCreateInput: {
                gameSlotsAmount: gameSlotsAmountFixture,
                name: nameFixture,
                options: optionsFixture,
              },
            },
            requestFixture,
          );
        } catch (error) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call httpClient.createGame()', () => {
        const expectedBody: apiModels.GameCreateQueryV1 = {
          gameSlotsAmount: gameSlotsAmountFixture,
          name: nameFixture,
          options: optionsFixture,
        };

        expect(httpClientMock.createGame).toHaveBeenCalledTimes(1);
        expect(httpClientMock.createGame).toHaveBeenCalledWith(
          requestFixture.headers,
          expectedBody,
        );
      });

      it('should throw an AppError', () => {
        const expectedErrorProperties: Partial<AppError> = {
          kind: AppErrorKind.contractViolation,
          message: errorV1.description,
        };

        expect(result).toBeInstanceOf(AppError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });
  });
});
