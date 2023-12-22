import { beforeAll, describe, expect, it } from '@jest/globals';

import { GameStatus } from '@cornie-js/backend-game-domain/games';

import { GameStatusDb } from '../models/GameStatusDb';
import { GameStatusDbFromGameStatusBuilder } from './GameStatusDbFromGameStatusBuilder';

describe(GameStatusDbFromGameStatusBuilder.name, () => {
  let gameStatusDbFromGameStatusBuilder: GameStatusDbFromGameStatusBuilder;

  beforeAll(() => {
    gameStatusDbFromGameStatusBuilder = new GameStatusDbFromGameStatusBuilder();
  });

  describe('.build', () => {
    describe('having a GameStatus active', () => {
      let gameStatusFixture: GameStatus;

      beforeAll(() => {
        gameStatusFixture = GameStatus.active;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameStatusDbFromGameStatusBuilder.build(gameStatusFixture);
        });

        it('should return GameStatusDb active', () => {
          expect(result).toBe(GameStatusDb.active);
        });
      });
    });

    describe('having a GameStatus finished', () => {
      let gameStatusFixture: GameStatus;

      beforeAll(() => {
        gameStatusFixture = GameStatus.finished;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameStatusDbFromGameStatusBuilder.build(gameStatusFixture);
        });

        it('should return GameStatusDb finished', () => {
          expect(result).toBe(GameStatusDb.finished);
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
          result = gameStatusDbFromGameStatusBuilder.build(gameStatusFixture);
        });

        it('should return GameStatusDb nonStarted', () => {
          expect(result).toBe(GameStatusDb.nonStarted);
        });
      });
    });
  });
});
