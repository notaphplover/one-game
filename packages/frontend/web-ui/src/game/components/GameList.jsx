import { Link as RouterLink } from 'react-router-dom';
import { Button, Typography, Link, Box } from '@mui/material';
import { JoinInnerOutlined, Share } from '@mui/icons-material';

/**
 * @param {string} statusGame
 * @returns {string}
 */
function getBoxNonStartedClassName(statusGame) {
  let layoutBoxClassNames = [];
  if (statusGame === 'nonStarted') {
    layoutBoxClassNames.push('hide-button-active-game');
  }

  return layoutBoxClassNames.join(' ');
}

/**
 * @param {string} statusGame
 * @returns {string}
 */
function getBoxActiveClassName(statusGame) {
  let layoutBoxClassNames = [];
  if (statusGame === 'active') {
    layoutBoxClassNames.push('hide-button-pending-game');
  }

  return layoutBoxClassNames.join(' ');
}

export const GameList = ({ typeGame, game }) => {
  return (
    <Box component="div" className="game-list">
      <Typography variant="h5" className="game-list-text" component="h5">
        {game.name === undefined ? '--' : game.name}
      </Typography>
      <Box component="div" className={getBoxActiveClassName(typeGame)}>
        <Link component={RouterLink} to="/">
          <Button
            type="button"
            className="game-list-button"
            variant="contained"
            startIcon={<Share />}
          >
            Share
          </Button>
        </Link>
      </Box>
      <Box component="div" className={getBoxNonStartedClassName(typeGame)}>
        <Link component={RouterLink} to="/">
          <Button
            type="button"
            className="game-list-button"
            variant="contained"
            startIcon={<JoinInnerOutlined />}
          >
            Join
          </Button>
        </Link>
      </Box>
    </Box>
  );
};
