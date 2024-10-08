import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../common/hooks/useRedirectUnauthorized');
jest.mock('../../common/hooks/useUrlLikeLocation');
jest.mock('../../user/hooks/useGetUserMe');
jest.mock('../helpers/buildEventSource');
jest.mock('../helpers/getGameSlotIndex');
jest.mock('./useGameCards');
jest.mock('./useGetGameSpecV1');
jest.mock('./useGetGamesV1GameId');
jest.mock('./useGetGamesV1GameIdSlotsSlotIdCards');

import { models as apiModels } from '@cornie-js/api-models';
import { renderHook, RenderHookResult } from '@testing-library/react';

import { useRedirectUnauthorized } from '../../common/hooks/useRedirectUnauthorized';
import { useUrlLikeLocation } from '../../common/hooks/useUrlLikeLocation';
import { CornieEventSource } from '../../common/http/services/CornieEventSource';
import { UrlLikeLocation } from '../../common/models/UrlLikeLocation';
import { useGetUserMe } from '../../user/hooks/useGetUserMe';
import { buildEventSource } from '../helpers/buildEventSource';
import { getGameSlotIndex } from '../helpers/getGameSlotIndex';
import { useGame, UseGameResult } from './useGame';
import { useGameCards, UseGameCardsResult } from './useGameCards';
import { useGetGameSpecV1, UseGetGameSpecV1Result } from './useGetGameSpecV1';
import { useGetGamesV1GameId } from './useGetGamesV1GameId';
import {
  useGetGamesV1GameIdSlotsSlotIdCards,
  UseGetGamesV1GameIdSlotsSlotIdCardsResult,
} from './useGetGamesV1GameIdSlotsSlotIdCards';

