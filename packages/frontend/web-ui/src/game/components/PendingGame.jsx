import { Button, Grid, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export const PendingGame = ({ game }) => {
  console.log(game);
  return (
    <Grid item xs={3}>
      <Grid component="div" className="pending-game">
        <Grid item>
          <Typography
            variant="h5"
            className="home-auth-text-game"
            component="h5"
          >
            {game.name === undefined ? '<Unknown>' : game.name}
          </Typography>
        </Grid>
        <Grid item className="pending-button-game">
          <Link component={RouterLink} to="/auth/register">
            <Button
              type="button"
              className="home-auth-button-new-game"
              variant="contained"
            >
              Share
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Grid>
  );
};
