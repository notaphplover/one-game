import {
  ArrowBackIosNewOutlined,
  ArrowForwardIosOutlined,
} from '@mui/icons-material';
import { Box, Button } from '@mui/material';
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
              <ReversedCard text={(deckCardsAmount ?? '').toString()} />
              {currentCardElement}
              {countDownElement}
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
