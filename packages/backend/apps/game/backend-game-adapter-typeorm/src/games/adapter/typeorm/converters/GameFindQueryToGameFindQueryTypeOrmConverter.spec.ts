import { beforeAll, describe, expect, it, jest } from '@jest/globals';

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

import { GameFindQuery } from '@cornie-js/backend-game-domain/games';
import { GameFindQueryFixtures } from '@cornie-js/backend-game-domain/games/fixtures';
import {
  InstanceChecker,
  QueryBuilder,
  SelectQueryBuilder,
  WhereExpressionBuilder,
} from 'typeorm';

import { GameDb } from '../models/GameDb';
import { GameFindQueryToGameFindQueryTypeOrmConverter } from './GameFindQueryToGameFindQueryTypeOrmConverter';

describe(GameFindQueryToGameFindQueryTypeOrmConverter.name, () => {
  let gameFindQueryToGameFindQueryTypeOrmConverter: GameFindQueryToGameFindQueryTypeOrmConverter;

  beforeAll(() => {
    gameFindQueryToGameFindQueryTypeOrmConverter =
      new GameFindQueryToGameFindQueryTypeOrmConverter();
  });

  describe('.convert', () => {
    let queryBuilderFixture: jest.Mocked<
      QueryBuilder<GameDb> & WhereExpressionBuilder
    >;

    beforeAll(() => {
      queryBuilderFixture = {
        andWhere: jest.fn().mockReturnThis(),
      } as Partial<
        jest.Mocked<QueryBuilder<GameDb> & WhereExpressionBuilder>
      > as jest.Mocked<QueryBuilder<GameDb> & WhereExpressionBuilder>;
    });

    describe('having a GameFindQuery with id', () => {
      let gameFindQueryFixture: GameFindQuery;

      beforeAll(() => {
        gameFindQueryFixture = GameFindQueryFixtures.withId;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          (
            InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
          ).mockReturnValueOnce(true);

          result = gameFindQueryToGameFindQueryTypeOrmConverter.convert(
            gameFindQueryFixture,
            queryBuilderFixture,
          );
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
  });
});
