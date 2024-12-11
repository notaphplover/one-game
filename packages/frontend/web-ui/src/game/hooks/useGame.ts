import { models as apiModels } from '@cornie-js/api-models';
import { SerializableAppError } from '@cornie-js/frontend-api-rtk-query';
import { SerializedError } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';

import { mapUseQueryHookResultV2 } from '../../common/helpers/mapUseQueryHookResultV2';
import {
  useCountdown,
  UseCountdownResult,
} from '../../common/hooks/useCountdown';
import { useRedirectUnauthorized } from '../../common/hooks/useRedirectUnauthorized';
import { useUrlLikeLocation } from '../../common/hooks/useUrlLikeLocation';
import { cornieApi } from '../../common/http/services/cornieApi';
import { CornieEventSource } from '../../common/http/services/CornieEventSource';
import { Either } from '../../common/models/Either';
import { UrlLikeLocation } from '../../common/models/UrlLikeLocation';
import { useGetUserMe } from '../../user/hooks/useGetUserMe';
import { buildEventSource } from '../helpers/buildEventSource';
import { getGameSlotIndex } from '../helpers/getGameSlotIndex';
import { handleGameMessageEvents } from '../helpers/handleGameMessageEvents';
import { isActiveGame } from '../helpers/isActiveGame';
import { isFinishedGame } from '../helpers/isFinishedGame';
import {
  GameSelectedCard,
  useGameCards,
  UseGameCardsResult,
} from './useGameCards';
import { useGetGameSpecV1 } from './useGetGameSpecV1';
import { useGetGamesV1GameId } from './useGetGamesV1GameId';
import { useGetGamesV1GameIdSlotsSlotIdCards } from './useGetGamesV1GameIdSlotsSlotIdCards';

const GAME_CURRENT_CARDS: number = 1;
const MAX_SECONDS_PER_TURN: number = 30;
const MS_PER_SECOND: number = 1000;

export interface UseGameResult {
  currentCard: apiModels.CardV1 | undefined;
  currentColor: apiModels.CardColorV1 | undefined;
  deckCardsAmount: number | undefined;
  closeErrorMessage: () => void;
  closeOpenDialog: () => void;
  errorMessage?: string | undefined;
  game: apiModels.GameV1 | undefined;
  isDrawingCardAllowed: boolean;
  isMyTurn: boolean;
  isPassingTurnAllowed: boolean;
  isPending: boolean;
  isPlayingCardsAllowed: boolean;
  onHandleDrawCardsGame: (event: React.FormEvent) => void;
  onHandlePassTurnGame: (event: React.FormEvent) => void;
  onHandlePlayCardsChoiceColor: (
    event: React.FormEvent,
    color: apiModels.CardColorV1,
  ) => void;
  onHandlePlayCardsGame: (event: React.FormEvent) => void;
  openDialog: boolean;
  openErrorMessage: boolean;
  useCountdownResult: UseCountdownResult;
  useGameCardsResult: UseGameCardsResult;
}

function countDeckCards(
  game: apiModels.GameV1 | undefined,
  gameSpec: apiModels.GameSpecV1 | undefined,
): number | undefined {
  if (!isActiveGame(game) || gameSpec === undefined) {
    return undefined;
  }

  const totalCards: number = gameSpec.cardSpecs.reduce(
    (count: number, cardSpec: apiModels.GameCardSpecV1): number =>
      count + cardSpec.amount,
    0,
  );

  const nonPlayerCards: number = game.state.slots.reduce(
    (count: number, gameSlot: apiModels.ActiveGameSlotV1): number =>
      count - gameSlot.cardsAmount,
    totalCards,
  );

  return nonPlayerCards - GAME_CURRENT_CARDS;
}

function getGameCurrentCard(
  game: apiModels.GameV1 | undefined,
): apiModels.CardV1 | undefined {
  return game?.state.status === 'active' ? game.state.currentCard : undefined;
}

function getGameCurrentColor(
  game: apiModels.GameV1 | undefined,
): apiModels.CardColorV1 | undefined {
  return game?.state.status === 'active' ? game.state.currentColor : undefined;
}

