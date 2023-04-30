import { beforeAll, describe, expect, it } from '@jest/globals';

import { FindManyOptions } from 'typeorm';

import { GameSlotFindQueryFixtures } from '../../../domain/fixtures/GameSlotFindQueryFixtures';
import { GameSlotFindQuery } from '../../../domain/query/GameSlotFindQuery';
import { GameSlotDb } from '../models/GameSlotDb';
import { GameSlotFindQueryToGameSlotFindQueryTypeOrmConverter } from './GameSlotFindQueryToGameSlotFindQueryTypeOrmConverter';

describe(GameSlotFindQueryToGameSlotFindQueryTypeOrmConverter.name, () => {
  let gameSlotFindQueryToGameSlotFindQueryTypeOrmConverter: GameSlotFindQueryToGameSlotFindQueryTypeOrmConverter;

  beforeAll(() => {
    gameSlotFindQueryToGameSlotFindQueryTypeOrmConverter =
      new GameSlotFindQueryToGameSlotFindQueryTypeOrmConverter();
  });

  describe('.convert', () => {
    describe('having a GameSLotFindQuery with id', () => {
      let gameSlotFindQueryFixture: GameSlotFindQuery;

      beforeAll(() => {
        gameSlotFindQueryFixture = GameSlotFindQueryFixtures.withId;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameSlotFindQueryToGameSlotFindQueryTypeOrmConverter.convert(
            gameSlotFindQueryFixture,
          );
        });

        it('should return a FindManyOptions<GameSlotDb>', () => {
          const expected: FindManyOptions<GameSlotDb> = {
            where: {
              id: gameSlotFindQueryFixture.id as string,
            },
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });
});
