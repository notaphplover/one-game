import { Box } from '@mui/material';

import { BaseCard } from './BaseCard';

export interface ImageCardOptions {
  colorClass: string;
  image: string;
}

export const ImageCard = (params: ImageCardOptions) => {
  return (
    <BaseCard colorClass={params.colorClass}>
      <Box component="div" className="cornie-card-image">
        <img src={params.image} />
      </Box>
    </BaseCard>
  );
};
