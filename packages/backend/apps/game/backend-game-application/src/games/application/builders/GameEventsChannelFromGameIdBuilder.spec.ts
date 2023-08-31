import { beforeAll, describe, expect, it } from '@jest/globals';

import { GameEventsChannelFromGameIdBuilder } from './GameEventsChannelFromGameIdBuilder';

describe(GameEventsChannelFromGameIdBuilder.name, () => {
  let gameEventsChannelFromGameIdBuilder: GameEventsChannelFromGameIdBuilder;

  beforeAll(() => {
    gameEventsChannelFromGameIdBuilder =
      new GameEventsChannelFromGameIdBuilder();
  });

  describe('.build', () => {
    let gameIdFixture: string;

    beforeAll(() => {
      gameIdFixture = 'gameId';
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = gameEventsChannelFromGameIdBuilder.build(gameIdFixture);
      });

      it('should return a channel', () => {
        expect(result).toBe(`v1/games/${gameIdFixture}`);
      });
    });
  });
});
