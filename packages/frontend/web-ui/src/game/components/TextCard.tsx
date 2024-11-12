import { Box } from '@mui/material';
import { MouseEvent } from 'react';

import { BaseCard } from './BaseCard';

export interface TextCardOptions {
  colorClass: string;
  isSelected?: boolean | undefined;
  text: string;
  onClick?: ((event: MouseEvent) => void) | undefined;
}

export const TextCard = (params: TextCardOptions) => {
  return (
    <BaseCard
      colorClass={params.colorClass}
      isSelected={params.isSelected}
      onClick={params.onClick}
    >
      <Box component="div" className="cornie-card-text cornie-text-card-text">
        {params.text}
      </Box>
    </BaseCard>
  );
};
