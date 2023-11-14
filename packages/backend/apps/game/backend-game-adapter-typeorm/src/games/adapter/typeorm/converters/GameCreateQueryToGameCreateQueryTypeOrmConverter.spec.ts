import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Converter } from '@cornie-js/backend-common';
import {
  GameCardSpec,
  GameCreateQuery,
} from '@cornie-js/backend-game-domain/games';
import { GameCreateQueryFixtures } from '@cornie-js/backend-game-domain/games/fixtures';
import { DeepPartial } from 'typeorm';

import { GameDb } from '../models/GameDb';
import { GameStatusDb } from '../models/GameStatusDb';
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
    describe('having a GameCreateQuery with string name', () => {
      let gameCreateQueryFixture: GameCreateQuery;

      beforeAll(() => {
        gameCreateQueryFixture =
          GameCreateQueryFixtures.withSpecWithCardsOneAndName;
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
          ).toHaveBeenCalledWith(gameCreateQueryFixture.spec.cards);
        });

        it('should return a DeepPartial<GameDb>', () => {
          const expected: DeepPartial<GameDb> = {
            currentCard: null,
            currentColor: null,
            currentDirection: null,
            currentPlayingSlotIndex: null,
            currentTurnCardsPlayed: null,
            deck: null,
            discardPile: '[]',
            gameSlotsAmount: gameCreateQueryFixture.spec.gameSlotsAmount,
            id: gameCreateQueryFixture.id,
            name: gameCreateQueryFixture.name as string,
            spec: gameCardSpecArrayStringifiedFixture,
            status: GameStatusDb.nonStarted,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a GameCreateQuery with undefined name', () => {
      let gameCreateQueryFixture: GameCreateQuery;

      beforeAll(() => {
        gameCreateQueryFixture =
          GameCreateQueryFixtures.withSpecWithCardsOneAndNameUndefined;
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
          ).toHaveBeenCalledWith(gameCreateQueryFixture.spec.cards);
        });

        it('should return a DeepPartial<GameDb>', () => {
          const expected: DeepPartial<GameDb> = {
            currentCard: null,
            currentColor: null,
            currentDirection: null,
            currentPlayingSlotIndex: null,
            currentTurnCardsPlayed: null,
            deck: null,
            discardPile: '[]',
            gameSlotsAmount: gameCreateQueryFixture.spec.gameSlotsAmount,
            id: gameCreateQueryFixture.id,
            name: null,
            spec: gameCardSpecArrayStringifiedFixture,
            status: GameStatusDb.nonStarted,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });
});
