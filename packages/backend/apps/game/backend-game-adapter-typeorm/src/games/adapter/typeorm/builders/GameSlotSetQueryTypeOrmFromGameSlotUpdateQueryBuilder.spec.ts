import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Builder } from '@cornie-js/backend-common';
import { Card } from '@cornie-js/backend-game-domain/cards';
import { GameSlotUpdateQuery } from '@cornie-js/backend-game-domain/games';
import { GameSlotUpdateQueryFixtures } from '@cornie-js/backend-game-domain/games/fixtures';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { CardDb } from '../../../../cards/adapter/typeorm/models/CardDb';
import { GameSlotDb } from '../models/GameSlotDb';
import { GameSlotSetQueryTypeOrmFromGameSlotUpdateQueryBuilder } from './GameSlotSetQueryTypeOrmFromGameSlotUpdateQueryBuilder';

describe(GameSlotSetQueryTypeOrmFromGameSlotUpdateQueryBuilder.name, () => {
  let cardDbBuilderMock: jest.Mocked<Builder<CardDb, [Card]>>;

  let gameSlotSetQueryTypeOrmFromGameSlotUpdateQueryBuilder: GameSlotSetQueryTypeOrmFromGameSlotUpdateQueryBuilder;

  beforeAll(() => {
    cardDbBuilderMock = {
      build: jest.fn(),
    };

    gameSlotSetQueryTypeOrmFromGameSlotUpdateQueryBuilder =
      new GameSlotSetQueryTypeOrmFromGameSlotUpdateQueryBuilder(
        cardDbBuilderMock,
      );
  });

  describe('.build', () => {
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

          result = gameSlotSetQueryTypeOrmFromGameSlotUpdateQueryBuilder.build(
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
