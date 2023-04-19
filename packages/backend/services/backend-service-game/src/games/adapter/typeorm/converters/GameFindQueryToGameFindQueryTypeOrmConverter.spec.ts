import { beforeAll, describe, expect, it } from '@jest/globals';

import { FindManyOptions, FindOptionsWhere } from 'typeorm';

import { GameFindQueryFixtures } from '../../../domain/fixtures/GameFindQueryFixtures';
import { GameFindQuery } from '../../../domain/query/GameFindQuery';
import { GameDb } from '../models/GameDb';
import { GameFindQueryToGameFindQueryTypeOrmConverter } from './GameFindQueryToGameFindQueryTypeOrmConverter';

describe(GameFindQueryToGameFindQueryTypeOrmConverter.name, () => {
  let gameFindQueryToGameFindQueryTypeOrmConverter: GameFindQueryToGameFindQueryTypeOrmConverter;

  beforeAll(() => {
    gameFindQueryToGameFindQueryTypeOrmConverter =
      new GameFindQueryToGameFindQueryTypeOrmConverter();
  });

  describe('.convert', () => {
    describe('having a GameFindQuery with id', () => {
      let gameFindQueryFixture: GameFindQuery;

      beforeAll(() => {
        gameFindQueryFixture = GameFindQueryFixtures.withId;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result =
            gameFindQueryToGameFindQueryTypeOrmConverter.convert(
              gameFindQueryFixture,
            );
        });

        it('should return a FindManyOptions<GameDb>', () => {
          const expected: FindManyOptions<GameDb> = {
            where: expect.objectContaining({
              id: gameFindQueryFixture.id,
            }) as FindOptionsWhere<GameDb>,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });
});
