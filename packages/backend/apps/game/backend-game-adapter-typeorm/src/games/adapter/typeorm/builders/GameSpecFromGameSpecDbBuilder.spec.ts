import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Builder } from '@cornie-js/backend-common';
import { GameCardSpec, GameSpec } from '@cornie-js/backend-game-domain/games';
import { GameCardSpecFixtures } from '@cornie-js/backend-game-domain/games/fixtures';

import { GameSpecDbFixtures } from '../fixtures/GameSpecDbFixtures';
import { GameSpecDb } from '../models/GameSpecDb';
import { GameSpecFromGameSpecDbBuilder } from './GameSpecFromGameSpecDbBuilder';

describe(GameSpecFromGameSpecDbBuilder.name, () => {
  let gameCardSpecArrayFromGameCardSpecArrayDbBuilderMock: jest.Mocked<
    Builder<GameCardSpec[], [string]>
  >;

  let gameSpecFromGameSpecDbBuilder: GameSpecFromGameSpecDbBuilder;

  beforeAll(() => {
    gameCardSpecArrayFromGameCardSpecArrayDbBuilderMock = {
      build: jest.fn(),
    };

    gameSpecFromGameSpecDbBuilder = new GameSpecFromGameSpecDbBuilder(
      gameCardSpecArrayFromGameCardSpecArrayDbBuilderMock,
    );
  });

  describe('having a GameSpecDb with a card', () => {
    let gameSpecDbFixture: GameSpecDb;

    beforeAll(() => {
      gameSpecDbFixture = GameSpecDbFixtures.any;
    });

    describe('when called', () => {
      let gameCardSpecArrayFixture: GameCardSpec[];

      beforeAll(() => {
        gameCardSpecArrayFixture = [GameCardSpecFixtures.any];
      });

      let result: unknown;

      beforeAll(() => {
        gameCardSpecArrayFromGameCardSpecArrayDbBuilderMock.build.mockReturnValueOnce(
          gameCardSpecArrayFixture,
        );

        result = gameSpecFromGameSpecDbBuilder.build(gameSpecDbFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gameCardSpecArrayFromGameCardSpecArrayDbBuilder.build()', () => {
        expect(
          gameCardSpecArrayFromGameCardSpecArrayDbBuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameCardSpecArrayFromGameCardSpecArrayDbBuilderMock.build,
        ).toHaveBeenCalledWith(gameSpecDbFixture.cardsSpec);
      });

      it('should return a GameSpec', () => {
        const expected: GameSpec = {
          cards: gameCardSpecArrayFixture,
          gameId: gameSpecDbFixture.gameId,
          gameSlotsAmount: gameSpecDbFixture.gameSlotsAmount,
          options: {
            chainDraw2Draw2Cards: gameSpecDbFixture.chainDraw2Draw2Cards,
            chainDraw2Draw4Cards: gameSpecDbFixture.chainDraw2Draw4Cards,
            chainDraw4Draw2Cards: gameSpecDbFixture.chainDraw4Draw2Cards,
            chainDraw4Draw4Cards: gameSpecDbFixture.chainDraw4Draw4Cards,
            playCardIsMandatory: gameSpecDbFixture.playCardIsMandatory,
            playMultipleSameCards: gameSpecDbFixture.playMultipleSameCards,
            playWildDraw4IfNoOtherAlternative:
              gameSpecDbFixture.playWildDraw4IfNoOtherAlternative,
          },
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