export const useGame = (): UseGameResult => {
  useRedirectUnauthorized();

  const url: UrlLikeLocation = useUrlLikeLocation();
  const gameIdParam: string | undefined =
    url.searchParams.get('gameId') ?? undefined;

  const { queryResult: usersV1MeQueryResult, result: usersV1MeResult } =
    useGetUserMe();

  const { queryResult: gamesV1GameIdQueryResult, result: gamesV1GameIdResult } =
    useGetGamesV1GameId(gameIdParam);

  const [triggerUpdateGame, gameUpdatedResult] =
    cornieApi.useUpdateGameV1Mutation();

  const gameUpdateResult: Either<
    SerializableAppError | SerializedError,
    apiModels.GameV1
  > | null = mapUseQueryHookResultV2(gameUpdatedResult);

  const [errorMessagePlaying, setErrorMessagePlaying] = useState<
    string | undefined
  >(undefined);

  const [openErrorMessage, setOpenErrorMessage] = useState<boolean>(false);

  const [game, setGame] = useState<apiModels.GameV1>();

  const [messageEventsQueue, setMessageEventsQueue] = useState<
    [string, apiModels.GameEventV2][]
  >([]);

  const [eventSource, setEventSource] = useState<CornieEventSource>();

  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const gameOrUndefined: apiModels.GameV1 | undefined =
    gamesV1GameIdResult?.isRight === true
      ? gamesV1GameIdResult.value
      : undefined;

  const gameSlotIndexParam: number | undefined =
    usersV1MeResult?.isRight === true
      ? getGameSlotIndex(gameOrUndefined, usersV1MeResult.value)
      : undefined;

  const isMyTurn: boolean =
    isActiveGame(game) &&
    game.state.currentPlayingSlotIndex === gameSlotIndexParam;

  const isDrawingCardAllowed: boolean =
    isActiveGame(game) && isMyTurn && !game.state.currentTurnCardsDrawn;

  const isPlayingCardsAllowed: boolean =
    isActiveGame(game) && isMyTurn && !game.state.currentTurnCardsPlayed;

  const isPassingTurnAllowed: boolean =
    isActiveGame(game) &&
    isMyTurn &&
    (game.state.currentTurnCardsDrawn || game.state.currentTurnCardsPlayed);

  const {
    refetch: refetchGamesV1GameIdSlotsSlotIdCards,
    result: gamesV1GameIdSlotsSlotIdCardsResult,
  } = useGetGamesV1GameIdSlotsSlotIdCards(
    gameIdParam,
    gameSlotIndexParam?.toString(),
  );

  const useCountdownResult = useCountdown({
    durationSeconds: MAX_SECONDS_PER_TURN,
  });

  const closeErrorMessage = (): void => {
    setOpenErrorMessage(false);
  };

  const closeOpenDialog = (): void => {
    setOpenDialog(false);
  };

  async function triggerPassGame(): Promise<void> {
    if (gameIdParam !== undefined && gameSlotIndexParam !== undefined) {
      setErrorMessagePlaying(undefined);

      await triggerUpdateGame({
        params: [
          {
            gameId: gameIdParam,
          },
          {
            kind: 'passTurn',
            slotIndex: gameSlotIndexParam,
          },
        ],
      });
    }
  }

  function isSelectedCardsWildOrWildDraw4(): boolean {
    let numberOfCardsWild: number = 0;
    let numberOfCardsWildDraw4: number = 0;
    useGameCardsResult.selectedCards.forEach(
      (gameSelectedCard: GameSelectedCard): void => {
        switch (gameSelectedCard.card.kind) {
          case 'wild':
            numberOfCardsWild = numberOfCardsWild + 1;
            break;
          case 'wildDraw4':
            numberOfCardsWildDraw4 = numberOfCardsWildDraw4 + 1;
            break;
          default:
            break;
        }
      },
    );

    return (
      numberOfCardsWild === useGameCardsResult.selectedCards.length ||
      numberOfCardsWildDraw4 === useGameCardsResult.selectedCards.length
    );
  }

  function onHandlePlayCardsGame(event: React.FormEvent): void {
    event.preventDefault();

    if (isSelectedCardsWildOrWildDraw4()) {
      setOpenDialog(true);
    } else {
      if (gameIdParam !== undefined && gameSlotIndexParam !== undefined) {
        setErrorMessagePlaying(undefined);

        void triggerUpdateGame({
          params: [
            {
              gameId: gameIdParam,
            },
            {
              cardIndexes: useGameCardsResult.selectedCards.map(
                (gameSelectedCard: GameSelectedCard): number =>
                  gameSelectedCard.index,
              ),
              kind: 'playCards',
              slotIndex: gameSlotIndexParam,
            },
          ],
        });
      }
    }
  }

  function onHandlePlayCardsChoiceColor(
    event: React.FormEvent,
    color: apiModels.CardColorV1,
  ): void {
    event.preventDefault();

    if (gameIdParam !== undefined && gameSlotIndexParam !== undefined) {
      setErrorMessagePlaying(undefined);

      void triggerUpdateGame({
        params: [
          {
            gameId: gameIdParam,
          },
          {
            cardIndexes: useGameCardsResult.selectedCards.map(
              (gameSelectedCard: GameSelectedCard): number =>
                gameSelectedCard.index,
            ),
            colorChoice: color,
            kind: 'playCards',
            slotIndex: gameSlotIndexParam,
          },
        ],
      });
    }

    closeOpenDialog();
  }

  function onHandleDrawCardsGame(event: React.FormEvent): void {
    event.preventDefault();

    if (gameIdParam !== undefined && gameSlotIndexParam !== undefined) {
      setErrorMessagePlaying(undefined);

      void triggerUpdateGame({
        params: [
          {
            gameId: gameIdParam,
          },
          {
            kind: 'drawCards',
            slotIndex: gameSlotIndexParam,
          },
        ],
      });
    }
  }

  function onHandlePassTurnGame(event: React.FormEvent): void {
    event.preventDefault();

    void triggerPassGame();
  }

  useEffect(() => {
    if (isActiveGame(game)) {
      if (isMyTurn) {
        if (game.state.currentTurnCardsPlayed) {
          void triggerPassGame();
          useGameCardsResult.deleteAllSelectedCard();
        }
      } else {
        if (useGameCardsResult.selectedCards.length > 0) {
          useGameCardsResult.deleteAllSelectedCard();
        }
      }
    }
  }, [game]);

  useEffect(() => {
    if (gameUpdateResult?.isRight === false) {
      setErrorMessagePlaying(gameUpdateResult.value.message);
      setOpenErrorMessage(true);
    }
  }, [gameUpdatedResult]);

  useEffect(() => {
    const gameResult: apiModels.GameV1 | undefined =
      gamesV1GameIdResult?.isRight === true
        ? gamesV1GameIdResult.value
        : undefined;

    if (isActiveGame(gameResult)) {
      if (game !== gameResult) {
        setGame(gameResult);
      }

      if (eventSource === undefined) {
        setEventSource(buildEventSource(gameResult, setMessageEventsQueue));
      }

      if (
        gameResult.state.currentPlayingSlotIndex === gameSlotIndexParam &&
        !useCountdownResult.isRunning
      ) {
        const seconds = Math.floor(
          (new Date(gameResult.state.turnExpiresAt).getTime() -
            new Date().getTime()) /
            MS_PER_SECOND,
        );

        if (seconds > 0) {
          useCountdownResult.start(seconds);
        }
      }
    } else {
      if (isFinishedGame(gameResult)) {
        if (game !== gameResult) {
          setGame(gameResult);
        }

        if (eventSource !== undefined) {
          eventSource.close();
          setEventSource(undefined);
        }
      }
    }
  }, [gamesV1GameIdQueryResult, usersV1MeQueryResult]);

  useEffect(() => {
    if (isActiveGame(game)) {
      if (messageEventsQueue.length > 0) {
        const updatedGame: apiModels.ActiveGameV1 | apiModels.FinishedGameV1 =
          handleGameMessageEvents(
            game,
            messageEventsQueue,
            (gameSlotIndex: number): void => {
              if (gameSlotIndex === gameSlotIndexParam) {
                void refetchGamesV1GameIdSlotsSlotIdCards();
              }
            },
            (gameSlotIndex: number): void => {
              if (gameSlotIndex === gameSlotIndexParam) {
                useCountdownResult.start();
              } else {
                useCountdownResult.stop();
              }
            },
          );

        setGame(updatedGame);
      }
    } else {
      if (isFinishedGame(game)) {
        if (eventSource !== undefined) {
          eventSource.close();
          setEventSource(undefined);
        }
      }
    }

    if (messageEventsQueue.length > 0) {
      setMessageEventsQueue(
        (
          currentMessageEventsQueue: [string, apiModels.GameEventV2][],
        ): [string, apiModels.GameEventV2][] =>
          currentMessageEventsQueue.slice(messageEventsQueue.length),
      );
    }
  }, [messageEventsQueue]);

  const { result: gamesV1GameIdSpecsResult } = useGetGameSpecV1(gameIdParam);

  const deckCardsAmount: number | undefined =
    game !== undefined && gamesV1GameIdSpecsResult?.isRight === true
      ? countDeckCards(game, gamesV1GameIdSpecsResult.value)
      : undefined;

  const gameCards: apiModels.CardArrayV1 =
    gamesV1GameIdSlotsSlotIdCardsResult?.isRight === true
      ? gamesV1GameIdSlotsSlotIdCardsResult.value
      : [];

  const useGameCardsResult: UseGameCardsResult = useGameCards(gameCards);

  return {
    closeErrorMessage,
    closeOpenDialog,
    currentCard: getGameCurrentCard(game),
    currentColor: getGameCurrentColor(game),
    deckCardsAmount,
    errorMessage: errorMessagePlaying,
    game,
    isDrawingCardAllowed,
    isMyTurn,
    isPassingTurnAllowed,
    isPending:
      gamesV1GameIdResult === null ||
      gamesV1GameIdSlotsSlotIdCardsResult === null,
    isPlayingCardsAllowed,
    onHandleDrawCardsGame,
    onHandlePassTurnGame,
    onHandlePlayCardsChoiceColor,
    onHandlePlayCardsGame,
    openDialog,
    openErrorMessage,
    useCountdownResult,
    useGameCardsResult,
  };
};
