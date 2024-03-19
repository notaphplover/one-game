import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { Card } from '@cornie-js/backend-game-domain/cards';
import { DrawGameAction } from '@cornie-js/backend-game-domain/gameActions';
import { ActiveGame } from '@cornie-js/backend-game-domain/games';

import { CardV1Fixtures } from '../../../cards/application/fixtures';
import { GameUpdatedMessageEventFixtures } from '../fixtures/GameUpdatedMessageEventFixtures';
import { GameMessageEvent } from '../models/GameMessageEvent';
import { GameEventV2FromGameMessageEventBuilder } from './GameEventV2FromGameMessageEventBuilder';

describe(GameEventV2FromGameMessageEventBuilder.name, () => {
  let cardV1FromCardBuilderMock: jest.Mocked<Builder<apiModels.CardV1, [Card]>>;

  let gameEventV2FromGameMessageEventBuilder: GameEventV2FromGameMessageEventBuilder;

  beforeAll(() => {
    cardV1FromCardBuilderMock = {
      build: jest.fn(),
    };

    gameEventV2FromGameMessageEventBuilder =
      new GameEventV2FromGameMessageEventBuilder(cardV1FromCardBuilderMock);
  });

  describe('.build', () => {
    describe('having a GameMessageEvent with an draw game action', () => {
      let gameMessageEventFixture: GameMessageEvent;

      beforeAll(() => {
        gameMessageEventFixture =
          GameUpdatedMessageEventFixtures.withGameActiveAndDrawGameAction;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameEventV2FromGameMessageEventBuilder.build(
            gameMessageEventFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return CardsDrawnGameEventV2', () => {
          const expected: apiModels.CardsDrawnGameEventV2 = {
            currentPlayingSlotIndex:
              gameMessageEventFixture.gameAction.currentPlayingSlotIndex,
            drawAmount: (gameMessageEventFixture.gameAction as DrawGameAction)
              .draw.length,
            kind: 'cardsDrawn',
            position: gameMessageEventFixture.gameAction.position,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a GameMessageEvent with an pass turn game action and game active', () => {
      let gameMessageEventFixture: GameMessageEvent;

      beforeAll(() => {
        gameMessageEventFixture =
          GameUpdatedMessageEventFixtures.withGameActiveAndPassTurnGameAction;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameEventV2FromGameMessageEventBuilder.build(
            gameMessageEventFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return CardsPlayedGameEventV2', () => {
          const expected: apiModels.TurnPassedGameEventV2 = {
            currentPlayingSlotIndex:
              gameMessageEventFixture.gameAction.currentPlayingSlotIndex,
            kind: 'turnPassed',
            nextPlayingSlotIndex: (gameMessageEventFixture.game as ActiveGame)
              .state.currentPlayingSlotIndex,
            position: gameMessageEventFixture.gameAction.position,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a GameMessageEvent with an pass turn game action and game finished', () => {
      let gameMessageEventFixture: GameMessageEvent;

      beforeAll(() => {
        gameMessageEventFixture =
          GameUpdatedMessageEventFixtures.withGameFinishedAndPassTurnGameAction;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameEventV2FromGameMessageEventBuilder.build(
            gameMessageEventFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return CardsPlayedGameEventV2', () => {
          const expected: apiModels.TurnPassedGameEventV2 = {
            currentPlayingSlotIndex:
              gameMessageEventFixture.gameAction.currentPlayingSlotIndex,
            kind: 'turnPassed',
            nextPlayingSlotIndex: null,
            position: gameMessageEventFixture.gameAction.position,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a GameMessageEvent with an play cards game action and game active', () => {
      let gameMessageEventFixture: GameMessageEvent;

      beforeAll(() => {
        gameMessageEventFixture =
          GameUpdatedMessageEventFixtures.withGameActiveAndPlayCardsGameActionAndCardsOne;
      });

      describe('when called', () => {
        let cardV1Fixture: apiModels.CardV1;

        let result: unknown;

        beforeAll(() => {
          cardV1Fixture = CardV1Fixtures.any;

          cardV1FromCardBuilderMock.build.mockReturnValue(cardV1Fixture);

          result = gameEventV2FromGameMessageEventBuilder.build(
            gameMessageEventFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();

          cardV1FromCardBuilderMock.build.mockReset();
        });

        it('should return CardsPlayedGameEventV2', () => {
          const expected: apiModels.CardsPlayedGameEventV2 = {
            cards: [cardV1Fixture],
            currentCard: (gameMessageEventFixture.game as ActiveGame).state
              .currentCard,
            currentPlayingSlotIndex:
              gameMessageEventFixture.gameAction.currentPlayingSlotIndex,
            kind: 'cardsPlayed',
            position: gameMessageEventFixture.gameAction.position,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a GameMessageEvent with an play cards game action and game finished', () => {
      let gameMessageEventFixture: GameMessageEvent;

      beforeAll(() => {
        gameMessageEventFixture =
          GameUpdatedMessageEventFixtures.withGameFinishedAndPlayCardsGameActionAndCardsOne;
      });

      describe('when called', () => {
        let cardV1Fixture: apiModels.CardV1;

        let result: unknown;

        beforeAll(() => {
          cardV1Fixture = CardV1Fixtures.any;

          cardV1FromCardBuilderMock.build.mockReturnValue(cardV1Fixture);

          result = gameEventV2FromGameMessageEventBuilder.build(
            gameMessageEventFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();

          cardV1FromCardBuilderMock.build.mockReset();
        });

        it('should return CardsPlayedGameEventV2', () => {
          const expected: apiModels.CardsPlayedGameEventV2 = {
            cards: [cardV1Fixture],
            currentCard: null,
            currentPlayingSlotIndex:
              gameMessageEventFixture.gameAction.currentPlayingSlotIndex,
            kind: 'cardsPlayed',
            position: gameMessageEventFixture.gameAction.position,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });
});
