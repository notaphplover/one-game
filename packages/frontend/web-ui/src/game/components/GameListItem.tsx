import { Link as RouterLink } from 'react-router-dom';
import { models as apiModels } from '@cornie-js/api-models';
import { Button, Typography, Link, Box } from '@mui/material';
import { JoinInnerOutlined, Share } from '@mui/icons-material';
import { GameState } from '../../home/models/UseGetGamesResult';

function getChosenButtonGame(typeGame: GameState): React.JSX.Element {
  let chosenButton: React.JSX.Element;

  switch (typeGame) {
    case 'nonStarted':
      chosenButton = (
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
      );
      break;
    case 'active':
      chosenButton = (
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
      );
      break;
    default:
      chosenButton = <Box component="div"></Box>;
      break;
  }
  return chosenButton;
}

export const GameListItem = ({ game }: { game: apiModels.GameV1 }) => {
  return (
    <Box component="div" className="game-list-item">
      <Typography variant="h5" className="game-list-item-text" component="h5">
        {game.name === undefined ? '--' : game.name}
      </Typography>
      {getChosenButtonGame(game.state.status)}
    </Box>
  );
};
