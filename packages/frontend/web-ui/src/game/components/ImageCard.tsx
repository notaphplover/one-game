import { Box } from '@mui/material';
import { MouseEvent } from 'react';

import { BaseCard } from './BaseCard';

export interface ImageCardOptions {
  colorClass: string;
  image: string;
  isSelected?: boolean | undefined;
  onDoubleClick?: ((event: MouseEvent) => void) | undefined;
}

export const ImageCard = (params: ImageCardOptions) => {
  return (
    <BaseCard
      colorClass={params.colorClass}
      isSelected={params.isSelected}
      onDoubleClick={params.onDoubleClick}
    >
      <Box component="div" className="cornie-card-image">
        <img src={params.image} />
      </Box>
    </BaseCard>
  );
};
