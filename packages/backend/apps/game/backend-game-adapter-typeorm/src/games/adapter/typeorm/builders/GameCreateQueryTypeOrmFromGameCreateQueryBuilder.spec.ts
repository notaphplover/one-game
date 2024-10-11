import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { GameCreateQuery } from '@cornie-js/backend-game-domain/games';
import { GameCreateQueryFixtures } from '@cornie-js/backend-game-domain/games/fixtures';
import { DeepPartial } from 'typeorm';

import { GameDb } from '../models/GameDb';
import { GameStatusDb } from '../models/GameStatusDb';
import { GameCreateQueryTypeOrmFromGameCreateQueryBuilder } from './GameCreateQueryTypeOrmFromGameCreateQueryBuilder';

describe(GameCreateQueryTypeOrmFromGameCreateQueryBuilder.name, () => {
  let gameCreateQueryTypeOrmFromGameCreateQueryBuilder: GameCreateQueryTypeOrmFromGameCreateQueryBuilder;

  beforeAll(() => {
    gameCreateQueryTypeOrmFromGameCreateQueryBuilder =
      new GameCreateQueryTypeOrmFromGameCreateQueryBuilder();
  });

  describe('.build', () => {
    describe('having a GameCreateQuery with string name', () => {
      let gameCreateQueryFixture: GameCreateQuery;

      beforeAll(() => {
        gameCreateQueryFixture =
          GameCreateQueryFixtures.withSpecWithCardsOneAndName;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameCreateQueryTypeOrmFromGameCreateQueryBuilder.build(
            gameCreateQueryFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a DeepPartial<GameDb>', () => {
          const expected: DeepPartial<GameDb> = {
            currentCard: null,
            currentColor: null,
            currentDirection: null,
            currentPlayingSlotIndex: null,
            currentTurnCardsPlayed: null,
            deck: null,
            discardPile: '[]',
            gameSlotsAmount: gameCreateQueryFixture.spec.gameSlotsAmount,
            id: gameCreateQueryFixture.id,
            isPublic: gameCreateQueryFixture.isPublic,
            name: gameCreateQueryFixture.name as string,
            status: GameStatusDb.nonStarted,
            turn: null,
            turnExpiresAt: null,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a GameCreateQuery with undefined name', () => {
      let gameCreateQueryFixture: GameCreateQuery;

      beforeAll(() => {
        gameCreateQueryFixture =
          GameCreateQueryFixtures.withSpecWithCardsOneAndNameUndefined;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameCreateQueryTypeOrmFromGameCreateQueryBuilder.build(
            gameCreateQueryFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a DeepPartial<GameDb>', () => {
          const expected: DeepPartial<GameDb> = {
            currentCard: null,
            currentColor: null,
            currentDirection: null,
            currentPlayingSlotIndex: null,
            currentTurnCardsPlayed: null,
            deck: null,
            discardPile: '[]',
            gameSlotsAmount: gameCreateQueryFixture.spec.gameSlotsAmount,
            id: gameCreateQueryFixture.id,
            isPublic: gameCreateQueryFixture.isPublic,
            name: null,
            status: GameStatusDb.nonStarted,
            turn: null,
            turnExpiresAt: null,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });
});
