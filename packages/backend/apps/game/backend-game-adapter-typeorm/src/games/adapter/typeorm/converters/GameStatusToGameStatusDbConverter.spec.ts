import { beforeAll, describe, expect, it } from '@jest/globals';

import { GameStatus } from '@cornie-js/backend-game-domain/games';

import { GameStatusDb } from '../models/GameStatusDb';
import { GameStatusToGameStatusDbConverter } from './GameStatusToGameStatusDbConverter';

describe(GameStatusToGameStatusDbConverter.name, () => {
  let gameStatusToGameStatusDbConverter: GameStatusToGameStatusDbConverter;

  beforeAll(() => {
    gameStatusToGameStatusDbConverter = new GameStatusToGameStatusDbConverter();
  });

  describe('.convert', () => {
    describe('having a GameStatus active', () => {
      let gameStatusFixture: GameStatus;

      beforeAll(() => {
        gameStatusFixture = GameStatus.active;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameStatusToGameStatusDbConverter.convert(gameStatusFixture);
        });

        it('should return GameStatusDb active', () => {
          expect(result).toBe(GameStatusDb.active);
        });
      });
    });

    describe('having a GameStatus nonStarted', () => {
      let gameStatusFixture: GameStatus;

      beforeAll(() => {
        gameStatusFixture = GameStatus.nonStarted;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameStatusToGameStatusDbConverter.convert(gameStatusFixture);
        });

        it('should return GameStatusDb nonStarted', () => {
          expect(result).toBe(GameStatusDb.nonStarted);
        });
      });
    });
  });
});
