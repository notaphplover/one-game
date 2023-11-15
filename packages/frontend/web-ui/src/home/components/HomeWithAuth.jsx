import { Button, Grid, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { CornieLayout } from '../../common/layout/CornieLayout';
import { PendingGame } from '../../game/components/PendingGame';
import { STATUS_GAME_FULFILLED, useGameStatus } from '../hooks/useGameStatus';
import { ActiveGame } from '../../game/components/ActiveGame';

const GAME_STATUS_NON_STARTED = 'nonStarted';
const GAME_STATUS_ACTIVE = 'active';

export const HomeWithAuth = () => {
  const { errorMessage, status, gameList } = useGameStatus();
  let pendingGames, activeGames;

  if (status === STATUS_GAME_FULFILLED) {
    pendingGames = gameList.filter(
      (game) => game.state.status === GAME_STATUS_NON_STARTED,
    );
    activeGames = gameList.filter(
      (game) => game.state.status === GAME_STATUS_ACTIVE,
    );
  }

  return (
    <CornieLayout withFooter withNavBar>
      <Grid container className="page-section-container">
        <Grid item xs={12} className="home-auth-button-container">
          <Link component={RouterLink} to="/auth/register">
            <Button
              type="button"
              className="home-auth-button-new-game"
              variant="contained"
            >
              New Game
            </Button>
          </Link>
        </Grid>
        <Grid item xs={12} className="home-auth-container">
          <Typography variant="h3" className="home-auth-text" component="h3">
            Pending Games
          </Typography>
          <Grid container component="div" className="home-auth-container-games">
            {status === STATUS_GAME_FULFILLED && pendingGames.length > 0
              ? pendingGames.map((game) => (
                  <PendingGame key={game.id} game={game} />
                ))
              : 'Not exists pending games.'}
          </Grid>
        </Grid>
        <Grid item xs={12} className="home-auth-container">
          <Typography variant="h3" className="home-auth-text" component="h3">
            Active Games
          </Typography>
          <Grid container component="div" className="home-auth-container-games">
            {status === STATUS_GAME_FULFILLED && activeGames.length > 0
              ? activeGames.map((game) => (
                  <ActiveGame key={game.id} game={game} />
                ))
              : 'Not exists active games.'}
          </Grid>
        </Grid>
      </Grid>
    </CornieLayout>
  );
};
