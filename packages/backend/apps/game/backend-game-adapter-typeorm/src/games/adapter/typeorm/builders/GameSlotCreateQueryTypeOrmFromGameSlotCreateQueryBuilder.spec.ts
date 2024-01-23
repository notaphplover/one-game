import { beforeAll, describe, expect, it } from '@jest/globals';

import { GameSlotCreateQuery } from '@cornie-js/backend-game-domain/games';
import { GameSlotCreateQueryFixtures } from '@cornie-js/backend-game-domain/games/fixtures';
import { DeepPartial } from 'typeorm';

import { GameSlotDb } from '../models/GameSlotDb';
import { GameSlotCreateQueryTypeOrmFromGameSlotCreateQueryBuilder } from './GameSlotCreateQueryTypeOrmFromGameSlotCreateQueryBuilder';

describe(GameSlotCreateQueryTypeOrmFromGameSlotCreateQueryBuilder.name, () => {
  let gameSlotCreateQueryTypeOrmFromGameSlotCreateQueryBuilder: GameSlotCreateQueryTypeOrmFromGameSlotCreateQueryBuilder;

  beforeAll(() => {
    gameSlotCreateQueryTypeOrmFromGameSlotCreateQueryBuilder =
      new GameSlotCreateQueryTypeOrmFromGameSlotCreateQueryBuilder();
  });

  describe('having a GameSlotCreateQuery', () => {
    let gameSlotCreateQueryFixture: GameSlotCreateQuery;

    beforeAll(() => {
      gameSlotCreateQueryFixture = GameSlotCreateQueryFixtures.any;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = gameSlotCreateQueryTypeOrmFromGameSlotCreateQueryBuilder.build(
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
