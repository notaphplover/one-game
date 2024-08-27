import { models as apiModels } from '@cornie-js/api-models';
import {
  ArrowBackIosNewOutlined,
  ArrowForwardIosOutlined,
} from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';

import { Either } from '../../common/models/Either';

export interface BaseGameListOptions {
  pagination?: BaseGameListPaginationOptions | undefined;
  title?: string | undefined;
  gamesResult: Either<string, apiModels.GameArrayV1> | null;
  buildGameItem(game: apiModels.GameV1, key: number): React.JSX.Element;
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

function getGamesContent(
  options: BaseGameListOptions,
): React.JSX.Element | React.JSX.Element[] {
  if (options.gamesResult === null) {
    return getNoGamesContent();
  }

  if (options.gamesResult.isRight) {
    if (options.gamesResult.value.length === 0) {
      return getNoGamesContent();
    }

    return options.gamesResult.value.map(
      (game: apiModels.GameV1, index: number) =>
        options.buildGameItem(game, index),
    );
  }

  return (
    <Typography className="game-list-text">
      An error has occurred. Please try again later.
    </Typography>
  );
}

function getTitle(options: BaseGameListOptions): React.JSX.Element | undefined {
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
  options: BaseGameListOptions,
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

export const BaseGameList = (options: BaseGameListOptions) => {
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
