import { Link as RouterLink } from 'react-router-dom';
import { Button, Grid, Typography, Link, Box } from '@mui/material';
import { Share } from '@mui/icons-material';

export const PendingGame = ({ game }) => {
  return (
    <Box component="div" className="pending-game">
      <Typography variant="h5" className="pending-game-text" component="h5">
        {game.name === undefined ? '--' : game.name}
      </Typography>
      <Link component={RouterLink} to="/auth/register">
        <Button
          type="button"
          className="pending-button-game-share"
          variant="contained"
          startIcon={<Share />}
        >
          Share
        </Button>
      </Link>
    </Box>
  );
};
