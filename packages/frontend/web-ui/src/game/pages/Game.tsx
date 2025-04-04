import { models as apiModels } from '@cornie-js/api-models';
import {
  ArrowBackIosNewOutlined,
  ArrowForwardIosOutlined,
} from '@mui/icons-material';
import { Alert, Box, Button, Snackbar, Typography } from '@mui/material';
import { FormEvent, MouseEvent } from 'react';

import cardDeckImageUrl from '../../app/images/cards/deckCard.svg';
import { CircularProgressModal } from '../../common/components/CircularProgressModal';
import { Countdown } from '../../common/components/Countdown';
import { CornieLayout } from '../../common/layout/CornieLayout';
import { PageNotFound } from '../../common/pages/PageNotFound';
import { Card } from '../components/Card';
import { ColorChoiceDialog } from '../components/ColorChoiceDialog';
import { ReversedCard } from '../components/ReversedCard';
import { isNonStartedGame } from '../helpers/isNonStartedGame';
import { useGame } from '../hooks/useGame';
import { GameCard } from '../hooks/useGameCards';
import { NonStartedGame } from './NonStartedGame';

export const Game = (): React.JSX.Element => {
  const {
    closeErrorMessage,
    closeOpenDialog,
    currentCard,
    currentColor,
    deckCardsAmount,
    errorMessage,
    game,
    isDrawingCardAllowed,
    isMyTurn,
    isPassingTurnAllowed,
    isPending,
    isPlayingCardsAllowed,
    onHandleDrawCardsGame,
    onHandlePassTurnGame,
    onHandlePlayCardsChoiceColor,
    onHandlePlayCardsGame,
    openDialog,
    openErrorMessage,
    useCountdownResult: { currentSeconds, durationSeconds, isRunning },
    useGameCardsResult: {
      cards,
      hasNext,
      hasPrevious,
      setNext,
      setPrevious,
      switchCardSelection,
    },
    useGetFinishedGameWinnerResult: { finishedGameWinner },
  } = useGame();

  if (!isPending && game === undefined) {
    return <PageNotFound />;
  }

  if (isNonStartedGame(game)) {
    return <NonStartedGame />;
  }

  const currentCardElement: React.JSX.Element =
    currentCard === undefined ? (
      <ReversedCard text="" />
    ) : (
      <Card card={currentCard} />
    );

  const countDownElement: React.JSX.Element = isRunning ? (
    <Countdown
      currentSeconds={currentSeconds}
      durationSeconds={durationSeconds}
    />
  ) : (
    <Countdown />
  );

  const buildOnHandlePlayCard = (event: FormEvent): void => {
    event.preventDefault();
    if (isMyTurn) {
      onHandlePlayCardsGame(event);
    }
  };

  const buildOnHandleDrawCard = (event: FormEvent): void => {
    event.preventDefault();
    if (isMyTurn) {
      onHandleDrawCardsGame(event);
    }
  };

  const buildOnHandlePassTurn = (event: FormEvent): void => {
    event.preventDefault();
    if (isMyTurn) {
      onHandlePassTurnGame(event);
    }
  };

  const buildOnHandleClick =
    (index: number) =>
    (event: MouseEvent): void => {
      event.preventDefault();
      if (isMyTurn) {
        switchCardSelection(index);
      }
    };

  function addCurrentColorClassName(
    currentColor: apiModels.CardColorV1 | undefined,
  ): string {
    let currentColorClassName: string = 'current-card-background ';
    switch (currentColor) {
      case 'blue':
        currentColorClassName += 'current-color-blue';
        break;
      case 'green':
        currentColorClassName += 'current-color-green';
        break;
      case 'red':
        currentColorClassName += 'current-color-red';
        break;
      case 'yellow':
        currentColorClassName += 'current-color-yellow';
        break;
      default:
        break;
    }
    return currentColorClassName;
  }

  return (
    <>
      <CircularProgressModal open={isPending} />
      <CornieLayout withNavBar>
        <Box
          component="div"
          className="page-section-container game-page-container"
        >
          <Box component="div" className="game-container">
            <Box component="div" className="game-area" data-testid="game-area">
              <Box
                component="div"
                className="game-area-snackbar"
                display={errorMessage !== undefined ? '' : 'none'}
              >
                <Snackbar
                  anchorOrigin={{
                    horizontal: 'center',
                    vertical: 'top',
                  }}
                  className="snackbar-error"
                  open={openErrorMessage}
                  autoHideDuration={3000}
                  onClose={closeErrorMessage}
                >
                  <Alert
                    onClose={closeErrorMessage}
                    severity="error"
                    variant="filled"
                  >
                    {errorMessage}
                  </Alert>
                </Snackbar>
              </Box>
              <Box component="div" className="game-area-buttons">
                <Button
                  type="button"
                  className="game-area-draw-button"
                  fullWidth
                  variant="contained"
                  disabled={!isDrawingCardAllowed}
                  onClick={buildOnHandleDrawCard}
                >
                  DRAW
                </Button>
                <Button
                  type="button"
                  className="game-area-play-button"
                  fullWidth
                  disabled={!isPlayingCardsAllowed}
                  variant="contained"
                  onClick={buildOnHandlePlayCard}
                >
                  PLAY
                </Button>
                <Button
                  type="button"
                  className="game-area-pass-button"
                  fullWidth
                  disabled={!isPassingTurnAllowed}
                  variant="contained"
                  onClick={buildOnHandlePassTurn}
                >
                  PASS
                </Button>
                <ColorChoiceDialog
                  open={openDialog}
                  onClose={closeOpenDialog}
                  onHandlePlayCardsChoiceColor={onHandlePlayCardsChoiceColor}
                />
              </Box>
              <Box
                component="div"
                className={addCurrentColorClassName(currentColor)}
              >
                {currentCardElement}
              </Box>
              <Box component="div" className="game-area-info">
                <Box component="div" className="game-area-info-timer">
                  {countDownElement}
                </Box>
                <Box component="div" className="game-area-info-deck">
                  <img
                    className="game-area-info-deck-image"
                    src={cardDeckImageUrl}
                  />
                  <Typography className="game-area-info-deck-count">
                    {deckCardsAmount}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box component="div" className="player-area">
              <Box component="div" className="player-hand-pagination-container">
                <Box component="div" className="player-hand-pagination">
                  <Button
                    type="button"
                    className="player-hand-pagination-button"
                    disabled={!hasPrevious}
                    variant="contained"
                    startIcon={<ArrowBackIosNewOutlined />}
                    onClick={() => {
                      setPrevious();
                    }}
                  ></Button>
                  <Button
                    type="button"
                    className="player-hand-pagination-button"
                    disabled={!hasNext}
                    variant="contained"
                    endIcon={<ArrowForwardIosOutlined />}
                    onClick={() => {
                      setNext();
                    }}
                  ></Button>
                </Box>
              </Box>
              <Box component="div" className="player-hand">
                {cards.map((gameCard: GameCard) => (
                  <Card
                    card={gameCard.card}
                    key={`card-${gameCard.index.toString()}`}
                    isSelected={gameCard.isSelected}
                    onClick={buildOnHandleClick(gameCard.index)}
                  />
                ))}
              </Box>
              <Box
                component="div"
                className="message-finish-game-container"
                display={finishedGameWinner !== undefined ? '' : 'none'}
              >
                <Box component="div" className="message-finish-game-pagination">
                  <Alert className="message-finish-game" severity="success">
                    {`Finished game, the winner is ${finishedGameWinner?.name ?? ''}`}
                  </Alert>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </CornieLayout>
    </>
  );
};
