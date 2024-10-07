import { models as apiModels } from '@cornie-js/api-models';
import {
  ArrowBackIosNewOutlined,
  ArrowForwardIosOutlined,
} from '@mui/icons-material';
import { Box, Button } from '@mui/material';

import { CircularProgressModal } from '../../common/components/CircularProgressModal';
import { CornieLayout } from '../../common/layout/CornieLayout';
import { PageNotFound } from '../../common/pages/PageNotFound';
import { Card } from '../components/Card';
import { ReversedCard } from '../components/ReversedCard';
import { isNonStartedGame } from '../helpers/isNonStartedGame';
import { useGame } from '../hooks/useGame';
import { NonStartedGame } from './NonStartedGame';

export const Game = (): React.JSX.Element => {
  const {
    currentCard,
    game,
    isPending,
    useGameCardsResult: { cards, hasNext, hasPrevious, setNext, setPrevious },
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
              <ReversedCard text="" />
              {currentCardElement}
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
                {cards.map((card: apiModels.CardV1, index: number) => (
                  <Card card={card} key={`card-${index.toString()}`} />
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </CornieLayout>
    </>
  );
};
