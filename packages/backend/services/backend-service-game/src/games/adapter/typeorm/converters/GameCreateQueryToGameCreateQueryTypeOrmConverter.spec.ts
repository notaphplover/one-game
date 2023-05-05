import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Converter } from '@cornie-js/backend-common';
import { DeepPartial } from 'typeorm';

import { GameCreateQueryFixtures } from '../../../domain/fixtures/GameCreateQueryFixtures';
import { GameCardSpec } from '../../../domain/models/GameCardSpec';
import { GameCreateQuery } from '../../../domain/query/GameCreateQuery';
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
