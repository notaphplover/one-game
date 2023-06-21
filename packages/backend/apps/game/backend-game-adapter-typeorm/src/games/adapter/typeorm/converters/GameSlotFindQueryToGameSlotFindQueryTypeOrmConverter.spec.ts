import { beforeAll, describe, expect, it } from '@jest/globals';

import { GameSlotFindQuery } from '@cornie-js/backend-game-domain/games';
import { GameSlotFindQueryFixtures } from '@cornie-js/backend-game-domain/games/fixtures';
import { FindManyOptions } from 'typeorm';

import { GameSlotDb } from '../models/GameSlotDb';
import { GameSlotFindQueryToGameSlotFindQueryTypeOrmConverter } from './GameSlotFindQueryToGameSlotFindQueryTypeOrmConverter';

describe(GameSlotFindQueryToGameSlotFindQueryTypeOrmConverter.name, () => {
  let gameSlotFindQueryToGameSlotFindQueryTypeOrmConverter: GameSlotFindQueryToGameSlotFindQueryTypeOrmConverter;

  beforeAll(() => {
    gameSlotFindQueryToGameSlotFindQueryTypeOrmConverter =
      new GameSlotFindQueryToGameSlotFindQueryTypeOrmConverter();
  });

  describe('.convert', () => {
    describe('having a GameSlotFindQuery with gameId', () => {
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
              game: {
                id: gameSlotFindQueryFixture.gameId as string,
              },
            },
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a GameSlotFindQuery with position', () => {
      let gameSlotFindQueryFixture: GameSlotFindQuery;

      beforeAll(() => {
        gameSlotFindQueryFixture = GameSlotFindQueryFixtures.withPosition;
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
              position: gameSlotFindQueryFixture.position as number,
            },
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });
});
