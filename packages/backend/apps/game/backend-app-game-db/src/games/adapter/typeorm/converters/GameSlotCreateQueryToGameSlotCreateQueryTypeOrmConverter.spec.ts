import { beforeAll, describe, expect, it } from '@jest/globals';

import { GameSlotCreateQuery } from '@cornie-js/backend-app-game-domain/games/domain';
import { GameSlotCreateQueryFixtures } from '@cornie-js/backend-app-game-fixtures/games/domain';
import { DeepPartial } from 'typeorm';

import { GameSlotDb } from '../models/GameSlotDb';
import { GameSlotCreateQueryToGameSlotCreateQueryTypeOrmConverter } from './GameSlotCreateQueryToGameSlotCreateQueryTypeOrmConverter';

describe(GameSlotCreateQueryToGameSlotCreateQueryTypeOrmConverter.name, () => {
  let gameSlotCreateQueryToGameSlotCreateQueryTypeOrmConverter: GameSlotCreateQueryToGameSlotCreateQueryTypeOrmConverter;

  beforeAll(() => {
    gameSlotCreateQueryToGameSlotCreateQueryTypeOrmConverter =
      new GameSlotCreateQueryToGameSlotCreateQueryTypeOrmConverter();
  });

  describe('having a GameSlotCreateQuery', () => {
    let gameSlotCreateQueryFixture: GameSlotCreateQuery;

    beforeAll(() => {
      gameSlotCreateQueryFixture = GameSlotCreateQueryFixtures.any;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result =
          gameSlotCreateQueryToGameSlotCreateQueryTypeOrmConverter.convert(
            gameSlotCreateQueryFixture,
          );
      });

      it('should return a DeepPartial<GameSlotDb>', () => {
        const expected: DeepPartial<GameSlotDb> = {
          game: {
            id: gameSlotCreateQueryFixture.gameId,
          },
          id: gameSlotCreateQueryFixture.id,
          position: gameSlotCreateQueryFixture.position,
          userId: gameSlotCreateQueryFixture.userId,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
