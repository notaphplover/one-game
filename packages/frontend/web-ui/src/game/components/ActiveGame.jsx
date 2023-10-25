import { Button, Grid, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export const ActiveGame = () => {
  return (
    <Grid item xs={3}>
      <Grid component="div" className="pending-game">
        <Grid item>
          <Typography variant="h5" className="home-auth-text" component="h5">
            Our match
          </Typography>
        </Grid>
        <Grid item className="pending-button-game">
          <Link component={RouterLink} to="/auth/register">
            <Button
              type="button"
              className="home-auth-button-new-game"
              variant="contained"
            >
              Join
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Grid>
  );
};
