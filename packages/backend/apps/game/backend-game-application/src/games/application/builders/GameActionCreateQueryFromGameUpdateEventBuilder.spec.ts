import { beforeAll, describe, expect, it } from '@jest/globals';

import {
  GameActionCreateQuery,
  GameActionKind,
} from '@cornie-js/backend-game-domain/gameActions';
import { ActiveGame } from '@cornie-js/backend-game-domain/games';

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

    describe('having an ActiveGameUpdatedCardsPlayEvent with an ActiveGame', () => {
      let activeGameUpdatedCardsDrawEventFixture: ActiveGameUpdatedCardsPlayEvent;
      let uuidContextFixture: UuidContext;

      beforeAll(() => {
        activeGameUpdatedCardsDrawEventFixture =
          ActiveGameUpdatedEventFixtures.cardPlayEventWithActiveGame;

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
            stateUpdate: {
              currentCard: (
                activeGameUpdatedCardsDrawEventFixture.game as ActiveGame
              ).state.currentCard,
              currentColor: (
                activeGameUpdatedCardsDrawEventFixture.game as ActiveGame
              ).state.currentColor,
              currentDirection: (
                activeGameUpdatedCardsDrawEventFixture.game as ActiveGame
              ).state.currentDirection,
              drawCount: (
                activeGameUpdatedCardsDrawEventFixture.game as ActiveGame
              ).state.drawCount,
            },
            turn: activeGameUpdatedCardsDrawEventFixture.gameBeforeUpdate.state
              .turn,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having an ActiveGameUpdatedCardsPlayEvent with a FinishedGame', () => {
      let activeGameUpdatedCardsDrawEventFixture: ActiveGameUpdatedCardsPlayEvent;
      let uuidContextFixture: UuidContext;

      beforeAll(() => {
        activeGameUpdatedCardsDrawEventFixture =
          ActiveGameUpdatedEventFixtures.cardPlayEventWithFinishedGame;

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
            stateUpdate: {
              currentCard: null,
              currentColor: null,
              currentDirection: null,
              drawCount: null,
            },
            turn: activeGameUpdatedCardsDrawEventFixture.gameBeforeUpdate.state
              .turn,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having an ActiveGameUpdatedTurnPassEvent with ActiveGame', () => {
      let activeGameUpdatedCardsDrawEventFixture: ActiveGameUpdatedTurnPassEvent;
      let uuidContextFixture: UuidContext;

      beforeAll(() => {
        activeGameUpdatedCardsDrawEventFixture =
          ActiveGameUpdatedEventFixtures.turnPassEventWithActiveGame;

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
            nextPlayingSlotIndex: (
              activeGameUpdatedCardsDrawEventFixture.game as ActiveGame
            ).state.currentPlayingSlotIndex,
            turn: activeGameUpdatedCardsDrawEventFixture.gameBeforeUpdate.state
              .turn,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having an ActiveGameUpdatedTurnPassEvent with FinishedGame', () => {
      let activeGameUpdatedCardsDrawEventFixture: ActiveGameUpdatedTurnPassEvent;
      let uuidContextFixture: UuidContext;

      beforeAll(() => {
        activeGameUpdatedCardsDrawEventFixture =
          ActiveGameUpdatedEventFixtures.turnPassEventWithFinishedGame;

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
            nextPlayingSlotIndex: null,
            turn: activeGameUpdatedCardsDrawEventFixture.gameBeforeUpdate.state
              .turn,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });
});