describe(useGame.name, () => {
  describe('when called, and queries return null result', () => {
    let gameIdFixture: string;
    let urlLikeLocationFixture: UrlLikeLocation;
    let useGameCardsResultFixture: UseGameCardsResult;

    let renderResult: RenderHookResult<UseGameResult, unknown>;

    beforeAll(() => {
      gameIdFixture = 'game-id-fixture';

      urlLikeLocationFixture = {
        pathname: '/path',
        searchParams: new URLSearchParams(`?gameId=${gameIdFixture}`),
      } as Partial<UrlLikeLocation> as UrlLikeLocation;

      useGameCardsResultFixture = {
        cards: [],
        hasNext: false,
        hasPrevious: false,
        setNext: jest.fn(),
        setPrevious: jest.fn(),
      };

      (
        useUrlLikeLocation as jest.Mock<typeof useUrlLikeLocation>
      ).mockReturnValueOnce(urlLikeLocationFixture);

      (useGetUserMe as jest.Mock<typeof useGetUserMe>).mockReturnValueOnce({
        result: null,
      });

      (
        useGetGamesV1GameId as jest.Mock<typeof useGetGamesV1GameId>
      ).mockReturnValueOnce({ queryResult: null, result: null });

      (
        useGetGamesV1GameIdSlotsSlotIdCards as jest.Mock<
          typeof useGetGamesV1GameIdSlotsSlotIdCards
        >
      ).mockReturnValueOnce({
        result: null,
      } as Partial<UseGetGamesV1GameIdSlotsSlotIdCardsResult> as UseGetGamesV1GameIdSlotsSlotIdCardsResult);

      (
        useGetGameSpecV1 as jest.Mock<typeof useGetGameSpecV1>
      ).mockReturnValueOnce({
        result: null,
      });

      (useGameCards as jest.Mock<typeof useGameCards>).mockReturnValueOnce(
        useGameCardsResultFixture,
      );

      renderResult = renderHook(() => useGame());
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call useRedirectUnauthorized()', () => {
      expect(useRedirectUnauthorized).toHaveBeenCalledTimes(1);
      expect(useRedirectUnauthorized).toHaveBeenCalledWith();
    });

    it('should call useGetUserMe()', () => {
      expect(useGetUserMe).toHaveBeenCalledTimes(1);
      expect(useGetUserMe).toHaveBeenCalledWith();
    });

    it('should call useGetGamesV1GameId()', () => {
      expect(useGetGamesV1GameId).toHaveBeenCalledTimes(1);
      expect(useGetGamesV1GameId).toHaveBeenCalledWith(gameIdFixture);
    });

    it('should not call getGameSlotIndex()', () => {
      expect(getGameSlotIndex).not.toHaveBeenCalled();
    });

    it('should call useGetGamesV1GameIdSlotsSlotIdCards()', () => {
      expect(useGetGamesV1GameIdSlotsSlotIdCards).toHaveBeenCalledTimes(1);
      expect(useGetGamesV1GameIdSlotsSlotIdCards).toHaveBeenCalledWith(
        gameIdFixture,
        undefined,
      );
    });

    it('should call useGameCards()', () => {
      expect(useGameCards).toHaveBeenCalledTimes(1);
      expect(useGameCards).toHaveBeenCalledWith([]);
    });

    it('should retuen expected result', () => {
      const expected: UseGameResult = {
        currentCard: undefined,
        deckCardsAmount: undefined,
        game: undefined,
        isPending: true,
        useGameCardsResult: useGameCardsResultFixture,
      };

      expect(renderResult.result.current).toStrictEqual(expected);
    });
  });

  describe('when called, and queries return non null results', () => {
    let cornieEventSourceMock: jest.Mocked<CornieEventSource>;
    let gameCardsFixture: apiModels.CardArrayV1;
    let gameFixture: apiModels.ActiveGameV1;
    let gameIdFixture: string;
    let gameSlotIndexFixture: number;
    let urlLikeLocationFixture: UrlLikeLocation;
    let userFixture: apiModels.UserV1;
    let useGetGameSpecV1ResultFixture: UseGetGameSpecV1Result;
    let useGameCardsResultFixture: UseGameCardsResult;

    let renderResult: RenderHookResult<UseGameResult, unknown>;

    beforeAll(() => {
      cornieEventSourceMock = {
        close: jest.fn(),
      } as Partial<
        jest.Mocked<CornieEventSource>
      > as jest.Mocked<CornieEventSource>;
      gameCardsFixture = [
        {
          kind: 'wildDraw4',
        },
      ];

      gameFixture = {
        id: 'game-id-fixture',
        isPublic: true,
        state: {
          currentCard: {
            kind: 'wild',
          },
          currentColor: 'blue',
          currentDirection: 'clockwise',
          currentPlayingSlotIndex: 0,
          currentTurnCardsDrawn: false,
          currentTurnCardsPlayed: false,
          drawCount: 0,
          lastEventId: 'last-event-id-fixture',
          slots: [
            {
              cardsAmount: 10,
              userId: 'user-id-fixture',
            },
          ],
          status: 'active',
        },
      };

      gameSlotIndexFixture = 0;

      userFixture = {
        active: true,
        id: 'user-id-fixture',
        name: 'user-name-fixture',
      };

      gameIdFixture = gameFixture.id;

      urlLikeLocationFixture = {
        pathname: '/path',
        searchParams: new URLSearchParams(`?gameId=${gameIdFixture}`),
      } as Partial<UrlLikeLocation> as UrlLikeLocation;

      useGetGameSpecV1ResultFixture = {
        result: {
          isRight: true,
          value: {
            cardSpecs: [
              {
                amount: 200,
                card: {
                  kind: 'wild',
                },
              },
            ],
            gameId: 'game-id-fixture',
            gameSlotsAmount: 2,
            options: {
              chainDraw2Draw2Cards: true,
              chainDraw2Draw4Cards: true,
              chainDraw4Draw2Cards: true,
              chainDraw4Draw4Cards: true,
              playCardIsMandatory: true,
              playMultipleSameCards: true,
              playWildDraw4IfNoOtherAlternative: false,
            },
          },
        },
      };

      useGameCardsResultFixture = {
        cards: [],
        hasNext: false,
        hasPrevious: false,
        setNext: jest.fn(),
        setPrevious: jest.fn(),
      };

      (
        useUrlLikeLocation as jest.Mock<typeof useUrlLikeLocation>
      ).mockReturnValue(urlLikeLocationFixture);

      (useGetUserMe as jest.Mock<typeof useGetUserMe>).mockReturnValue({
        result: {
          isRight: true,
          value: userFixture,
        },
      });

      (
        useGetGamesV1GameId as jest.Mock<typeof useGetGamesV1GameId>
      ).mockReturnValue({
        queryResult: Symbol(),
        result: {
          isRight: true,
          value: gameFixture,
        },
      });

      (
        buildEventSource as jest.Mock<typeof buildEventSource>
      ).mockReturnValueOnce(cornieEventSourceMock);

      (
        useGetGamesV1GameIdSlotsSlotIdCards as jest.Mock<
          typeof useGetGamesV1GameIdSlotsSlotIdCards
        >
      ).mockReturnValue({
        result: {
          isRight: true,
          value: gameCardsFixture,
        },
      } as Partial<UseGetGamesV1GameIdSlotsSlotIdCardsResult> as UseGetGamesV1GameIdSlotsSlotIdCardsResult);

      (getGameSlotIndex as jest.Mock<typeof getGameSlotIndex>).mockReturnValue(
        gameSlotIndexFixture,
      );

      (useGetGameSpecV1 as jest.Mock<typeof useGetGameSpecV1>).mockReturnValue(
        useGetGameSpecV1ResultFixture,
      );

      (useGameCards as jest.Mock<typeof useGameCards>).mockReturnValue(
        useGameCardsResultFixture,
      );

      renderResult = renderHook(() => useGame());
    });

    afterAll(() => {
      jest.clearAllMocks();

      (useUrlLikeLocation as jest.Mock<typeof useUrlLikeLocation>).mockReset();
      (useGetUserMe as jest.Mock<typeof useGetUserMe>).mockReset();
      (
        useGetGamesV1GameId as jest.Mock<typeof useGetGamesV1GameId>
      ).mockReset();
      (
        useGetGamesV1GameIdSlotsSlotIdCards as jest.Mock<
          typeof useGetGamesV1GameIdSlotsSlotIdCards
        >
      ).mockReset();
      (getGameSlotIndex as jest.Mock<typeof getGameSlotIndex>).mockReset();
      (useGetGameSpecV1 as jest.Mock<typeof useGetGameSpecV1>).mockReset();
      (useGameCards as jest.Mock<typeof useGameCards>).mockReset();
    });

    it('should call useRedirectUnauthorized()', () => {
      expect(useRedirectUnauthorized).toHaveBeenCalledTimes(2);
      expect(useRedirectUnauthorized).toHaveBeenCalledWith();
    });

    it('should call useGetUserMe()', () => {
      expect(useGetUserMe).toHaveBeenCalledTimes(2);
      expect(useGetUserMe).toHaveBeenCalledWith();
    });

    it('should call useGetGamesV1GameId()', () => {
      expect(useGetGamesV1GameId).toHaveBeenCalledTimes(2);
      expect(useGetGamesV1GameId).toHaveBeenNthCalledWith(1, gameIdFixture);
      expect(useGetGamesV1GameId).toHaveBeenNthCalledWith(2, gameIdFixture);
    });

    it('should call getGameSlotIndex()', () => {
      expect(getGameSlotIndex).toHaveBeenCalledTimes(2);
      expect(getGameSlotIndex).toHaveBeenNthCalledWith(
        1,
        undefined,
        userFixture,
      );
      expect(getGameSlotIndex).toHaveBeenNthCalledWith(
        2,
        gameFixture,
        userFixture,
      );
    });

    it('should call buildEventSource()', () => {
      expect(buildEventSource).toHaveBeenCalledTimes(1);
      expect(buildEventSource).toHaveBeenCalledWith(
        gameFixture,
        expect.any(Function),
      );
    });

    it('should call useGetGamesV1GameIdSlotsSlotIdCards()', () => {
      expect(useGetGamesV1GameIdSlotsSlotIdCards).toHaveBeenCalledTimes(2);
      expect(useGetGamesV1GameIdSlotsSlotIdCards).toHaveBeenNthCalledWith(
        1,
        gameIdFixture,
        gameSlotIndexFixture.toString(),
      );
      expect(useGetGamesV1GameIdSlotsSlotIdCards).toHaveBeenNthCalledWith(
        2,
        gameIdFixture,
        gameSlotIndexFixture.toString(),
      );
    });

    it('should call useGameCards()', () => {
      expect(useGameCards).toHaveBeenCalledTimes(2);
      expect(useGameCards).toHaveBeenNthCalledWith(1, gameCardsFixture);
      expect(useGameCards).toHaveBeenNthCalledWith(2, gameCardsFixture);
    });

    it('should return expected result', () => {
      const expected: UseGameResult = {
        currentCard: gameFixture.state.currentCard,
        deckCardsAmount: 189,
        game: gameFixture,
        isPending: false,
        useGameCardsResult: useGameCardsResultFixture,
      };

      expect(renderResult.result.current).toStrictEqual(expected);
    });
  });
});
