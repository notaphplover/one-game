import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { GameCreateQueryFixtures } from '@cornie-js/backend-app-game-fixtures/games/domain';
import {
  GameCardSpec,
  GameCreateQuery,
} from '@cornie-js/backend-app-game-models/games/domain';
import { Converter } from '@cornie-js/backend-common';
import { DeepPartial } from 'typeorm';

import { GameDb } from '../models/GameDb';
import { GameCreateQueryToGameCreateQueryTypeOrmConverter } from './GameCreateQueryToGameCreateQueryTypeOrmConverter';

describe(GameCreateQueryToGameCreateQueryTypeOrmConverter.name, () => {
  let gameCardSpecArrayToGameCardSpecArrayDbConverterMock: jest.Mocked<
    Converter<GameCardSpec[], string>
  >;

  let gameCreateQueryToGameCreateQueryTypeOrmConverter: GameCreateQueryToGameCreateQueryTypeOrmConverter;

  beforeAll(() => {
    gameCardSpecArrayToGameCardSpecArrayDbConverterMock = {
      convert: jest.fn(),
    };

    gameCreateQueryToGameCreateQueryTypeOrmConverter =
      new GameCreateQueryToGameCreateQueryTypeOrmConverter(
        gameCardSpecArrayToGameCardSpecArrayDbConverterMock,
      );
  });

  describe('.convert', () => {
    let gameCreateQueryFixture: GameCreateQuery;

    beforeAll(() => {
      gameCreateQueryFixture = GameCreateQueryFixtures.withSpecOne;
    });

    describe('when called', () => {
      let gameCardSpecArrayStringifiedFixture: string;
      let result: unknown;

      beforeAll(() => {
        gameCardSpecArrayStringifiedFixture = '[39]';

        gameCardSpecArrayToGameCardSpecArrayDbConverterMock.convert.mockReturnValueOnce(
          gameCardSpecArrayStringifiedFixture,
        );

        result = gameCreateQueryToGameCreateQueryTypeOrmConverter.convert(
          gameCreateQueryFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gameCardSpecArrayToGameCardSpecArrayDbConverter.convert()', () => {
        expect(
          gameCardSpecArrayToGameCardSpecArrayDbConverterMock.convert,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameCardSpecArrayToGameCardSpecArrayDbConverterMock.convert,
        ).toHaveBeenCalledWith(gameCreateQueryFixture.spec);
      });

      it('should return a DeepPartial<GameDb>', () => {
        const expected: DeepPartial<GameDb> = {
          active: false,
          currentCard: null,
          currentColor: null,
          currentDirection: null,
          currentPlayingSlotIndex: null,
          deck: gameCardSpecArrayStringifiedFixture,
          gameSlotsAmount: gameCreateQueryFixture.gameSlotsAmount,
          id: gameCreateQueryFixture.id,
          spec: gameCardSpecArrayStringifiedFixture,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
