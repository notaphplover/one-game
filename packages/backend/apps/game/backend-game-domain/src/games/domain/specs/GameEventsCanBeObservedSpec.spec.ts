import { beforeAll, describe, expect, it } from '@jest/globals';

import { Game } from '../entities/Game';
import { ActiveGameFixtures } from '../fixtures/ActiveGameFixtures';
import { NonStartedGameFixtures } from '../fixtures/NonStartedGameFixtures';
import { GameEventsCanBeObservedSpec } from './GameEventsCanBeObservedSpec';

describe(GameEventsCanBeObservedSpec.name, () => {
  let gameEventsCanBeObservedSpec: GameEventsCanBeObservedSpec;

  beforeAll(() => {
    gameEventsCanBeObservedSpec = new GameEventsCanBeObservedSpec();
  });

  describe('.isSatisfiedBy', () => {
    describe('having an ActiveGame', () => {
      let gameFixture: Game;

      beforeAll(() => {
        gameFixture = ActiveGameFixtures.any;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameEventsCanBeObservedSpec.isSatisfiedBy(gameFixture);
        });

        it('should return true', () => {
          expect(result).toBe(true);
        });
      });
    });

    describe('having a non ActiveGame', () => {
      let gameFixture: Game;

      beforeAll(() => {
        gameFixture = NonStartedGameFixtures.any;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameEventsCanBeObservedSpec.isSatisfiedBy(gameFixture);
        });

        it('should return false', () => {
          expect(result).toBe(false);
        });
      });
    });
  });
});
