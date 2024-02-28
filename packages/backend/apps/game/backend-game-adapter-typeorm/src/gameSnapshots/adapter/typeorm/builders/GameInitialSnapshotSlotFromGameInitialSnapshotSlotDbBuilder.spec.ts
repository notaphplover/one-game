import { beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Builder } from '@cornie-js/backend-common';
import { Card } from '@cornie-js/backend-game-domain/cards';
import { CardFixtures } from '@cornie-js/backend-game-domain/cards/fixtures';
import { GameInitialSnapshotSlot } from '@cornie-js/backend-game-domain/gameSnapshots';

import { GameInitialSnapshotSlotDbFixtures } from '../fixtures/GameInitialSnapshotSlotDbFixtures';
import { GameInitialSnapshotSlotDb } from '../models/GameInitialSnapshotSlotDb';
import { GameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilder } from './GameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilder';

describe(
  GameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilder.name,
  () => {
    let cardArrayFromCardDbStringifiedArrayBuilderMock: jest.Mocked<
      Builder<Card[], [string]>
    >;

    let gameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilder: GameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilder;

    beforeAll(() => {
      cardArrayFromCardDbStringifiedArrayBuilderMock = {
        build: jest.fn(),
      };

      gameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilder =
        new GameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilder(
          cardArrayFromCardDbStringifiedArrayBuilderMock,
        );
    });

    describe('.build', () => {
      describe('when called', () => {
        let cardArrayFixture: Card[];
        let gameInitialSnapshotSlotDbFixture: GameInitialSnapshotSlotDb;

        let result: unknown;

        beforeAll(() => {
          cardArrayFixture = [CardFixtures.any];

          gameInitialSnapshotSlotDbFixture =
            GameInitialSnapshotSlotDbFixtures.any;

          cardArrayFromCardDbStringifiedArrayBuilderMock.build.mockReturnValueOnce(
            cardArrayFixture,
          );

          result =
            gameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilder.build(
              gameInitialSnapshotSlotDbFixture,
            );
        });

        it('should call cardArrayFromCardDbStringifiedArrayBuilder.build()', () => {
          expect(
            cardArrayFromCardDbStringifiedArrayBuilderMock.build,
          ).toHaveBeenCalledTimes(1);
          expect(
            cardArrayFromCardDbStringifiedArrayBuilderMock.build,
          ).toHaveBeenCalledWith(gameInitialSnapshotSlotDbFixture.cards);
        });

        it('should return GameInitialSnapshotSlot', () => {
          const expected: GameInitialSnapshotSlot = {
            cards: cardArrayFixture,
            position: gameInitialSnapshotSlotDbFixture.position,
            userId: gameInitialSnapshotSlotDbFixture.userId,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });
  },
);
