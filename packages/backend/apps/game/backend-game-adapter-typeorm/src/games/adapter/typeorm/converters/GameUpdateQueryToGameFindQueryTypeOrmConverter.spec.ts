import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Converter } from '@cornie-js/backend-common';
import {
  GameFindQuery,
  GameUpdateQuery,
} from '@cornie-js/backend-game-domain/games';
import { GameUpdateQueryFixtures } from '@cornie-js/backend-game-domain/games/fixtures';
import { QueryBuilder, WhereExpressionBuilder } from 'typeorm';

import { GameDb } from '../models/GameDb';
import { GameUpdateQueryToGameFindQueryTypeOrmConverter } from './GameUpdateQueryToGameFindQueryTypeOrmConverter';

describe(GameUpdateQueryToGameFindQueryTypeOrmConverter.name, () => {
  let gameFindQueryToGameFindQueryTypeOrmConverterMock: jest.Mocked<
    Converter<
      GameFindQuery,
      QueryBuilder<GameDb> & WhereExpressionBuilder,
      QueryBuilder<GameDb> & WhereExpressionBuilder
    >
  >;

  let gameUpdateQueryToGameFindQueryTypeOrmConverter: GameUpdateQueryToGameFindQueryTypeOrmConverter;

  beforeAll(() => {
    gameFindQueryToGameFindQueryTypeOrmConverterMock = {
      convert: jest.fn(),
    };

    gameUpdateQueryToGameFindQueryTypeOrmConverter =
      new GameUpdateQueryToGameFindQueryTypeOrmConverter(
        gameFindQueryToGameFindQueryTypeOrmConverterMock,
      );
  });

  describe('.convert', () => {
    let gameUpdateQueryFixture: GameUpdateQuery;
    let queryBuilderFixture: QueryBuilder<GameDb> & WhereExpressionBuilder;

    beforeAll(() => {
      gameUpdateQueryFixture = GameUpdateQueryFixtures.any;
      queryBuilderFixture = Symbol() as unknown as QueryBuilder<GameDb> &
        WhereExpressionBuilder;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        gameFindQueryToGameFindQueryTypeOrmConverterMock.convert.mockReturnValueOnce(
          queryBuilderFixture,
        );

        result = gameUpdateQueryToGameFindQueryTypeOrmConverter.convert(
          gameUpdateQueryFixture,
          queryBuilderFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gameFindQueryToGameFindQueryTypeOrmConverter.convert()', () => {
        expect(
          gameFindQueryToGameFindQueryTypeOrmConverterMock.convert,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameFindQueryToGameFindQueryTypeOrmConverterMock.convert,
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
