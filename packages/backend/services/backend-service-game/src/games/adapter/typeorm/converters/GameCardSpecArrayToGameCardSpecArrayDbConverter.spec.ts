import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Builder } from '@one-game-js/backend-common';

import { CardDb } from '../../../../cards/adapter/typeorm/models/CardDb';
import { Card } from '../../../../cards/domain/models/Card';
import { GameCardSpecFixtures } from '../../../domain/fixtures/GameCardSpecFixtures';
import { GameCardSpec } from '../../../domain/models/GameCardSpec';
import { GameCardSpecDb } from '../models/GameCardSpecDb';
import { GameCardSpecArrayToGameCardSpecArrayDbConverter } from './GameCardSpecArrayToGameCardSpecArrayDbConverter';

describe(GameCardSpecArrayToGameCardSpecArrayDbConverter.name, () => {
  let cardDbBuilderMock: jest.Mocked<Builder<CardDb, [Card]>>;

  let gameCardSpecArrayToGameCardSpecArrayDbConverter: GameCardSpecArrayToGameCardSpecArrayDbConverter;

  beforeAll(() => {
    cardDbBuilderMock = {
      build: jest.fn(),
    };

    gameCardSpecArrayToGameCardSpecArrayDbConverter =
      new GameCardSpecArrayToGameCardSpecArrayDbConverter(cardDbBuilderMock);
  });

  describe('convert()', () => {
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

        result = gameCardSpecArrayToGameCardSpecArrayDbConverter.convert([
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
