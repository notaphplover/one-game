import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import {
  GameSlotFindQuery,
  GameSlotUpdateQuery,
} from '@cornie-js/backend-app-game-domain/games/domain';
import { GameSlotUpdateQueryFixtures } from '@cornie-js/backend-app-game-fixtures/games/domain';
import { Converter } from '@cornie-js/backend-common';
import { FindManyOptions } from 'typeorm';

import { GameSlotDb } from '../models/GameSlotDb';
import { GameSlotUpdateQueryToGameSlotFindQueryTypeOrmConverter } from './GameSlotUpdateQueryToGameSlotFindQueryTypeOrmConverter';

describe(GameSlotUpdateQueryToGameSlotFindQueryTypeOrmConverter.name, () => {
  let gameSlotFindQueryToGameSlotFindQueryTypeOrmConverterMock: jest.Mocked<
    Converter<GameSlotFindQuery, FindManyOptions<GameSlotDb>>
  >;

  let gameSlotUpdateQueryToGameSlotFindQueryTypeOrmConverter: GameSlotUpdateQueryToGameSlotFindQueryTypeOrmConverter;

  beforeAll(() => {
    gameSlotFindQueryToGameSlotFindQueryTypeOrmConverterMock = {
      convert: jest.fn(),
    };

    gameSlotUpdateQueryToGameSlotFindQueryTypeOrmConverter =
      new GameSlotUpdateQueryToGameSlotFindQueryTypeOrmConverter(
        gameSlotFindQueryToGameSlotFindQueryTypeOrmConverterMock,
      );
  });

  describe('.convert', () => {
    let gameSlotUpdateQueryFixture: GameSlotUpdateQuery;

    beforeAll(() => {
      gameSlotUpdateQueryFixture = GameSlotUpdateQueryFixtures.any;
    });

    describe('when called', () => {
      let gameSlotFindQueryTypeOrmFixture: FindManyOptions<GameSlotDb>;

      let result: unknown;

      beforeAll(() => {
        gameSlotFindQueryTypeOrmFixture =
          Symbol() as unknown as FindManyOptions<GameSlotDb>;

        gameSlotFindQueryToGameSlotFindQueryTypeOrmConverterMock.convert.mockReturnValueOnce(
          gameSlotFindQueryTypeOrmFixture,
        );

        result = gameSlotUpdateQueryToGameSlotFindQueryTypeOrmConverter.convert(
          gameSlotUpdateQueryFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gameSlotFindQueryToGameSlotFindQueryTypeOrmConverter.convert()', () => {
        expect(
          gameSlotFindQueryToGameSlotFindQueryTypeOrmConverterMock.convert,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameSlotFindQueryToGameSlotFindQueryTypeOrmConverterMock.convert,
        ).toHaveBeenCalledWith(gameSlotUpdateQueryFixture.gameSlotFindQuery);
      });

      it('should return a FindManyOptions<GameSLotDb>', () => {
        expect(result).toBe(gameSlotFindQueryTypeOrmFixture);
      });
    });
  });
});
