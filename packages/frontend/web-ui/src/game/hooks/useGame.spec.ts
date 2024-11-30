import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../app/store/store');
jest.mock('../../common/helpers/mapUseQueryHookResultV2');
jest.mock('../../common/hooks/useCountdown');
jest.mock('../../common/hooks/useRedirectUnauthorized');
jest.mock('../../common/hooks/useUrlLikeLocation');
jest.mock('../../common/http/services/cornieApi');
jest.mock('../../user/hooks/useGetUserMe');
jest.mock('../helpers/buildEventSource');
jest.mock('../helpers/getGameSlotIndex');
jest.mock('./useGameCards');
jest.mock('./useGetGameSpecV1');
jest.mock('./useGetGamesV1GameId');
jest.mock('./useGetGamesV1GameIdSlotsSlotIdCards');

import { models as apiModels } from '@cornie-js/api-models';
import { QueryStatus } from '@reduxjs/toolkit/query';
import { renderHook, RenderHookResult } from '@testing-library/react';

import { mapUseQueryHookResultV2 } from '../../common/helpers/mapUseQueryHookResultV2';
import {
  useCountdown,
  UseCountdownResult,
} from '../../common/hooks/useCountdown';
import { useRedirectUnauthorized } from '../../common/hooks/useRedirectUnauthorized';
import { useUrlLikeLocation } from '../../common/hooks/useUrlLikeLocation';
import { cornieApi } from '../../common/http/services/cornieApi';
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
    let useCountdownResultFixture: UseCountdownResult;
    let useGameCardsResultFixture: UseGameCardsResult;
    let useUpdateGameV1MutationResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useUpdateGameV1Mutation>
    >;

    let renderResult: RenderHookResult<UseGameResult, unknown>;

    beforeAll(() => {
      gameIdFixture = 'game-id-fixture';

      urlLikeLocationFixture = {
        pathname: '/path',
        searchParams: new URLSearchParams(`?gameId=${gameIdFixture}`),
      } as Partial<UrlLikeLocation> as UrlLikeLocation;

      useCountdownResultFixture = {
        currentSeconds: 2,
        durationSeconds: 30,
        isRunning: true,
        start: jest.fn(),
        stop: jest.fn(),
      };

      useGameCardsResultFixture = {
        cards: [],
        deleteAllSelectedCard: jest.fn(),
        hasNext: false,
        hasPrevious: false,
        selectedCards: [],
        setNext: jest.fn(),
        setPrevious: jest.fn(),
        switchCardSelection: jest.fn(),
      };

      useUpdateGameV1MutationResultMock = [
        jest.fn(),
        {
          reset: jest.fn(),
          status: QueryStatus.uninitialized,
        },
      ];

      (
        useUrlLikeLocation as jest.Mock<typeof useUrlLikeLocation>
      ).mockReturnValue(urlLikeLocationFixture);

      (useGetUserMe as jest.Mock<typeof useGetUserMe>).mockReturnValue({
        queryResult: Symbol(),
        result: null,
      });

      (
        cornieApi.useUpdateGameV1Mutation as jest.Mock<
          typeof cornieApi.useUpdateGameV1Mutation
        >
      ).mockReturnValue(useUpdateGameV1MutationResultMock);

      (
        useGetGamesV1GameId as jest.Mock<typeof useGetGamesV1GameId>
      ).mockReturnValue({ queryResult: null, result: null });

      (
        mapUseQueryHookResultV2 as jest.Mock<typeof mapUseQueryHookResultV2>
      ).mockReturnValue(null);

      (
        useGetGamesV1GameIdSlotsSlotIdCards as jest.Mock<
          typeof useGetGamesV1GameIdSlotsSlotIdCards
        >
      ).mockReturnValue({
        result: null,
      } as Partial<UseGetGamesV1GameIdSlotsSlotIdCardsResult> as UseGetGamesV1GameIdSlotsSlotIdCardsResult);

      (useCountdown as jest.Mock<typeof useCountdown>).mockReturnValue(
        useCountdownResultFixture,
      );

      (useGetGameSpecV1 as jest.Mock<typeof useGetGameSpecV1>).mockReturnValue({
        result: null,
      });

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
      (useCountdown as jest.Mock<typeof useCountdown>).mockReset();
      (getGameSlotIndex as jest.Mock<typeof getGameSlotIndex>).mockReset();
      (useGetGameSpecV1 as jest.Mock<typeof useGetGameSpecV1>).mockReset();
      (useGameCards as jest.Mock<typeof useGameCards>).mockReset();
      (
        cornieApi.useUpdateGameV1Mutation as jest.Mock<
          typeof cornieApi.useUpdateGameV1Mutation
        >
      ).mockReset();
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

    it('should return cornieApi.useUpdateGameV1Mutation()', () => {
      expect(cornieApi.useUpdateGameV1Mutation).toHaveBeenCalledTimes(1);
      expect(cornieApi.useUpdateGameV1Mutation).toHaveBeenCalledWith();
    });

    it('should call mapUseQueryHookResultV2()', () => {
      expect(mapUseQueryHookResultV2).toHaveBeenCalledTimes(1);
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        1,
        useUpdateGameV1MutationResultMock[1],
      );
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
        closeErrorMessage: expect.any(Function) as unknown as () => void,
        currentCard: undefined,
        deckCardsAmount: undefined,
        errorMessage: undefined,
        game: undefined,
        isDrawingCardAllowed: false,
        isMyTurn: false,
        isPassingTurnAllowed: false,
        isPending: true,
        isPlayingCardsAllowed: false,
        onHandleDrawCardsGame: expect.any(Function) as unknown as (
          event: React.FormEvent,
        ) => void,
        onHandlePassTurnGame: expect.any(Function) as unknown as (
          event: React.FormEvent,
        ) => void,
        onHandlePlayCardsGame: expect.any(Function) as unknown as (
          event: React.FormEvent,
        ) => void,
        openErrorMessage: false,
        useCountdownResult: useCountdownResultFixture,
        useGameCardsResult: useGameCardsResultFixture,
      };

      expect(renderResult.result.current).toStrictEqual(expected);
    });
  });

  describe('when called, and queries return non null results, and getGameSlotIndex returns playing slot index', () => {
    let cornieEventSourceMock: jest.Mocked<CornieEventSource>;
    let gameCardsFixture: apiModels.CardArrayV1;
    let gameFixture: apiModels.ActiveGameV1;
    let gameIdFixture: string;
    let gameSlotIndexFixture: number;
    let urlLikeLocationFixture: UrlLikeLocation;
    let userFixture: apiModels.UserV1;
    let useGetGameSpecV1ResultFixture: UseGetGameSpecV1Result;
    let useCountdownResultFixture: UseCountdownResult;
    let useGameCardsResultFixture: UseGameCardsResult;
    let useUpdateGameV1MutationResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useUpdateGameV1Mutation>
    >;

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

      useUpdateGameV1MutationResultMock = [
        jest.fn(),
        {
          reset: jest.fn(),
          status: QueryStatus.uninitialized,
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
          turnExpiresAt: '2020-01-01T00:00:00.000Z',
        },
      };

      gameSlotIndexFixture = gameFixture.state.currentPlayingSlotIndex;

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
        deleteAllSelectedCard: jest.fn(),
        hasNext: false,
        hasPrevious: false,
        selectedCards: [],
        setNext: jest.fn(),
        setPrevious: jest.fn(),
        switchCardSelection: jest.fn(),
      };

      useCountdownResultFixture = {
        currentSeconds: 2,
        durationSeconds: 30,
        isRunning: true,
        start: jest.fn(),
        stop: jest.fn(),
      };

      (
        useUrlLikeLocation as jest.Mock<typeof useUrlLikeLocation>
      ).mockReturnValue(urlLikeLocationFixture);

      (
        cornieApi.useUpdateGameV1Mutation as jest.Mock<
          typeof cornieApi.useUpdateGameV1Mutation
        >
      ).mockReturnValue(useUpdateGameV1MutationResultMock);

      (
        mapUseQueryHookResultV2 as jest.Mock<typeof mapUseQueryHookResultV2>
      ).mockReturnValue(null);

      (useGetUserMe as jest.Mock<typeof useGetUserMe>).mockReturnValue({
        queryResult: Symbol(),
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

      (useCountdown as jest.Mock<typeof useCountdown>).mockReturnValue(
        useCountdownResultFixture,
      );

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
      (useCountdown as jest.Mock<typeof useCountdown>).mockReset();
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
        gameFixture,
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

    it('should return cornieApi.useUpdateGameV1Mutation()', () => {
      expect(cornieApi.useUpdateGameV1Mutation).toHaveBeenCalledTimes(2);
      expect(cornieApi.useUpdateGameV1Mutation).toHaveBeenCalledWith();
    });

    it('should call mapUseQueryHookResultV2()', () => {
      expect(mapUseQueryHookResultV2).toHaveBeenCalledTimes(2);
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        1,
        useUpdateGameV1MutationResultMock[1],
      );
      expect(mapUseQueryHookResultV2).toHaveBeenNthCalledWith(
        2,
        useUpdateGameV1MutationResultMock[1],
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
        closeErrorMessage: expect.any(Function) as unknown as () => void,
        currentCard: gameFixture.state.currentCard,
        deckCardsAmount: 189,
        errorMessage: undefined,
        game: gameFixture,
        isDrawingCardAllowed: true,
        isMyTurn: true,
        isPassingTurnAllowed: false,
        isPending: false,
        isPlayingCardsAllowed: true,
        onHandleDrawCardsGame: expect.any(Function) as unknown as (
          event: React.FormEvent,
        ) => void,
        onHandlePassTurnGame: expect.any(Function) as unknown as (
          event: React.FormEvent,
        ) => void,
        onHandlePlayCardsGame: expect.any(Function) as unknown as (
          event: React.FormEvent,
        ) => void,
        openErrorMessage: false,
        useCountdownResult: useCountdownResultFixture,
        useGameCardsResult: useGameCardsResultFixture,
      };

      expect(renderResult.result.current).toStrictEqual(expected);
    });
  });
});
