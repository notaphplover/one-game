import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Builder } from '@cornie-js/backend-common';
import {
  GameSlotFindQuery,
  GameSlotUpdateQuery,
} from '@cornie-js/backend-game-domain/games';
import { GameSlotUpdateQueryFixtures } from '@cornie-js/backend-game-domain/games/fixtures';
import { ObjectLiteral, QueryBuilder, WhereExpressionBuilder } from 'typeorm';

import { GameSlotFindQueryTypeOrmFromGameSlotUpdateQueryBuilder } from './GameSlotFindQueryTypeOrmFromGameSlotUpdateQueryBuilder';

describe(GameSlotFindQueryTypeOrmFromGameSlotUpdateQueryBuilder.name, () => {
  let gameSlotFindQueryTypeOrmFromGameSlotFindQueryBuilderMock: jest.Mocked<
    Builder<
      QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
      [GameSlotFindQuery, QueryBuilder<ObjectLiteral> & WhereExpressionBuilder]
    >
  >;

  let gameSlotFindQueryTypeOrmFromGameSlotUpdateQueryBuilder: GameSlotFindQueryTypeOrmFromGameSlotUpdateQueryBuilder;

  beforeAll(() => {
    gameSlotFindQueryTypeOrmFromGameSlotFindQueryBuilderMock = {
      build: jest.fn(),
    };

    gameSlotFindQueryTypeOrmFromGameSlotUpdateQueryBuilder =
      new GameSlotFindQueryTypeOrmFromGameSlotUpdateQueryBuilder(
        gameSlotFindQueryTypeOrmFromGameSlotFindQueryBuilderMock,
      );
  });

  describe('.build', () => {
    let gameSlotUpdateQueryFixture: GameSlotUpdateQuery;
    let queryBuilderFixture: QueryBuilder<ObjectLiteral> &
      WhereExpressionBuilder;

    beforeAll(() => {
      gameSlotUpdateQueryFixture = GameSlotUpdateQueryFixtures.any;
      queryBuilderFixture = Symbol() as unknown as QueryBuilder<ObjectLiteral> &
        WhereExpressionBuilder;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        gameSlotFindQueryTypeOrmFromGameSlotFindQueryBuilderMock.build.mockReturnValueOnce(
          queryBuilderFixture,
        );

        result = gameSlotFindQueryTypeOrmFromGameSlotUpdateQueryBuilder.build(
          gameSlotUpdateQueryFixture,
          queryBuilderFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gameSlotFindQueryTypeOrmFromGameSlotFindQueryBuilder.build()', () => {
        expect(
          gameSlotFindQueryTypeOrmFromGameSlotFindQueryBuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameSlotFindQueryTypeOrmFromGameSlotFindQueryBuilderMock.build,
        ).toHaveBeenCalledWith(
          gameSlotUpdateQueryFixture.gameSlotFindQuery,
          queryBuilderFixture,
        );
      });

      it('should return a QueryBuilder', () => {
        expect(result).toBe(queryBuilderFixture);
      });
    });
  });
});
