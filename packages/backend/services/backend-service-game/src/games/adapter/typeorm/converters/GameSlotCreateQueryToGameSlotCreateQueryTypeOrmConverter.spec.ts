import { beforeAll, describe, expect, it } from '@jest/globals';

import { DeepPartial } from 'typeorm';

import { GameSlotCreateQueryFixtures } from '../../../domain/fixtures/GameSlotCreateQueryFixtures';
import { GameSlotCreateQuery } from '../../../domain/query/GameSlotCreateQuery';
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
