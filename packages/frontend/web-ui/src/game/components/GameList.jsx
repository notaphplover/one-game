import { Typography, Box } from '@mui/material';
import { GameListItem } from './GameListItem';
import { STATUS_GAME_FULFILLED } from '../../home/hooks/useGetGames';

export const GameList = ({ status, gameList }) => {
  return (
    <Box component="div">
      {status === STATUS_GAME_FULFILLED && gameList.length > 0 ? (
        gameList.map((game) => <GameListItem key={game.id} game={game} />)
      ) : (
        <Typography
          variant="h5"
          className="home-auth-text-white"
          component="h5"
        >
          No games found.
        </Typography>
      )}
    </Box>
  );
};
