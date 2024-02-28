import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Builder } from '@cornie-js/backend-common';
import { Card } from '@cornie-js/backend-game-domain/cards';
import { GameInitialSnapshotSlotCreateQuery } from '@cornie-js/backend-game-domain/gameSnapshots';
import { GameInitialSnapshotSlotCreateQueryFixtures } from '@cornie-js/backend-game-domain/gameSnapshots/fixtures';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { CardDb } from '../../../../cards/adapter/typeorm/models/CardDb';
import { GameInitialSnapshotSlotDb } from '../models/GameInitialSnapshotSlotDb';
import { GameInitialSnapshotSlotCreateQueryTypeOrmFromGameInitialSnapshotSlotCreateQueryBuilder } from './GameInitialSnapshotSlotCreateQueryTypeOrmFromGameInitialSnapshotSlotCreateQueryBuilder';

describe(
  GameInitialSnapshotSlotCreateQueryTypeOrmFromGameInitialSnapshotSlotCreateQueryBuilder.name,
  () => {
    let cardDbBuilderMock: jest.Mocked<Builder<CardDb, [Card]>>;

    let gameInitialSnapshotSlotCreateQueryTypeOrmFromGameInitialSnapshotSlotCreateQueryBuilder: GameInitialSnapshotSlotCreateQueryTypeOrmFromGameInitialSnapshotSlotCreateQueryBuilder;

    beforeAll(() => {
      cardDbBuilderMock = {
        build: jest.fn(),
      };

      gameInitialSnapshotSlotCreateQueryTypeOrmFromGameInitialSnapshotSlotCreateQueryBuilder =
        new GameInitialSnapshotSlotCreateQueryTypeOrmFromGameInitialSnapshotSlotCreateQueryBuilder(
          cardDbBuilderMock,
        );
    });

    describe('.build', () => {
      let gameInitialSnapshotSlotCreateQueryFixture: GameInitialSnapshotSlotCreateQuery;

      beforeAll(() => {
        gameInitialSnapshotSlotCreateQueryFixture =
          GameInitialSnapshotSlotCreateQueryFixtures.withCardsOne;
      });

      describe('when called', () => {
        let cardDbFixture: CardDb;

        let result: unknown;

        beforeAll(() => {
          cardDbFixture = 0x0027;

          cardDbBuilderMock.build.mockReturnValueOnce(cardDbFixture);

          result =
            gameInitialSnapshotSlotCreateQueryTypeOrmFromGameInitialSnapshotSlotCreateQueryBuilder.build(
              gameInitialSnapshotSlotCreateQueryFixture,
            );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call cardBuilderMock.build()', () => {
          expect(cardDbBuilderMock.build).toHaveBeenCalledTimes(1);
          expect(cardDbBuilderMock.build).toHaveBeenCalledWith(
            gameInitialSnapshotSlotCreateQueryFixture.cards[0],
          );
        });

        it('should return QueryDeepPartialEntity<GameInitialSnapshotSlotDb>', () => {
          const expected: QueryDeepPartialEntity<GameInitialSnapshotSlotDb> = {
            cards: JSON.stringify([cardDbFixture]),
            gameInitialSnapshot: {
              id: gameInitialSnapshotSlotCreateQueryFixture.gameInitialSnapshotId,
            },
            id: gameInitialSnapshotSlotCreateQueryFixture.id,
            position: gameInitialSnapshotSlotCreateQueryFixture.position,
            userId: gameInitialSnapshotSlotCreateQueryFixture.userId,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });
  },
);
