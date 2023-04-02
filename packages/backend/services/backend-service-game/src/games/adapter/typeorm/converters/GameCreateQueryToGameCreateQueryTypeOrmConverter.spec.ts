import { beforeAll, describe, expect, it } from '@jest/globals';

import { DeepPartial } from 'typeorm';

import { GameCreateQueryFixtures } from '../../../domain/fixtures/GameCreateQueryFixtures';
import { GameCreateQuery } from '../../../domain/query/GameCreateQuery';
import { GameDb } from '../models/GameDb';
import { GameCreateQueryToGameCreateQueryTypeOrmConverter } from './GameCreateQueryToGameCreateQueryTypeOrmConverter';

describe(GameCreateQueryToGameCreateQueryTypeOrmConverter.name, () => {
  let gameCreateQueryToGameCreateQueryTypeOrmConverter: GameCreateQueryToGameCreateQueryTypeOrmConverter;

  beforeAll(() => {
    gameCreateQueryToGameCreateQueryTypeOrmConverter =
      new GameCreateQueryToGameCreateQueryTypeOrmConverter();
  });

  describe('.convert', () => {
    let gameCreateQueryFixture: GameCreateQuery;

    beforeAll(() => {
      gameCreateQueryFixture = GameCreateQueryFixtures.any;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = gameCreateQueryToGameCreateQueryTypeOrmConverter.convert(
          gameCreateQueryFixture,
        );
      });

      it('should return a DeepPartial<GameDb>', () => {
        const expected: DeepPartial<GameDb> = {
          active: false,
          currentCard: null,
          currentColor: null,
          currentPlayingSlotIndex: null,
          id: gameCreateQueryFixture.id,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
