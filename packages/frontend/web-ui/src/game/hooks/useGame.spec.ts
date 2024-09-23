import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../common/hooks/useRedirectUnauthorized');
jest.mock('../../common/hooks/useUrlLikeLocation');
jest.mock('../../user/hooks/useGetUserMe');
jest.mock('../helpers/getGameSlotIndex');
jest.mock('./useGameCards');
jest.mock('./useGetGamesV1GameId');
jest.mock('./useGetGamesV1GameIdSlotsSlotIdCards');

import { models as apiModels } from '@cornie-js/api-models';
import { renderHook, RenderHookResult } from '@testing-library/react';

import { useRedirectUnauthorized } from '../../common/hooks/useRedirectUnauthorized';
import { useUrlLikeLocation } from '../../common/hooks/useUrlLikeLocation';
import { UrlLikeLocation } from '../../common/models/UrlLikeLocation';
import { useGetUserMe } from '../../user/hooks/useGetUserMe';
import { getGameSlotIndex } from '../helpers/getGameSlotIndex';
import { useGame, UseGameResult } from './useGame';
import { useGameCards, UseGameCardsResult } from './useGameCards';
import { useGetGamesV1GameId } from './useGetGamesV1GameId';
import { useGetGamesV1GameIdSlotsSlotIdCards } from './useGetGamesV1GameIdSlotsSlotIdCards';

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
      ).mockReturnValueOnce({ result: null });

      (
        useGetGamesV1GameIdSlotsSlotIdCards as jest.Mock<
          typeof useGetGamesV1GameIdSlotsSlotIdCards
        >
      ).mockReturnValueOnce({ result: null });

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
        null,
      );
    });

    it('should call useGameCards()', () => {
      expect(useGameCards).toHaveBeenCalledTimes(1);
      expect(useGameCards).toHaveBeenCalledWith([]);
    });

    it('should retuen expected result', () => {
      const expected: UseGameResult = {
        currentCard: undefined,
        game: undefined,
        isPending: true,
        useGameCardsResult: useGameCardsResultFixture,
      };

      expect(renderResult.result.current).toStrictEqual(expected);
    });
  });

  describe('when called, and queries return non null results', () => {
    let gameCardsFixture: apiModels.CardArrayV1;
    let gameFixture: apiModels.ActiveGameV1;
    let gameIdFixture: string;
    let gameSlotIndexFixture: string;
    let urlLikeLocationFixture: UrlLikeLocation;
    let userFixture: apiModels.UserV1;
    let useGameCardsResultFixture: UseGameCardsResult;

    let renderResult: RenderHookResult<UseGameResult, unknown>;

    beforeAll(() => {
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
          slots: [],
          status: 'active',
        },
      };

      gameSlotIndexFixture = '0';

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
        result: {
          isRight: true,
          value: userFixture,
        },
      });

      (
        useGetGamesV1GameId as jest.Mock<typeof useGetGamesV1GameId>
      ).mockReturnValueOnce({
        result: {
          isRight: true,
          value: gameFixture,
        },
      });

      (
        useGetGamesV1GameIdSlotsSlotIdCards as jest.Mock<
          typeof useGetGamesV1GameIdSlotsSlotIdCards
        >
      ).mockReturnValueOnce({
        result: {
          isRight: true,
          value: gameCardsFixture,
        },
      });

      (
        getGameSlotIndex as jest.Mock<typeof getGameSlotIndex>
      ).mockReturnValueOnce(gameSlotIndexFixture);

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

    it('should call getGameSlotIndex()', () => {
      expect(getGameSlotIndex).toHaveBeenCalledTimes(1);
      expect(getGameSlotIndex).toHaveBeenCalledWith(gameFixture, userFixture);
    });

    it('should call useGetGamesV1GameIdSlotsSlotIdCards()', () => {
      expect(useGetGamesV1GameIdSlotsSlotIdCards).toHaveBeenCalledTimes(1);
      expect(useGetGamesV1GameIdSlotsSlotIdCards).toHaveBeenCalledWith(
        gameIdFixture,
        gameSlotIndexFixture,
      );
    });

    it('should call useGameCards()', () => {
      expect(useGameCards).toHaveBeenCalledTimes(1);
      expect(useGameCards).toHaveBeenCalledWith(gameCardsFixture);
    });

    it('should retuen expected result', () => {
      const expected: UseGameResult = {
        currentCard: gameFixture.state.currentCard,
        game: gameFixture,
        isPending: false,
        useGameCardsResult: useGameCardsResultFixture,
      };

      expect(renderResult.result.current).toStrictEqual(expected);
    });
  });
});
