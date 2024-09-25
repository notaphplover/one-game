import { models as apiModels } from '@cornie-js/api-models';
import { JoinInnerOutlined } from '@mui/icons-material';
import { Box, Button } from '@mui/material';

import { getSlug } from '../../common/helpers/getSlug';
import { PageName } from '../../common/models/PageName';
import { BaseGameListItem } from './BaseGameListItem';

export interface ActiveGameListItemOptions {
  game: apiModels.GameV1;
}

export const ActiveGameListItem = (options: ActiveGameListItemOptions) => {
  const button = (
    <Box component="div">
      <Button
        className="game-list-item-button"
        component="a"
        href={`${getSlug(PageName.game)}?gameId=${options.game.id}`}
        startIcon={<JoinInnerOutlined />}
        type="button"
        variant="contained"
      >
        Join
      </Button>
    </Box>
  );

  return <BaseGameListItem button={button} gameText={options.game.name} />;
};
