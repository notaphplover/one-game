import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Builder } from '@cornie-js/backend-common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { CardDb } from '../../../../cards/adapter/typeorm/models/CardDb';
import { Card } from '../../../../cards/domain/models/Card';
import { GameSlotUpdateQueryFixtures } from '../../../domain/fixtures/GameSlotUpdateQueryFixtures';
import { GameSlotUpdateQuery } from '../../../domain/query/GameSlotUpdateQuery';
import { GameSlotDb } from '../models/GameSlotDb';
import { GameSlotUpdateQueryToGameSlotSetQueryTypeOrmConverter } from './GameSlotUpdateQueryToGameSlotSetQueryTypeOrmConverter';

describe(GameSlotUpdateQueryToGameSlotSetQueryTypeOrmConverter.name, () => {
  let cardDbBuilderMock: jest.Mocked<Builder<CardDb, [Card]>>;

  let gameSlotUpdateQueryToGameSlotSetQueryTypeOrmConverter: GameSlotUpdateQueryToGameSlotSetQueryTypeOrmConverter;

  beforeAll(() => {
    cardDbBuilderMock = {
      build: jest.fn(),
    };

    gameSlotUpdateQueryToGameSlotSetQueryTypeOrmConverter =
      new GameSlotUpdateQueryToGameSlotSetQueryTypeOrmConverter(
        cardDbBuilderMock,
      );
  });

  describe('.convert', () => {
    describe('having a GameSlotUpdateQuery with cards', () => {
      let cardFixture: Card;
      let gameSlotUpdateQueryFixture: GameSlotUpdateQuery;

      beforeAll(() => {
        gameSlotUpdateQueryFixture = GameSlotUpdateQueryFixtures.withCardsOne;

        [cardFixture] = gameSlotUpdateQueryFixture.cards as [Card];
      });

      describe('when called', () => {
        let cardDbFixture: CardDb;

        let result: unknown;

        beforeAll(() => {
          cardDbFixture = 0x0039;

          cardDbBuilderMock.build.mockReturnValueOnce(cardDbFixture);

          result =
            gameSlotUpdateQueryToGameSlotSetQueryTypeOrmConverter.convert(
              gameSlotUpdateQueryFixture,
            );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call cardDbBuilder.build()', () => {
          expect(cardDbBuilderMock.build).toHaveBeenCalledTimes(1);
          expect(cardDbBuilderMock.build).toHaveBeenCalledWith(cardFixture);
        });

        it('should return a QueryDeepPartialEntity<GameSlotDb>', () => {
          const expected: QueryDeepPartialEntity<GameSlotDb> = {
            cards: JSON.stringify([cardDbFixture]),
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });
});
