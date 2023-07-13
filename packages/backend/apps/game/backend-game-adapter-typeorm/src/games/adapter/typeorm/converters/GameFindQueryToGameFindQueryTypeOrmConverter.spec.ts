import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('typeorm', () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
  const originalTypeOrmModule: any = jest.requireActual('typeorm');

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const originalInstanceChecker: typeof InstanceChecker =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    originalTypeOrmModule.InstanceChecker;

  const instanceCheckerMock: typeof InstanceChecker = {
    ...originalInstanceChecker,
    isSelectQueryBuilder: jest.fn() as unknown as (
      obj: unknown,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) => obj is SelectQueryBuilder<any>,
  } as typeof InstanceChecker;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return {
    ...originalTypeOrmModule,
    InstanceChecker: instanceCheckerMock,
  };
});

import { Converter } from '@cornie-js/backend-common';
import {
  GameFindQuery,
  GameSlotFindQuery,
} from '@cornie-js/backend-game-domain/games';
import { GameFindQueryFixtures } from '@cornie-js/backend-game-domain/games/fixtures';
import {
  InstanceChecker,
  ObjectLiteral,
  QueryBuilder,
  SelectQueryBuilder,
  WhereExpressionBuilder,
} from 'typeorm';

import { GameDb } from '../models/GameDb';
import { GameFindQueryToGameFindQueryTypeOrmConverter } from './GameFindQueryToGameFindQueryTypeOrmConverter';

describe(GameFindQueryToGameFindQueryTypeOrmConverter.name, () => {
  let gameSlotFindQueryToGameSlotFindQueryTypeOrmConverterMock: jest.Mocked<
    Converter<
      GameSlotFindQuery,
      QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
      QueryBuilder<ObjectLiteral> & WhereExpressionBuilder
    >
  >;
  let gameFindQueryToGameFindQueryTypeOrmConverter: GameFindQueryToGameFindQueryTypeOrmConverter;

  beforeAll(() => {
    gameSlotFindQueryToGameSlotFindQueryTypeOrmConverterMock = {
      convert: jest.fn(),
    };

    gameFindQueryToGameFindQueryTypeOrmConverter =
      new GameFindQueryToGameFindQueryTypeOrmConverter(
        gameSlotFindQueryToGameSlotFindQueryTypeOrmConverterMock,
      );
  });

  describe('.convert', () => {
    let queryBuilderFixture: jest.Mocked<
      QueryBuilder<ObjectLiteral> & WhereExpressionBuilder
    >;

    beforeAll(() => {
      queryBuilderFixture = {
        andWhere: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
      } as Partial<
        jest.Mocked<QueryBuilder<ObjectLiteral> & WhereExpressionBuilder>
      > as jest.Mocked<QueryBuilder<ObjectLiteral> & WhereExpressionBuilder>;
    });

    describe('having a GameFindQuery with id', () => {
      let gameFindQueryFixture: GameFindQuery;

      beforeAll(() => {
        gameFindQueryFixture = GameFindQueryFixtures.withId;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          (InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock)
            .mockReturnValueOnce(true)
            .mockReturnValueOnce(true);

          result = gameFindQueryToGameFindQueryTypeOrmConverter.convert(
            gameFindQueryFixture,
            queryBuilderFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call queryBuilder.andWhere()', () => {
          expect(queryBuilderFixture.andWhere).toHaveBeenCalled();
          expect(queryBuilderFixture.andWhere).toHaveBeenCalledWith(
            `${GameDb.name}.id = :${GameDb.name}id`,
            {
              [`${GameDb.name}id`]: gameFindQueryFixture.id,
            },
          );
        });

        it('should return a QueryBuilder', () => {
          expect(result).toBe(queryBuilderFixture);
        });
      });
    });

    describe('having a GameFindQuery with GameSlotFindQuery', () => {
      let gameFindQueryFixture: GameFindQuery;

      beforeAll(() => {
        gameFindQueryFixture = GameFindQueryFixtures.withGameSlotFindQuery;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          (InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock)
            .mockReturnValueOnce(true)
            .mockReturnValueOnce(true);

          gameSlotFindQueryToGameSlotFindQueryTypeOrmConverterMock.convert.mockReturnValueOnce(
            queryBuilderFixture,
          );

          result = gameFindQueryToGameFindQueryTypeOrmConverter.convert(
            gameFindQueryFixture,
            queryBuilderFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call gameSlotFindQueryToGameSlotFindQueryTypeOrmConverter.convert()', () => {
          expect(
            gameSlotFindQueryToGameSlotFindQueryTypeOrmConverterMock.convert,
          ).toHaveBeenCalled();
          expect(
            gameSlotFindQueryToGameSlotFindQueryTypeOrmConverterMock.convert,
          ).toHaveBeenCalledWith(
            gameFindQueryFixture.gameSlotFindQuery,
            queryBuilderFixture,
          );
        });

        it('should return a QueryBuilder', () => {
          expect(result).toBe(queryBuilderFixture);
        });
      });
    });
  });
});
