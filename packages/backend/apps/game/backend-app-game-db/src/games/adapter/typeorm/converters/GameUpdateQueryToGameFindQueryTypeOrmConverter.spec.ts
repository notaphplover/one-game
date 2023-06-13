import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import {
  GameFindQuery,
  GameUpdateQuery,
} from '@cornie-js/backend-app-game-domain/games/domain';
import { GameUpdateQueryFixtures } from '@cornie-js/backend-app-game-fixtures/games/domain';
import { Converter } from '@cornie-js/backend-common';
import { FindManyOptions } from 'typeorm';

import { GameDb } from '../models/GameDb';
import { GameUpdateQueryToGameFindQueryTypeOrmConverter } from './GameUpdateQueryToGameFindQueryTypeOrmConverter';

describe(GameUpdateQueryToGameFindQueryTypeOrmConverter.name, () => {
  let gameFindQueryToGameFindQueryTypeOrmConverterMock: jest.Mocked<
    Converter<GameFindQuery, FindManyOptions<GameDb>>
  >;

  let gameUpdateQueryToGameFindQueryTypeOrmConverter: GameUpdateQueryToGameFindQueryTypeOrmConverter;

  beforeAll(() => {
    gameFindQueryToGameFindQueryTypeOrmConverterMock = {
      convert: jest.fn(),
    };

    gameUpdateQueryToGameFindQueryTypeOrmConverter =
      new GameUpdateQueryToGameFindQueryTypeOrmConverter(
        gameFindQueryToGameFindQueryTypeOrmConverterMock,
      );
  });

  describe('.convert', () => {
    let gameUpdateQueryFixture: GameUpdateQuery;

    beforeAll(() => {
      gameUpdateQueryFixture = GameUpdateQueryFixtures.any;
    });

    describe('when called', () => {
      let gameFindQueryTypeOrmFixture: FindManyOptions<GameDb>;

      let result: unknown;

      beforeAll(() => {
        gameFindQueryTypeOrmFixture = {};

        gameFindQueryToGameFindQueryTypeOrmConverterMock.convert.mockReturnValueOnce(
          gameFindQueryTypeOrmFixture,
        );

        result = gameUpdateQueryToGameFindQueryTypeOrmConverter.convert(
          gameUpdateQueryFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gameFindQueryToGameFindQueryTypeOrmConverter.convert()', () => {
        expect(
          gameFindQueryToGameFindQueryTypeOrmConverterMock.convert,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameFindQueryToGameFindQueryTypeOrmConverterMock.convert,
        ).toHaveBeenCalledWith(gameUpdateQueryFixture.gameFindQuery);
      });

      it('should return FindManyOptions<GameDb>', () => {
        expect(result).toBe(gameFindQueryTypeOrmFixture);
      });
    });
  });
});
