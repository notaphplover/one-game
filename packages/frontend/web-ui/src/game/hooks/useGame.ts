import { models as apiModels } from '@cornie-js/api-models';
import { useEffect, useState } from 'react';

import { useRedirectUnauthorized } from '../../common/hooks/useRedirectUnauthorized';
import { useUrlLikeLocation } from '../../common/hooks/useUrlLikeLocation';
import { CornieEventSource } from '../../common/http/services/CornieEventSource';
import { UrlLikeLocation } from '../../common/models/UrlLikeLocation';
import { useGetUserMe } from '../../user/hooks/useGetUserMe';
import { buildEventSource } from '../helpers/buildEventSource';
import { getGameSlotIndex } from '../helpers/getGameSlotIndex';
import { handleGameMessageEvents } from '../helpers/handleGameMessageEvents';
import { isActiveGame } from '../helpers/isActiveGame';
import { isFinishedGame } from '../helpers/isFinishedGame';
import { useGameCards, UseGameCardsResult } from './useGameCards';
import { useGetGamesV1GameId } from './useGetGamesV1GameId';
import { useGetGamesV1GameIdSlotsSlotIdCards } from './useGetGamesV1GameIdSlotsSlotIdCards';

export interface UseGameResult {
  currentCard: apiModels.CardV1 | undefined;
  game: apiModels.GameV1 | undefined;
  isPending: boolean;
  useGameCardsResult: UseGameCardsResult;
}

function getGameCurrentCard(
  game: apiModels.GameV1 | undefined,
): apiModels.CardV1 | undefined {
  return game?.state.status === 'active' ? game.state.currentCard : undefined;
}

export const useGame = (): UseGameResult => {
  useRedirectUnauthorized();

  const url: UrlLikeLocation = useUrlLikeLocation();
  const gameIdParam: string | undefined =
    url.searchParams.get('gameId') ?? undefined;

  const { result: usersV1MeResult } = useGetUserMe();

  const { queryResult: gamesV1GameIdQueryResult, result: gamesV1GameIdResult } =
    useGetGamesV1GameId(gameIdParam);

  const [game, setGame] = useState<apiModels.GameV1>();

  const [messageEventsQueue, setMessageEventsQueue] = useState<
    [string, apiModels.GameEventV2][]
  >([]);

  const [eventSource, setEventSource] = useState<CornieEventSource>();

  useEffect(() => {
    const game: apiModels.GameV1 | undefined =
      gamesV1GameIdResult?.isRight === true
        ? gamesV1GameIdResult.value
        : undefined;

    if (isActiveGame(game)) {
      setGame(game);

      if (eventSource === undefined) {
        setEventSource(buildEventSource(game, setMessageEventsQueue));
      }
    } else {
      if (isFinishedGame(game)) {
        setGame(game);

        if (eventSource !== undefined) {
          eventSource.close();
          setEventSource(undefined);
        }
      }
    }
  }, [gamesV1GameIdQueryResult]);

  const currentCard: apiModels.CardV1 | undefined = getGameCurrentCard(game);

  const gameSlotIndexParam: number | undefined =
    usersV1MeResult?.isRight === true
      ? getGameSlotIndex(game, usersV1MeResult.value)
      : undefined;

  const {
    refetch: refetchGamesV1GameIdSlotsSlotIdCards,
    result: gamesV1GameIdSlotsSlotIdCardsResult,
  } = useGetGamesV1GameIdSlotsSlotIdCards(
    gameIdParam,
    gameSlotIndexParam?.toString(),
  );

  const isPending =
    gamesV1GameIdResult === null ||
    gamesV1GameIdSlotsSlotIdCardsResult === null;

  const gameCards: apiModels.CardArrayV1 =
    gamesV1GameIdSlotsSlotIdCardsResult?.isRight === true
      ? gamesV1GameIdSlotsSlotIdCardsResult.value
      : [];

  const useGameCardsResult: UseGameCardsResult = useGameCards(gameCards);

  useEffect(() => {
    if (isActiveGame(game)) {
      const updatedGame: apiModels.ActiveGameV1 | apiModels.FinishedGameV1 =
        handleGameMessageEvents(
          game,
          messageEventsQueue,
          (gameSlotIndex: number): void => {
            if (gameSlotIndex === gameSlotIndexParam) {
              void refetchGamesV1GameIdSlotsSlotIdCards();
            }
          },
        );

      setGame(updatedGame);
    } else {
      if (isFinishedGame(game)) {
        if (eventSource !== undefined) {
          eventSource.close();
          setEventSource(undefined);
        }
      }
    }

    if (messageEventsQueue.length > 0) {
      setMessageEventsQueue([]);
    }
  }, [messageEventsQueue]);

  return {
    currentCard,
    game,
    isPending,
    useGameCardsResult,
  };
};
