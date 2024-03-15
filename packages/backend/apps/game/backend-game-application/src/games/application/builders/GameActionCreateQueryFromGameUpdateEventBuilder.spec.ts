import { beforeAll, describe, expect, it } from '@jest/globals';

import {
  GameActionCreateQuery,
  GameActionKind,
} from '@cornie-js/backend-game-domain/gameActions';

import { UuidContext } from '../../../foundation/common/application/models/UuidContext';
import { ActiveGameUpdatedEventFixtures } from '../fixtures/ActiveGameUpdatedEventFixtures';
import { ActiveGameUpdatedCardsDrawEvent } from '../models/ActiveGameUpdatedCardsDrawEvent';
import { ActiveGameUpdatedCardsPlayEvent } from '../models/ActiveGameUpdatedCardsPlayEvent';
import { ActiveGameUpdatedTurnPassEvent } from '../models/ActiveGameUpdatedTurnPassEvent';
import { GameActionCreateQueryFromGameUpdateEventBuilder } from './GameActionCreateQueryFromGameUpdateEventBuilder';

describe(GameActionCreateQueryFromGameUpdateEventBuilder.name, () => {
  let gameActionCreateQueryFromGameUpdateEventBuilder: GameActionCreateQueryFromGameUpdateEventBuilder;

  beforeAll(() => {
    gameActionCreateQueryFromGameUpdateEventBuilder =
      new GameActionCreateQueryFromGameUpdateEventBuilder();
  });

  describe('.build', () => {
    describe('having an ActiveGameUpdatedCardsDrawEvent', () => {
      let activeGameUpdatedCardsDrawEventFixture: ActiveGameUpdatedCardsDrawEvent;
      let uuidContextFixture: UuidContext;

      beforeAll(() => {
        activeGameUpdatedCardsDrawEventFixture =
          ActiveGameUpdatedEventFixtures.anyCardsDrawEvent;

        uuidContextFixture = {
          uuid: '738e3afd-b015-4385-ad87-378475db4847',
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameActionCreateQueryFromGameUpdateEventBuilder.build(
            activeGameUpdatedCardsDrawEventFixture,
            uuidContextFixture,
          );
        });

        it('should return a GameActionCreateQuery', () => {
          const expected: GameActionCreateQuery = {
            currentPlayingSlotIndex:
              activeGameUpdatedCardsDrawEventFixture.gameBeforeUpdate.state
                .currentPlayingSlotIndex,
            draw: activeGameUpdatedCardsDrawEventFixture.draw,
            gameId: activeGameUpdatedCardsDrawEventFixture.gameBeforeUpdate.id,
            id: uuidContextFixture.uuid,
            kind: GameActionKind.draw,
            turn: activeGameUpdatedCardsDrawEventFixture.gameBeforeUpdate.state
              .turn,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having an ActiveGameUpdatedCardsPlayEvent', () => {
      let activeGameUpdatedCardsDrawEventFixture: ActiveGameUpdatedCardsPlayEvent;
      let uuidContextFixture: UuidContext;

      beforeAll(() => {
        activeGameUpdatedCardsDrawEventFixture =
          ActiveGameUpdatedEventFixtures.anyCardsPlayEvent;

        uuidContextFixture = {
          uuid: '738e3afd-b015-4385-ad87-378475db4847',
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameActionCreateQueryFromGameUpdateEventBuilder.build(
            activeGameUpdatedCardsDrawEventFixture,
            uuidContextFixture,
          );
        });

        it('should return a GameActionCreateQuery', () => {
          const expected: GameActionCreateQuery = {
            cards: activeGameUpdatedCardsDrawEventFixture.cards,
            currentPlayingSlotIndex:
              activeGameUpdatedCardsDrawEventFixture.gameBeforeUpdate.state
                .currentPlayingSlotIndex,
            gameId: activeGameUpdatedCardsDrawEventFixture.gameBeforeUpdate.id,
            id: uuidContextFixture.uuid,
            kind: GameActionKind.playCards,
            turn: activeGameUpdatedCardsDrawEventFixture.gameBeforeUpdate.state
              .turn,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having an ActiveGameUpdatedTurnPassEvent', () => {
      let activeGameUpdatedCardsDrawEventFixture: ActiveGameUpdatedTurnPassEvent;
      let uuidContextFixture: UuidContext;

      beforeAll(() => {
        activeGameUpdatedCardsDrawEventFixture =
          ActiveGameUpdatedEventFixtures.anyTurnPassEvent;

        uuidContextFixture = {
          uuid: '738e3afd-b015-4385-ad87-378475db4847',
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameActionCreateQueryFromGameUpdateEventBuilder.build(
            activeGameUpdatedCardsDrawEventFixture,
            uuidContextFixture,
          );
        });

        it('should return a GameActionCreateQuery', () => {
          const expected: GameActionCreateQuery = {
            currentPlayingSlotIndex:
              activeGameUpdatedCardsDrawEventFixture.gameBeforeUpdate.state
                .currentPlayingSlotIndex,
            gameId: activeGameUpdatedCardsDrawEventFixture.gameBeforeUpdate.id,
            id: uuidContextFixture.uuid,
            kind: GameActionKind.passTurn,
            turn: activeGameUpdatedCardsDrawEventFixture.gameBeforeUpdate.state
              .turn,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });
});
