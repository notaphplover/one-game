import { Box, Button, Grid, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { CornieLayout } from '../../common/layout/CornieLayout';
import { PendingGame } from '../../game/components/PendingGame';
import { STATUS_GAME_FULFILLED, useGameStatus } from '../hooks/useGameStatus';
import { ActiveGame } from '../../game/components/ActiveGame';
import GamesIcon from '@mui/icons-material/Games';

const GAME_STATUS_NON_STARTED = 'nonStarted';
const GAME_STATUS_ACTIVE = 'active';

export const HomeWithAuth = () => {
  const { status, gameList } = useGameStatus();
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
    <CornieLayout id="home-page-with-auth" withFooter withNavBar>
      <Box
        component="div"
        className="page-section-container home-auth-container"
      >
        <Grid container>
          <Grid item xs={12}>
            <Box component="div" className="home-auth-button-container">
              <Link component={RouterLink} to="/">
                <Button
                  type="button"
                  className="home-auth-button-new-game"
                  variant="contained"
                  startIcon={<GamesIcon />}
                >
                  New Game
                </Button>
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h3" className="home-auth-text" component="h3">
              Pending Games
            </Typography>
            <Box component="div" className="home-auth-container-games">
              {status === STATUS_GAME_FULFILLED && pendingGames.length > 0 ? (
                pendingGames.map((game) => (
                  <PendingGame key={game.id} game={game} />
                ))
              ) : (
                <Typography
                  variant="h5"
                  className="home-auth-text-white"
                  component="h5"
                >
                  No pending games found.
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h3" className="home-auth-text" component="h3">
              Active Games
            </Typography>
            <Box component="div" className="home-auth-container-games">
              {status === STATUS_GAME_FULFILLED && activeGames.length > 0 ? (
                activeGames.map((game) => (
                  <ActiveGame key={game.id} game={game} />
                ))
              ) : (
                <Typography
                  variant="h5"
                  className="home-auth-text-white"
                  component="h5"
                >
                  No active games found.
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </CornieLayout>
  );
};
