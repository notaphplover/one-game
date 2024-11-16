import {
  ArrowBackIosNewOutlined,
  ArrowForwardIosOutlined,
} from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { MouseEvent } from 'react';

import { CircularProgressModal } from '../../common/components/CircularProgressModal';
import { Countdown } from '../../common/components/Countdown';
import { CornieLayout } from '../../common/layout/CornieLayout';
import { PageNotFound } from '../../common/pages/PageNotFound';
import { Card } from '../components/Card';
import { ReversedCard } from '../components/ReversedCard';
import { isNonStartedGame } from '../helpers/isNonStartedGame';
import { useGame } from '../hooks/useGame';
import { GameCard } from '../hooks/useGameCards';
import { NonStartedGame } from './NonStartedGame';

export const Game = (): React.JSX.Element => {
  const {
    currentCard,
    deckCardsAmount,
    game,
    isMyTurn,
    isPending,
    useCountdownResult: { currentSeconds, durationSeconds, isRunning },
    useGameCardsResult: {
      cards,
      hasNext,
      hasPrevious,
      setNext,
      setPrevious,
      switchCardSelection,
    },
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

  const buildOnHandleClick =
    (index: number) =>
    (event: MouseEvent): void => {
      event.preventDefault();
      if (isMyTurn) {
        switchCardSelection(index);
      }
    };

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
              <Box component="div" className="game-area-buttons">
                <Button
                  type="button"
                  className="game-area-draw-button"
                  fullWidth
                  variant="contained"
                >
                  DRAW
                </Button>
                <Button
                  type="button"
                  className="game-area-play-button"
                  fullWidth
                  variant="contained"
                >
                  PLAY
                </Button>
                <Button
                  type="button"
                  className="game-area-pass-button"
                  fullWidth
                  variant="contained"
                >
                  PASS
                </Button>
              </Box>
              {currentCardElement}
              <Box component="div" className="game-area-info">
                <Box component="div" className="game-area-info-timer">
                  {countDownElement}
                </Box>
                <Box component="div" className="game-area-info-deck">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#631976"
                    width="32"
                    height="32"
                  >
                    <path d="M10.348 3.169l-7.15 3.113a2 2 0 0 0 -1.03 2.608l4.92 11.895a1.96 1.96 0 0 0 2.59 1.063l7.142 -3.11a2.002 2.002 0 0 0 1.036 -2.611l-4.92 -11.894a1.96 1.96 0 0 0 -2.588 -1.064z"></path>
                    <path d="M16 3a2 2 0 0 1 1.995 1.85l.005 .15v3.5a1 1 0 0 1 -1.993 .117l-.007 -.117v-3.5h-1a1 1 0 0 1 -.117 -1.993l.117 -.007h1z"></path>
                    <path d="M19.08 5.61a1 1 0 0 1 1.31 -.53c.257 .108 .505 .21 .769 .314a2 2 0 0 1 1.114 2.479l-.056 .146l-2.298 5.374a1 1 0 0 1 -1.878 -.676l.04 -.11l2.296 -5.371l-.366 -.148l-.402 -.167a1 1 0 0 1 -.53 -1.312z"></path>
                  </svg>
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
            </Box>
          </Box>
        </Box>
      </CornieLayout>
    </>
  );
};
