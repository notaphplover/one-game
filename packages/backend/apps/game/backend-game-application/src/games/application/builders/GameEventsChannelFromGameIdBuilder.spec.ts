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
    let versionFixture: number;

    beforeAll(() => {
      gameIdFixture = 'gameId';
      versionFixture = 1;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = gameEventsChannelFromGameIdBuilder.build(
          gameIdFixture,
          versionFixture,
        );
      });

      it('should return a channel', () => {
        expect(result).toBe(`v${versionFixture}/games/${gameIdFixture}`);
      });
    });
  });
});
