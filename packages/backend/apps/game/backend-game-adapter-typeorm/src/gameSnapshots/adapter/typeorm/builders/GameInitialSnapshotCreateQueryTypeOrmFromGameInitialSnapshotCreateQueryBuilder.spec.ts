import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Builder } from '@cornie-js/backend-common';
import { Card, CardColor } from '@cornie-js/backend-game-domain/cards';
import {
  GameCardSpec,
  GameDirection,
} from '@cornie-js/backend-game-domain/games';
import { GameInitialSnapshotCreateQuery } from '@cornie-js/backend-game-domain/gameSnapshots';
import { GameInitialSnapshotCreateQueryFixtures } from '@cornie-js/backend-game-domain/gameSnapshots/fixtures';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { CardColorDb } from '../../../../cards/adapter/typeorm/models/CardColorDb';
import { CardDb } from '../../../../cards/adapter/typeorm/models/CardDb';
import { GameDirectionDb } from '../../../../games/adapter/typeorm/models/GameDirectionDb';
import { GameInitialSnapshotDb } from '../models/GameInitialSnapshotDb';
import { GameInitialSnapshotCreateQueryTypeOrmFromGameInitialSnapshotCreateQueryBuilder } from './GameInitialSnapshotCreateQueryTypeOrmFromGameInitialSnapshotCreateQueryBuilder';

describe(
  GameInitialSnapshotCreateQueryTypeOrmFromGameInitialSnapshotCreateQueryBuilder.name,
  () => {
    let cardColorDbBuilderMock: jest.Mocked<Builder<CardColorDb, [CardColor]>>;
    let cardDbBuilderMock: jest.Mocked<Builder<CardDb, [Card]>>;
    let gameCardSpecArrayDbFromGameCardSpecArrayBuilderMock: jest.Mocked<
      Builder<string, [GameCardSpec[]]>
    >;
    let gameDirectionDbFromGameDirectionBuilderMock: jest.Mocked<
      Builder<GameDirectionDb, [GameDirection]>
    >;

    let gameInitialSnapshotCreateQueryTypeOrmFromGameInitialSnapshotCreateQueryBuilder: GameInitialSnapshotCreateQueryTypeOrmFromGameInitialSnapshotCreateQueryBuilder;

    beforeAll(() => {
      cardColorDbBuilderMock = {
        build: jest.fn(),
      };
      cardDbBuilderMock = {
        build: jest.fn(),
      };
      gameCardSpecArrayDbFromGameCardSpecArrayBuilderMock = {
        build: jest.fn(),
      };
      gameDirectionDbFromGameDirectionBuilderMock = {
        build: jest.fn(),
      };

      gameInitialSnapshotCreateQueryTypeOrmFromGameInitialSnapshotCreateQueryBuilder =
        new GameInitialSnapshotCreateQueryTypeOrmFromGameInitialSnapshotCreateQueryBuilder(
          cardColorDbBuilderMock,
          cardDbBuilderMock,
          gameCardSpecArrayDbFromGameCardSpecArrayBuilderMock,
          gameDirectionDbFromGameDirectionBuilderMock,
        );
    });

    describe('.build', () => {
      let gameInitialSnapshotCreateQueryFixture: GameInitialSnapshotCreateQuery;

      beforeAll(() => {
        gameInitialSnapshotCreateQueryFixture =
          GameInitialSnapshotCreateQueryFixtures.any;
      });

      describe('when called', () => {
        let cardColorDbFixture: CardColorDb;
        let cardDbFixture: CardDb;
        let gameCardSpecArrayDbFixture: string;
        let gameDirectionDbFixture: GameDirectionDb;

        let result: unknown;

        beforeAll(() => {
          cardColorDbFixture = 0x0030;
          cardDbFixture = 0x0042;
          gameCardSpecArrayDbFixture = '[{ "amount": 1, "card": 39 }]';
          gameDirectionDbFixture = GameDirectionDb.antiClockwise;

          cardColorDbBuilderMock.build.mockReturnValueOnce(cardColorDbFixture);
          cardDbBuilderMock.build.mockReturnValueOnce(cardDbFixture);
          gameCardSpecArrayDbFromGameCardSpecArrayBuilderMock.build.mockReturnValueOnce(
            gameCardSpecArrayDbFixture,
          );
          gameDirectionDbFromGameDirectionBuilderMock.build.mockReturnValueOnce(
            gameDirectionDbFixture,
          );

          result =
            gameInitialSnapshotCreateQueryTypeOrmFromGameInitialSnapshotCreateQueryBuilder.build(
              gameInitialSnapshotCreateQueryFixture,
            );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call cardColorDbBuilder.build()', () => {
          expect(cardColorDbBuilderMock.build).toHaveBeenCalledTimes(1);
          expect(cardColorDbBuilderMock.build).toHaveBeenCalledWith(
            gameInitialSnapshotCreateQueryFixture.currentColor,
          );
        });

        it('should call cardDbBuilder.build()', () => {
          expect(cardDbBuilderMock.build).toHaveBeenCalledTimes(1);
          expect(cardDbBuilderMock.build).toHaveBeenCalledWith(
            gameInitialSnapshotCreateQueryFixture.currentCard,
          );
        });

        it('should call gameCardSpecArrayDbFromGameCardSpecArrayBuilder.build()', () => {
          expect(
            gameCardSpecArrayDbFromGameCardSpecArrayBuilderMock.build,
          ).toHaveBeenCalledTimes(1);
          expect(
            gameCardSpecArrayDbFromGameCardSpecArrayBuilderMock.build,
          ).toHaveBeenCalledWith(gameInitialSnapshotCreateQueryFixture.deck);
        });

        it('should call gameDirectionDbFromGameDirectionBuilder.build()', () => {
          expect(
            gameDirectionDbFromGameDirectionBuilderMock.build,
          ).toHaveBeenCalledTimes(1);
          expect(
            gameDirectionDbFromGameDirectionBuilderMock.build,
          ).toHaveBeenCalledWith(
            gameInitialSnapshotCreateQueryFixture.currentDirection,
          );
        });

        it('should return QueryDeepPartialEntity<GameInitialSnapshotDb>', () => {
          const expected: QueryDeepPartialEntity<GameInitialSnapshotDb> = {
            currentCard: cardDbFixture,
            currentColor: cardColorDbFixture,
            currentDirection: gameDirectionDbFixture,
            currentPlayingSlotIndex:
              gameInitialSnapshotCreateQueryFixture.currentPlayingSlotIndex,
            deck: gameCardSpecArrayDbFixture,
            drawCount: gameInitialSnapshotCreateQueryFixture.drawCount,
            game: {
              id: gameInitialSnapshotCreateQueryFixture.gameId,
            },
            id: gameInitialSnapshotCreateQueryFixture.id,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });
  },
);
