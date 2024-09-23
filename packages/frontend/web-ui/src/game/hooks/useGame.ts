import { models as apiModels } from '@cornie-js/api-models';

import { useRedirectUnauthorized } from '../../common/hooks/useRedirectUnauthorized';
import { useUrlLikeLocation } from '../../common/hooks/useUrlLikeLocation';
import { UrlLikeLocation } from '../../common/models/UrlLikeLocation';
import { useGetUserMe } from '../../user/hooks/useGetUserMe';
import { getGameSlotIndex } from '../helpers/getGameSlotIndex';
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
  const gameIdParam: string | null = url.searchParams.get('gameId');

  const { result: usersV1MeResult } = useGetUserMe();

  const { result: gamesV1GameIdResult } = useGetGamesV1GameId(gameIdParam);

  const game: apiModels.GameV1 | undefined =
    gamesV1GameIdResult?.isRight === true
      ? gamesV1GameIdResult.value
      : undefined;

  const currentCard: apiModels.CardV1 | undefined = getGameCurrentCard(game);

  const gameSlotIndexParam: string | null =
    usersV1MeResult?.isRight === true
      ? getGameSlotIndex(game, usersV1MeResult.value)
      : null;

  const { result: gamesV1GameIdSlotsSlotIdCardsResult } =
    useGetGamesV1GameIdSlotsSlotIdCards(gameIdParam, gameSlotIndexParam);

  const isPending =
    gamesV1GameIdResult === null ||
    gamesV1GameIdSlotsSlotIdCardsResult === null;

  const gameCards: apiModels.CardArrayV1 =
    gamesV1GameIdSlotsSlotIdCardsResult?.isRight === true
      ? gamesV1GameIdSlotsSlotIdCardsResult.value
      : [];

  const useGameCardsResult: UseGameCardsResult = useGameCards(gameCards);

  return {
    currentCard,
    game,
    isPending,
    useGameCardsResult,
  };
};
