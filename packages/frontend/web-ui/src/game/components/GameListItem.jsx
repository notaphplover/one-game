import { Link as RouterLink } from 'react-router-dom';
import { Button, Typography, Link, Box } from '@mui/material';
import { JoinInnerOutlined, Share } from '@mui/icons-material';

export const GameListItem = ({ game }) => {
  return (
    <Box component="div" className="game-list-item">
      <Typography variant="h5" className="game-list-item-text" component="h5">
        {game.name === undefined ? '--' : game.name}
      </Typography>
      {game.state.status === 'nonStarted' ? (
        <Box component="div">
          <Link component={RouterLink} to="/">
            <Button
              type="button"
              className="game-list-item-button"
              variant="contained"
              startIcon={<Share />}
            >
              Share
            </Button>
          </Link>
        </Box>
      ) : (
        <Box component="div">
          <Link component={RouterLink} to="/">
            <Button
              type="button"
              className="game-list-item-button"
              variant="contained"
              startIcon={<JoinInnerOutlined />}
            >
              Join
            </Button>
          </Link>
        </Box>
      )}
    </Box>
  );
};
