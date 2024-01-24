import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Builder } from '@cornie-js/backend-common';
import {
  GameFindQuery,
  GameUpdateQuery,
} from '@cornie-js/backend-game-domain/games';
import { GameUpdateQueryFixtures } from '@cornie-js/backend-game-domain/games/fixtures';
import { ObjectLiteral, QueryBuilder, WhereExpressionBuilder } from 'typeorm';

import { GameFindQueryTypeOrmFromGameUpdateQueryBuilder } from './GameFindQueryTypeOrmFromGameUpdateQueryBuilder';

describe(GameFindQueryTypeOrmFromGameUpdateQueryBuilder.name, () => {
  let gameFindQueryTypeOrmFromGameFindQueryBuilderMock: jest.Mocked<
    Builder<
      QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
      [GameFindQuery, QueryBuilder<ObjectLiteral> & WhereExpressionBuilder]
    >
  >;

  let gameFindQueryTypeOrmFromGameUpdateQueryBuilder: GameFindQueryTypeOrmFromGameUpdateQueryBuilder;

  beforeAll(() => {
    gameFindQueryTypeOrmFromGameFindQueryBuilderMock = {
      build: jest.fn(),
    };

    gameFindQueryTypeOrmFromGameUpdateQueryBuilder =
      new GameFindQueryTypeOrmFromGameUpdateQueryBuilder(
        gameFindQueryTypeOrmFromGameFindQueryBuilderMock,
      );
  });

  describe('.build', () => {
    let gameUpdateQueryFixture: GameUpdateQuery;
    let queryBuilderFixture: QueryBuilder<ObjectLiteral> &
      WhereExpressionBuilder;

    beforeAll(() => {
      gameUpdateQueryFixture = GameUpdateQueryFixtures.any;
      queryBuilderFixture = Symbol() as unknown as QueryBuilder<ObjectLiteral> &
        WhereExpressionBuilder;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        gameFindQueryTypeOrmFromGameFindQueryBuilderMock.build.mockReturnValueOnce(
          queryBuilderFixture,
        );

        result = gameFindQueryTypeOrmFromGameUpdateQueryBuilder.build(
          gameUpdateQueryFixture,
          queryBuilderFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gameFindQueryToGameFindQueryTypeOrmBuilder.build()', () => {
        expect(
          gameFindQueryTypeOrmFromGameFindQueryBuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameFindQueryTypeOrmFromGameFindQueryBuilderMock.build,
        ).toHaveBeenCalledWith(
          gameUpdateQueryFixture.gameFindQuery,
          queryBuilderFixture,
        );
      });

      it('should return a QueryBuilder', () => {
        expect(result).toBe(queryBuilderFixture);
      });
    });
  });
});
