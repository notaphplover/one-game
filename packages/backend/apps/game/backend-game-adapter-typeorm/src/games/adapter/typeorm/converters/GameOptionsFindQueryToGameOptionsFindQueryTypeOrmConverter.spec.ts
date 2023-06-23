import { beforeAll, describe, expect, it } from '@jest/globals';

import { GameOptionsFindQuery } from '@cornie-js/backend-game-domain/games';
import { GameOptionsFindQueryFixtures } from '@cornie-js/backend-game-domain/games/fixtures';
import { FindManyOptions } from 'typeorm';

import { GameOptionsDb } from '../models/GameOptionsDb';
import { GameOptionsFindQueryToGameOptionsFindQueryTypeOrmConverter } from './GameOptionsFindQueryToGameOptionsFindQueryTypeOrmConverter';

describe(
  GameOptionsFindQueryToGameOptionsFindQueryTypeOrmConverter.name,
  () => {
    let gameOptionsFindQueryToGameOptionsFindQueryTypeOrmConverter: GameOptionsFindQueryToGameOptionsFindQueryTypeOrmConverter;

    beforeAll(() => {
      gameOptionsFindQueryToGameOptionsFindQueryTypeOrmConverter =
        new GameOptionsFindQueryToGameOptionsFindQueryTypeOrmConverter();
    });

    describe('.convert', () => {
      let gameOptionsFindQueryFixture: GameOptionsFindQuery;

      beforeAll(() => {
        gameOptionsFindQueryFixture = GameOptionsFindQueryFixtures.withGameId;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result =
            gameOptionsFindQueryToGameOptionsFindQueryTypeOrmConverter.convert(
              gameOptionsFindQueryFixture,
            );
        });

        it('should return a GameOptionsFindQueryTypeOrm', () => {
          const expected: FindManyOptions<GameOptionsDb> = {
            where: {
              game: {
                id: gameOptionsFindQueryFixture.gameId as string,
              },
            },
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });
  },
);
