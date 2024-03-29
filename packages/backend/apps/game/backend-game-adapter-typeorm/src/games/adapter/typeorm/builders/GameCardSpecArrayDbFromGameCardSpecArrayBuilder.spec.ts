import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Builder } from '@cornie-js/backend-common';
import { Card } from '@cornie-js/backend-game-domain/cards';
import { GameCardSpec } from '@cornie-js/backend-game-domain/games';
import { GameCardSpecFixtures } from '@cornie-js/backend-game-domain/games/fixtures';

import { CardDb } from '../../../../cards/adapter/typeorm/models/CardDb';
import { GameCardSpecDb } from '../models/GameCardSpecDb';
import { GameCardSpecArrayDbFromGameCardSpecArrayBuilder } from './GameCardSpecArrayDbFromGameCardSpecArrayBuilder';

describe(GameCardSpecArrayDbFromGameCardSpecArrayBuilder.name, () => {
  let cardDbBuilderMock: jest.Mocked<Builder<CardDb, [Card]>>;

  let gameCardSpecArrayDbFromGameCardSpecArrayBuilder: GameCardSpecArrayDbFromGameCardSpecArrayBuilder;

  beforeAll(() => {
    cardDbBuilderMock = {
      build: jest.fn(),
    };

    gameCardSpecArrayDbFromGameCardSpecArrayBuilder =
      new GameCardSpecArrayDbFromGameCardSpecArrayBuilder(cardDbBuilderMock);
  });

  describe('build()', () => {
    let gameCardSpecFixture: GameCardSpec;

    beforeAll(() => {
      gameCardSpecFixture = GameCardSpecFixtures.any;
    });

    describe('when called', () => {
      let cardDbFixture: CardDb;
      let result: unknown;

      beforeAll(() => {
        cardDbFixture = 0x0027;

        cardDbBuilderMock.build.mockReturnValueOnce(cardDbFixture);

        result = gameCardSpecArrayDbFromGameCardSpecArrayBuilder.build([
          gameCardSpecFixture,
        ]);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call cardDbBuilder.build()', () => {
        expect(cardDbBuilderMock.build).toHaveBeenCalledTimes(1);
        expect(cardDbBuilderMock.build).toHaveBeenCalledWith(
          gameCardSpecFixture.card,
        );
      });

      it('should return a string', () => {
        const expectedGameCardSpecDbArray: GameCardSpecDb[] = [
          {
            amount: gameCardSpecFixture.amount,
            card: cardDbFixture,
          },
        ];

        const expected: string = JSON.stringify(expectedGameCardSpecDbArray);

        expect(result).toBe(expected);
      });
    });
  });
});
