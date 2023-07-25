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
    let queryFixture: string;
    let queryBuilderFixture: jest.Mocked<SelectQueryBuilder<ObjectLiteral>>;

    beforeAll(() => {
      queryFixture = '(query fixture)';

      queryBuilderFixture = {
        andWhere: jest.fn().mockReturnThis(),
        distinct: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        getParameters: jest.fn().mockReturnThis(),
        getQuery: jest.fn().mockReturnValue(queryFixture),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        setParameters: jest.fn().mockReturnThis(),
        subQuery: jest.fn().mockReturnThis(),
      } as Partial<
        jest.Mocked<SelectQueryBuilder<ObjectLiteral>>
      > as jest.Mocked<SelectQueryBuilder<ObjectLiteral>>;
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
          ).mockReturnValue(true);

          result = gameFindQueryToGameFindQueryTypeOrmConverter.convert(
            gameFindQueryFixture,
            queryBuilderFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();

          (
            InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
          ).mockReset();
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
          (
            InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
          ).mockReturnValue(true);

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

          (
            InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
          ).mockReset();
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

    describe('having a GameFindQuery with limit', () => {
      let gameFindQueryFixture: GameFindQuery;

      beforeAll(() => {
        gameFindQueryFixture = GameFindQueryFixtures.withLimit;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          (
            InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
          ).mockReturnValue(true);

          result = gameFindQueryToGameFindQueryTypeOrmConverter.convert(
            gameFindQueryFixture,
            queryBuilderFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();

          (
            InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
          ).mockReset();
        });

        it('should call queryBuilder.limit()', () => {
          expect(queryBuilderFixture.limit).toHaveBeenCalledTimes(1);
          expect(queryBuilderFixture.limit).toHaveBeenCalledWith(
            gameFindQueryFixture.limit,
          );
        });

        it('should return a QueryBuilder', () => {
          expect(result).toBe(queryBuilderFixture);
        });
      });
    });

    describe('having a GameFindQuery with offset', () => {
      let gameFindQueryFixture: GameFindQuery;

      beforeAll(() => {
        gameFindQueryFixture = GameFindQueryFixtures.withOffset;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          (
            InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
          ).mockReturnValue(true);

          result = gameFindQueryToGameFindQueryTypeOrmConverter.convert(
            gameFindQueryFixture,
            queryBuilderFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();

          (
            InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
          ).mockReset();
        });

        it('should call queryBuilder.offset()', () => {
          expect(queryBuilderFixture.offset).toHaveBeenCalledTimes(1);
          expect(queryBuilderFixture.offset).toHaveBeenCalledWith(
            gameFindQueryFixture.offset,
          );
        });

        it('should return a QueryBuilder', () => {
          expect(result).toBe(queryBuilderFixture);
        });
      });
    });

    describe('having a GameFindQuery with state with currentPlayingSlotIndex', () => {
      let gameFindQueryFixture: GameFindQuery;

      beforeAll(() => {
        gameFindQueryFixture =
          GameFindQueryFixtures.withStateWithCurrentPlayingSlotIndex;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          (
            InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
          ).mockReturnValue(true);

          result = gameFindQueryToGameFindQueryTypeOrmConverter.convert(
            gameFindQueryFixture,
            queryBuilderFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();

          (
            InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
          ).mockReset();
        });

        it('should call queryBuilder.andWhere()', () => {
          expect(queryBuilderFixture.andWhere).toHaveBeenCalled();
          expect(queryBuilderFixture.andWhere).toHaveBeenCalledWith(
            `${GameDb.name}.currentPlayingSlotIndex = :${GameDb.name}currentPlayingSlotIndex`,
            {
              [`${GameDb.name}currentPlayingSlotIndex`]:
                gameFindQueryFixture.state?.currentPlayingSlotIndex,
            },
          );
        });

        it('should return a QueryBuilder', () => {
          expect(result).toBe(queryBuilderFixture);
        });
      });
    });

    describe('having a GameFindQuery with status', () => {
      let gameFindQueryFixture: GameFindQuery;

      beforeAll(() => {
        gameFindQueryFixture = GameFindQueryFixtures.withStatusActive;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          (
            InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
          ).mockReturnValue(true);

          result = gameFindQueryToGameFindQueryTypeOrmConverter.convert(
            gameFindQueryFixture,
            queryBuilderFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();

          (
            InstanceChecker.isSelectQueryBuilder as unknown as jest.Mock
          ).mockReset();
        });

        it('should call queryBuilder.andWhere()', () => {
          expect(queryBuilderFixture.andWhere).toHaveBeenCalled();
          expect(queryBuilderFixture.andWhere).toHaveBeenCalledWith(
            `${GameDb.name}.status = :${GameDb.name}status`,
            {
              [`${GameDb.name}status`]: gameFindQueryFixture.status,
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
