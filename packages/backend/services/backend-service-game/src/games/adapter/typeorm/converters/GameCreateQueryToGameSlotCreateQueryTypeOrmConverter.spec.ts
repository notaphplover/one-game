import { beforeAll, describe, expect, it } from '@jest/globals';

import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { GameCreateQueryFixtures } from '../../../domain/fixtures/GameCreateQueryFixtures';
import { GameCreateQuery } from '../../../domain/query/GameCreateQuery';
import { GameSlotDb } from '../models/GameSlotDb';
import { GameCreateQueryToGameSlotCreateQueryTypeOrmConverter } from './GameCreateQueryToGameSlotCreateQueryTypeOrmConverter';

describe(GameCreateQueryToGameSlotCreateQueryTypeOrmConverter.name, () => {
  let gameCreateQueryToGameSlotCreateQueryTypeOrmConverter: GameCreateQueryToGameSlotCreateQueryTypeOrmConverter;

  beforeAll(() => {
    gameCreateQueryToGameSlotCreateQueryTypeOrmConverter =
      new GameCreateQueryToGameSlotCreateQueryTypeOrmConverter();
  });

  describe('.convert', () => {
    let gameCreateQueryFixture: GameCreateQuery;

    beforeAll(() => {
      gameCreateQueryFixture = GameCreateQueryFixtures.withGameSlotsIdOne;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = gameCreateQueryToGameSlotCreateQueryTypeOrmConverter.convert(
          gameCreateQueryFixture,
        );
      });

      it('should return a DeepPartial<GameSlotDb>[]', () => {
        const expected: QueryDeepPartialEntity<GameSlotDb>[] = [
          {
            game: {
              id: gameCreateQueryFixture.id,
            },
            id: gameCreateQueryFixture.gameSlotIds[0] as string,
            userId: null,
          },
        ];

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
