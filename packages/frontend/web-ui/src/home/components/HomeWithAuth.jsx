import { Avatar, Box, Button, Grid, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { CornieLayout } from '../../common/layout/CornieLayout';
import { LogoCard } from '../../common/components/LogoCard';
import { ReversedCard } from '../../game/components/ReversedCard';
import { PendingGame } from '../../game/components/PendingGame';
import { ActiveGame } from '../../game/components/ActiveGame';

export const HomeWithAuth = () => {
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
          <Grid
            container
            xs={12}
            component="div"
            className="home-auth-container-games"
          >
            <PendingGame />
          </Grid>
        </Grid>
        <Grid item xs={12} className="home-auth-container">
          <Typography variant="h3" className="home-auth-text" component="h3">
            Active Games
          </Typography>
          <Grid container component="div" className="home-auth-container-games">
            <ActiveGame />
          </Grid>
        </Grid>
      </Grid>
    </CornieLayout>
  );
};
