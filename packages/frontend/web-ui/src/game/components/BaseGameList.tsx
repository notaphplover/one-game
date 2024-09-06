import {
  ArrowBackIosNewOutlined,
  ArrowForwardIosOutlined,
} from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';

import { Either } from '../../common/models/Either';

export interface BaseGameListOptions<TGameResources> {
  pagination?: BaseGameListPaginationOptions | undefined;
  title?: string | undefined;
  gameResourcesListResult: Either<string, TGameResources[]> | null;
  buildGameItem(gameResources: TGameResources, key: number): React.JSX.Element;
}

export interface BaseGameListPaginationOptions {
  onNextPageButtonClick?:
    | React.MouseEventHandler<HTMLButtonElement>
    | undefined;
  onPreviousPageButtonClick?:
    | React.MouseEventHandler<HTMLButtonElement>
    | undefined;
}

function getNoGamesContent(): React.JSX.Element {
  return <Typography className="game-list-text">No games found.</Typography>;
}

function getGamesContent<TGameResources>(
  options: BaseGameListOptions<TGameResources>,
): React.JSX.Element | React.JSX.Element[] {
  if (options.gameResourcesListResult === null) {
    return getNoGamesContent();
  }

  if (options.gameResourcesListResult.isRight) {
    if (options.gameResourcesListResult.value.length === 0) {
      return getNoGamesContent();
    }

    return options.gameResourcesListResult.value.map(
      (gameResources: TGameResources, index: number) =>
        options.buildGameItem(gameResources, index),
    );
  }

  return (
    <Typography className="game-list-text">
      An error has occurred. Please try again later.
    </Typography>
  );
}

function getTitle(
  options: BaseGameListOptions<unknown>,
): React.JSX.Element | undefined {
  if (options.title === undefined) {
    return undefined;
  }

  return (
    <Box className="game-list-title">
      <Typography className="game-list-text">{options.title}</Typography>
    </Box>
  );
}

function getPagination(
  options: BaseGameListOptions<unknown>,
): React.JSX.Element | undefined {
  if (options.pagination === undefined) {
    return undefined;
  }

  return (
    <Box component="div" className="game-list-pagination">
      <Button
        type="button"
        className="game-list-pagination-button"
        variant="contained"
        startIcon={<ArrowBackIosNewOutlined />}
        onClick={options.pagination.onPreviousPageButtonClick}
      ></Button>
      <Button
        type="button"
        className="game-list-pagination-button"
        variant="contained"
        endIcon={<ArrowForwardIosOutlined />}
        onClick={options.pagination.onNextPageButtonClick}
      ></Button>
    </Box>
  );
}

export const BaseGameList = (options: BaseGameListOptions<unknown>) => {
  return (
    <Box component="div" className="games-container">
      <Box component="div">
        {getTitle(options)}
        {getGamesContent(options)}
      </Box>
      {getPagination(options)}
    </Box>
  );
};
