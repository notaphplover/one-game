import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { Card } from '@cornie-js/backend-game-domain/cards';
import {
  DrawGameAction,
  GameAction,
  PassTurnGameAction,
} from '@cornie-js/backend-game-domain/gameActions';
import { GameActionFixtures } from '@cornie-js/backend-game-domain/gameActions/fixtures';

import { CardV1Fixtures } from '../../../cards/application/fixtures';
import { GameEventV2FromGameActionBuilder } from './GameEventV2FromGameActionBuilder';

describe(GameEventV2FromGameActionBuilder.name, () => {
  let cardV1FromCardBuilderMock: jest.Mocked<Builder<apiModels.CardV1, [Card]>>;

  let gameEventV2FromGameActionBuilder: GameEventV2FromGameActionBuilder;

  beforeAll(() => {
    cardV1FromCardBuilderMock = {
      build: jest.fn(),
    };

    gameEventV2FromGameActionBuilder = new GameEventV2FromGameActionBuilder(
      cardV1FromCardBuilderMock,
    );
  });

  describe('.build', () => {
    describe('having a GameMessageEvent with an draw game action', () => {
      let gameActionFixture: GameAction;

      beforeAll(() => {
        gameActionFixture = GameActionFixtures.withKindCardsDrawnAndDrawOne;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameEventV2FromGameActionBuilder.build(gameActionFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return CardsDrawnGameEventV2', () => {
          const expected: [string, apiModels.CardsDrawnGameEventV2] = [
            gameActionFixture.id,
            {
              currentPlayingSlotIndex:
                gameActionFixture.currentPlayingSlotIndex,
              drawAmount: (gameActionFixture as DrawGameAction).draw.length,
              kind: 'cardsDrawn',
              position: gameActionFixture.position,
            },
          ];

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a GameMessageEvent with an pass turn game action', () => {
      let gameActionFixture: GameAction;

      beforeAll(() => {
        gameActionFixture = GameActionFixtures.withKindPassTurn;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = gameEventV2FromGameActionBuilder.build(gameActionFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return CardsPlayedGameEventV2', () => {
          const expected: [string, apiModels.TurnPassedGameEventV2] = [
            gameActionFixture.id,
            {
              currentPlayingSlotIndex:
                gameActionFixture.currentPlayingSlotIndex,
              kind: 'turnPassed',
              nextPlayingSlotIndex: (gameActionFixture as PassTurnGameAction)
                .nextPlayingSlotIndex,
              position: gameActionFixture.position,
            },
          ];

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a GameMessageEvent with an play cards game action and current card', () => {
      let gameActionFixture: GameAction;

      beforeAll(() => {
        gameActionFixture =
          GameActionFixtures.withKindPlayCardsAndCardsOneAndCurrentCard;
      });

      describe('when called', () => {
        let cardV1Fixture: apiModels.CardV1;

        let result: unknown;

        beforeAll(() => {
          cardV1Fixture = CardV1Fixtures.any;

          cardV1FromCardBuilderMock.build.mockReturnValue(cardV1Fixture);

          result = gameEventV2FromGameActionBuilder.build(gameActionFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();

          cardV1FromCardBuilderMock.build.mockReset();
        });

        it('should return CardsPlayedGameEventV2', () => {
          const expected: [string, apiModels.CardsPlayedGameEventV2] = [
            gameActionFixture.id,
            {
              cards: [cardV1Fixture],
              currentCard: cardV1Fixture,
              currentPlayingSlotIndex:
                gameActionFixture.currentPlayingSlotIndex,
              kind: 'cardsPlayed',
              position: gameActionFixture.position,
            },
          ];

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a GameMessageEvent with an play cards game action and game finished', () => {
      let gameActionFixture: GameAction;

      beforeAll(() => {
        gameActionFixture =
          GameActionFixtures.withKindPlayCardsAndCardsOneAndCurrentCardNull;
      });

      describe('when called', () => {
        let cardV1Fixture: apiModels.CardV1;

        let result: unknown;

        beforeAll(() => {
          cardV1Fixture = CardV1Fixtures.any;

          cardV1FromCardBuilderMock.build.mockReturnValue(cardV1Fixture);

          result = gameEventV2FromGameActionBuilder.build(gameActionFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();

          cardV1FromCardBuilderMock.build.mockReset();
        });

        it('should return CardsPlayedGameEventV2', () => {
          const expected: [string, apiModels.CardsPlayedGameEventV2] = [
            gameActionFixture.id,
            {
              cards: [cardV1Fixture],
              currentCard: null,
              currentPlayingSlotIndex:
                gameActionFixture.currentPlayingSlotIndex,
              kind: 'cardsPlayed',
              position: gameActionFixture.position,
            },
          ];

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });
});
