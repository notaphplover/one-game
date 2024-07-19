import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { CardRequiresColorChoiceSpec } from '@cornie-js/backend-game-domain/cards';
import {
  ActiveGame,
  ActiveGameSlot,
  CurrentPlayerCanPlayCardsSpec,
  GameOptions,
  GameService,
} from '@cornie-js/backend-game-domain/games';
import {
  ActiveGameFixtures,
  GameOptionsFixtures,
} from '@cornie-js/backend-game-domain/games/fixtures';

import { RandomGameIdPlayCardsQueryV1FromActiveGameBuilder } from './RandomGameIdPlayCardsQueryV1FromActiveGameBuilder';

describe(RandomGameIdPlayCardsQueryV1FromActiveGameBuilder.name, () => {
  let cardRequiresColorChoiceSpecMock: jest.Mocked<CardRequiresColorChoiceSpec>;
  let currentPlayerCanPlayCardsSpecMock: jest.Mocked<CurrentPlayerCanPlayCardsSpec>;
  let gameServiceMock: jest.Mocked<GameService>;

  let randomGameIdPlayCardsQueryV1FromActiveGameBuilder: RandomGameIdPlayCardsQueryV1FromActiveGameBuilder;

  beforeAll(() => {
    cardRequiresColorChoiceSpecMock = {
      isSatisfiedBy: jest.fn(),
    } as Partial<
      jest.Mocked<CardRequiresColorChoiceSpec>
    > as jest.Mocked<CardRequiresColorChoiceSpec>;

    currentPlayerCanPlayCardsSpecMock = {
      isSatisfiedBy: jest.fn(),
    } as Partial<
      jest.Mocked<CurrentPlayerCanPlayCardsSpec>
    > as jest.Mocked<CurrentPlayerCanPlayCardsSpec>;

    gameServiceMock = {
      getGameSlotOrThrow: jest.fn() as unknown,
    } as Partial<jest.Mocked<GameService>> as jest.Mocked<GameService>;

    randomGameIdPlayCardsQueryV1FromActiveGameBuilder =
      new RandomGameIdPlayCardsQueryV1FromActiveGameBuilder(
        cardRequiresColorChoiceSpecMock,
        currentPlayerCanPlayCardsSpecMock,
        gameServiceMock,
      );
  });

  describe('.build', () => {
    let activeGameFixture: ActiveGame;
    let gameOptionsFixture: GameOptions;

    beforeAll(() => {
      activeGameFixture = ActiveGameFixtures.withSlotsOneWithCards;
      gameOptionsFixture = GameOptionsFixtures.any;
    });

    describe('when called, and currentPlayerCanPlayCardsSpec.isSatisfiedBy() returns false', () => {
      let result: unknown;

      beforeAll(() => {
        currentPlayerCanPlayCardsSpecMock.isSatisfiedBy.mockReturnValue(false);

        gameServiceMock.getGameSlotOrThrow.mockReturnValueOnce(
          activeGameFixture.state.slots[0] as ActiveGameSlot,
        );

        result = randomGameIdPlayCardsQueryV1FromActiveGameBuilder.build(
          activeGameFixture,
          gameOptionsFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();

        currentPlayerCanPlayCardsSpecMock.isSatisfiedBy.mockReset();
      });

      it('should call gameService.getGameSlotOrThrow()', () => {
        expect(gameServiceMock.getGameSlotOrThrow).toHaveBeenCalledTimes(1);
        expect(gameServiceMock.getGameSlotOrThrow).toHaveBeenCalledWith(
          activeGameFixture,
          activeGameFixture.state.currentPlayingSlotIndex,
        );
      });

      it('should call currentPlayerCanPlayCardsSpec.isSatisfiedBy()', () => {
        expect(
          currentPlayerCanPlayCardsSpecMock.isSatisfiedBy,
        ).toHaveBeenCalled();
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when called, and currentPlayerCanPlayCardsSpec.isSatisfiedBy() returns true and cardRequiresColorChoiceSpec.isSatisfiedBy() returns false', () => {
      let result: unknown;

      beforeAll(() => {
        currentPlayerCanPlayCardsSpecMock.isSatisfiedBy
          .mockReturnValueOnce(true)
          .mockReturnValue(false);

        gameServiceMock.getGameSlotOrThrow.mockReturnValueOnce(
          activeGameFixture.state.slots[0] as ActiveGameSlot,
        );

        cardRequiresColorChoiceSpecMock.isSatisfiedBy.mockReturnValueOnce(
          false,
        );

        result = randomGameIdPlayCardsQueryV1FromActiveGameBuilder.build(
          activeGameFixture,
          gameOptionsFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();

        currentPlayerCanPlayCardsSpecMock.isSatisfiedBy.mockReset();
      });

      it('should call gameService.getGameSlotOrThrow()', () => {
        expect(gameServiceMock.getGameSlotOrThrow).toHaveBeenCalledTimes(1);
        expect(gameServiceMock.getGameSlotOrThrow).toHaveBeenCalledWith(
          activeGameFixture,
          activeGameFixture.state.currentPlayingSlotIndex,
        );
      });

      it('should call currentPlayerCanPlayCardsSpec.isSatisfiedBy()', () => {
        expect(
          currentPlayerCanPlayCardsSpecMock.isSatisfiedBy,
        ).toHaveBeenCalled();
      });

      it('should return apiModels.GameIdUpdateQueryV1', () => {
        const expected: apiModels.GameIdUpdateQueryV1 = {
          cardIndexes: [0],
          kind: 'playCards',
          slotIndex: activeGameFixture.state.currentPlayingSlotIndex,
        };

        expect(result).toStrictEqual(expected);
      });
    });

    describe('when called, and currentPlayerCanPlayCardsSpec.isSatisfiedBy() returns true and cardRequiresColorChoiceSpec.isSatisfiedBy() returns true', () => {
      let result: unknown;

      beforeAll(() => {
        currentPlayerCanPlayCardsSpecMock.isSatisfiedBy
          .mockReturnValueOnce(true)
          .mockReturnValue(false);

        gameServiceMock.getGameSlotOrThrow.mockReturnValueOnce(
          activeGameFixture.state.slots[0] as ActiveGameSlot,
        );

        cardRequiresColorChoiceSpecMock.isSatisfiedBy.mockReturnValueOnce(true);

        result = randomGameIdPlayCardsQueryV1FromActiveGameBuilder.build(
          activeGameFixture,
          gameOptionsFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();

        currentPlayerCanPlayCardsSpecMock.isSatisfiedBy.mockReset();
      });

      it('should call gameService.getGameSlotOrThrow()', () => {
        expect(gameServiceMock.getGameSlotOrThrow).toHaveBeenCalledTimes(1);
        expect(gameServiceMock.getGameSlotOrThrow).toHaveBeenCalledWith(
          activeGameFixture,
          activeGameFixture.state.currentPlayingSlotIndex,
        );
      });

      it('should call currentPlayerCanPlayCardsSpec.isSatisfiedBy()', () => {
        expect(
          currentPlayerCanPlayCardsSpecMock.isSatisfiedBy,
        ).toHaveBeenCalled();
      });

      it('should return apiModels.GameIdUpdateQueryV1', () => {
        const expected: apiModels.GameIdUpdateQueryV1 = {
          cardIndexes: [0],
          colorChoice: expect.any(String) as unknown as apiModels.CardColorV1,
          kind: 'playCards',
          slotIndex: activeGameFixture.state.currentPlayingSlotIndex,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
