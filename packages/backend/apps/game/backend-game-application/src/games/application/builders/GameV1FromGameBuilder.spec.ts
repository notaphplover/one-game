import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { Card, CardColor } from '@cornie-js/backend-game-domain/cards';
import {
  ActiveGame,
  ActiveGameSlot,
  GameCardSpec,
  GameDirection,
  NonStartedGame,
  NonStartedGameSlot,
} from '@cornie-js/backend-game-domain/games';
import {
  ActiveGameFixtures,
  NonStartedGameFixtures,
} from '@cornie-js/backend-game-domain/games/fixtures';

import { CardV1Fixtures } from '../../../cards/application/fixtures/CardV1Fixtures';
import { ActiveGameSlotV1Fixtures } from '../fixtures/ActiveGameSlotV1Fixtures';
import { GameSpecV1Fixtures } from '../fixtures/GameSpecV1Fixtures';
import { NonStartedGameSlotV1Fixtures } from '../fixtures/NonStartedGameSlotV1Fixtures';
import { GameV1FromGameBuilder } from './GameV1FromGameBuilder';

describe(GameV1FromGameBuilder.name, () => {
  let activeGameSlotV1FromActiveGameSlotBuilderMock: jest.Mocked<
    Builder<apiModels.ActiveGameSlotV1, [ActiveGameSlot]>
  >;
  let cardColorV1FromCardColorBuilderMock: jest.Mocked<
    Builder<apiModels.CardColorV1, [CardColor]>
  >;
  let cardV1FromCardBuilderMock: jest.Mocked<Builder<apiModels.CardV1, [Card]>>;
  let gameDirectionV1FromGameDirectionBuilderMock: jest.Mocked<
    Builder<apiModels.GameDirectionV1, [GameDirection]>
  >;
  let gameSpecV1FromGameCardSpecsBuilderMock: jest.Mocked<
    Builder<apiModels.GameSpecV1, [GameCardSpec[]]>
  >;
  let nonStartedGameSlotV1FromNonStartedGameSlotBuilderMock: jest.Mocked<
    Builder<apiModels.NonStartedGameSlotV1, [NonStartedGameSlot]>
  >;

  let gameV1FromGameBuilder: GameV1FromGameBuilder;

  beforeAll(() => {
    activeGameSlotV1FromActiveGameSlotBuilderMock = {
      build: jest.fn(),
    };
    cardColorV1FromCardColorBuilderMock = {
      build: jest.fn(),
    };
    cardV1FromCardBuilderMock = {
      build: jest.fn(),
    };
    gameDirectionV1FromGameDirectionBuilderMock = {
      build: jest.fn(),
    };
    gameSpecV1FromGameCardSpecsBuilderMock = {
      build: jest.fn(),
    };
    nonStartedGameSlotV1FromNonStartedGameSlotBuilderMock = {
      build: jest.fn(),
    };

    gameV1FromGameBuilder = new GameV1FromGameBuilder(
      activeGameSlotV1FromActiveGameSlotBuilderMock,
      cardColorV1FromCardColorBuilderMock,
      cardV1FromCardBuilderMock,
      gameDirectionV1FromGameDirectionBuilderMock,
      gameSpecV1FromGameCardSpecsBuilderMock,
      nonStartedGameSlotV1FromNonStartedGameSlotBuilderMock,
    );
  });

  describe('.build', () => {
    describe('having an ActiveGame', () => {
      let gameSlotFixture: ActiveGameSlot;
      let gameFixture: ActiveGame;

      beforeAll(() => {
        gameFixture = ActiveGameFixtures.withSlotsOne;
        [gameSlotFixture] = gameFixture.state.slots as [ActiveGameSlot];
      });

      describe('when called', () => {
        let activeGameSlotV1Fixture: apiModels.ActiveGameSlotV1;
        let cardV1Fixture: apiModels.CardV1;
        let cardColorV1Fixture: apiModels.CardColorV1;
        let gameDirectionV1Fixture: apiModels.GameDirectionV1;
        let gameSpecV1Fixture: apiModels.GameSpecV1;

        let result: unknown;

        beforeAll(() => {
          activeGameSlotV1Fixture = ActiveGameSlotV1Fixtures.any;
          cardV1Fixture = CardV1Fixtures.any;
          cardColorV1Fixture = 'blue';
          gameDirectionV1Fixture = 'antiClockwise';
          gameSpecV1Fixture = GameSpecV1Fixtures.any;

          activeGameSlotV1FromActiveGameSlotBuilderMock.build.mockReturnValueOnce(
            activeGameSlotV1Fixture,
          );
          cardColorV1FromCardColorBuilderMock.build.mockReturnValueOnce(
            cardColorV1Fixture,
          );
          cardV1FromCardBuilderMock.build.mockReturnValueOnce(cardV1Fixture);
          gameDirectionV1FromGameDirectionBuilderMock.build.mockReturnValueOnce(
            gameDirectionV1Fixture,
          );
          gameSpecV1FromGameCardSpecsBuilderMock.build.mockReturnValueOnce(
            gameSpecV1Fixture,
          );

          result = gameV1FromGameBuilder.build(gameFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call activeGameSlotV1FromActiveGameSlotBuilder.build()', () => {
          expect(
            activeGameSlotV1FromActiveGameSlotBuilderMock.build,
          ).toHaveBeenCalledTimes(1);
          expect(
            activeGameSlotV1FromActiveGameSlotBuilderMock.build,
          ).toHaveBeenCalledWith(gameSlotFixture);
        });

        it('should call cardColorV1FromCardColorBuilder.build()', () => {
          expect(
            cardColorV1FromCardColorBuilderMock.build,
          ).toHaveBeenCalledTimes(1);
          expect(
            cardColorV1FromCardColorBuilderMock.build,
          ).toHaveBeenCalledWith(gameFixture.state.currentColor);
        });

        it('should call cardV1FromCardBuilder.build()', () => {
          expect(cardV1FromCardBuilderMock.build).toHaveBeenCalledTimes(1);
          expect(cardV1FromCardBuilderMock.build).toHaveBeenCalledWith(
            gameFixture.state.currentCard,
          );
        });

        it('should call gameDirectionV1FromGameDirectionBuilder.build()', () => {
          expect(
            gameDirectionV1FromGameDirectionBuilderMock.build,
          ).toHaveBeenCalledTimes(1);
          expect(
            gameDirectionV1FromGameDirectionBuilderMock.build,
          ).toHaveBeenCalledWith(gameFixture.state.currentDirection);
        });

        it('should call gameSpecV1FromGameCardSpecsBuilder.build()', () => {
          expect(
            gameSpecV1FromGameCardSpecsBuilderMock.build,
          ).toHaveBeenCalledTimes(1);
          expect(
            gameSpecV1FromGameCardSpecsBuilderMock.build,
          ).toHaveBeenCalledWith(gameFixture.spec.cards);
        });

        it('should return a GameV1', () => {
          const expected: apiModels.ActiveGameV1 = {
            currentCard: cardV1Fixture,
            currentColor: cardColorV1Fixture,
            currentDirection: gameDirectionV1Fixture,
            currentPlayingSlotIndex: gameFixture.state.currentPlayingSlotIndex,
            currentTurnCardsPlayed: gameFixture.state.currentTurnCardsPlayed,
            drawCount: gameFixture.state.drawCount,
            gameSlotsAmount: gameFixture.spec.gameSlotsAmount,
            gameSpec: gameSpecV1Fixture,
            id: gameFixture.id,
            slots: [activeGameSlotV1Fixture],
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a NonStartedGame', () => {
      let gameSlotFixture: NonStartedGameSlot;
      let gameFixture: NonStartedGame;

      beforeAll(() => {
        gameFixture = NonStartedGameFixtures.withGameSlotsAmountOneAndSlotsOne;
        [gameSlotFixture] = gameFixture.state.slots as [NonStartedGameSlot];
      });

      describe('when called', () => {
        let nonStartedGameSlotV1Fixture: apiModels.NonStartedGameSlotV1;
        let gameSpecV1Fixture: apiModels.GameSpecV1;

        let result: unknown;

        beforeAll(() => {
          nonStartedGameSlotV1Fixture = NonStartedGameSlotV1Fixtures.any;
          gameSpecV1Fixture = GameSpecV1Fixtures.any;

          gameSpecV1FromGameCardSpecsBuilderMock.build.mockReturnValueOnce(
            gameSpecV1Fixture,
          );

          nonStartedGameSlotV1FromNonStartedGameSlotBuilderMock.build.mockReturnValueOnce(
            nonStartedGameSlotV1Fixture,
          );

          result = gameV1FromGameBuilder.build(gameFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call gameSpecV1FromGameCardSpecsBuilder.build()', () => {
          expect(
            gameSpecV1FromGameCardSpecsBuilderMock.build,
          ).toHaveBeenCalledTimes(1);
          expect(
            gameSpecV1FromGameCardSpecsBuilderMock.build,
          ).toHaveBeenCalledWith(gameFixture.spec.cards);
        });

        it('should call nonStartedGameSlotV1FromNonStartedGameSlotBuilder.build()', () => {
          expect(
            nonStartedGameSlotV1FromNonStartedGameSlotBuilderMock.build,
          ).toHaveBeenCalledTimes(1);
          expect(
            nonStartedGameSlotV1FromNonStartedGameSlotBuilderMock.build,
          ).toHaveBeenCalledWith(gameSlotFixture);
        });

        it('should return a GameV1', () => {
          const expected: apiModels.NonStartedGameV1 = {
            gameSlotsAmount: gameFixture.spec.gameSlotsAmount,
            gameSpec: gameSpecV1Fixture,
            id: gameFixture.id,
            slots: [nonStartedGameSlotV1Fixture],
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });
});
