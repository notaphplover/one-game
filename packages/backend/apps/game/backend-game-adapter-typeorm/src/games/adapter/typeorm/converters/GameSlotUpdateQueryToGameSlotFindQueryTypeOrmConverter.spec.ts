import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Converter } from '@cornie-js/backend-common';
import {
  GameSlotFindQuery,
  GameSlotUpdateQuery,
} from '@cornie-js/backend-game-domain/games';
import { GameSlotUpdateQueryFixtures } from '@cornie-js/backend-game-domain/games/fixtures';
import { ObjectLiteral, QueryBuilder, WhereExpressionBuilder } from 'typeorm';

import { GameSlotUpdateQueryToGameSlotFindQueryTypeOrmConverter } from './GameSlotUpdateQueryToGameSlotFindQueryTypeOrmConverter';

describe(GameSlotUpdateQueryToGameSlotFindQueryTypeOrmConverter.name, () => {
  let gameSlotFindQueryToGameSlotFindQueryTypeOrmConverterMock: jest.Mocked<
    Converter<
      GameSlotFindQuery,
      QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
      QueryBuilder<ObjectLiteral> & WhereExpressionBuilder
    >
  >;

  let gameSlotUpdateQueryToGameSlotFindQueryTypeOrmConverter: GameSlotUpdateQueryToGameSlotFindQueryTypeOrmConverter;

  beforeAll(() => {
    gameSlotFindQueryToGameSlotFindQueryTypeOrmConverterMock = {
      convert: jest.fn(),
    };

    gameSlotUpdateQueryToGameSlotFindQueryTypeOrmConverter =
      new GameSlotUpdateQueryToGameSlotFindQueryTypeOrmConverter(
        gameSlotFindQueryToGameSlotFindQueryTypeOrmConverterMock,
      );
  });

  describe('.convert', () => {
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
        gameSlotFindQueryToGameSlotFindQueryTypeOrmConverterMock.convert.mockReturnValueOnce(
          queryBuilderFixture,
        );

        result = gameSlotUpdateQueryToGameSlotFindQueryTypeOrmConverter.convert(
          gameSlotUpdateQueryFixture,
          queryBuilderFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gameSlotFindQueryToGameSlotFindQueryTypeOrmConverter.convert()', () => {
        expect(
          gameSlotFindQueryToGameSlotFindQueryTypeOrmConverterMock.convert,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameSlotFindQueryToGameSlotFindQueryTypeOrmConverterMock.convert,
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
