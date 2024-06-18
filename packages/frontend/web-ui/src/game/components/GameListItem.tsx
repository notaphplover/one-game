import { models as apiModels } from '@cornie-js/api-models';
import { JoinInnerOutlined, Share } from '@mui/icons-material';
import { Button, Typography, Link, Box } from '@mui/material';
import { MouseEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';

function buildShareGameButtonOnClick(
  game: apiModels.GameV1,
): (event: MouseEvent) => void {
  return (_event: MouseEvent) => {
    const currentUrl: URL = new URL(window.location.href);
    const joinGameUrl = new URL(`/games/join?gameId=${game.id}`, currentUrl);

    void navigator.clipboard.writeText(joinGameUrl.toString());
  };
}

function getGameButton(game: apiModels.GameV1): React.JSX.Element {
  let chosenButton: React.JSX.Element;

  switch (game.state.status) {
    case 'nonStarted':
      chosenButton = (
        <Box component="div">
          <Link component={RouterLink} to="/">
            <Button
              className="game-list-item-button"
              onClick={buildShareGameButtonOnClick(game)}
              startIcon={<Share />}
              type="button"
              variant="contained"
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
      {getGameButton(game)}
    </Box>
  );
};
