import { Button, Box, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { JoinInnerOutlined } from '@mui/icons-material';

export const ActiveGame = ({ game }) => {
  return (
    <Box component="div" className="active-game">
      <Typography variant="h5" className="active-game-text" component="h5">
        {game.name === undefined ? '--' : game.name}
      </Typography>
      <Link component={RouterLink} to="/auth/register">
        <Button
          type="button"
          className="active-game-button-join"
          variant="contained"
          startIcon={<JoinInnerOutlined />}
        >
          Join
        </Button>
      </Link>
    </Box>
  );
};
