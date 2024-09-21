import { Box } from '@mui/material';

import { BaseCard } from './BaseCard';

export interface TextCardOptions {
  colorClass: string;
  text: string;
}

export const TextCard = (params: TextCardOptions) => {
  return (
    <BaseCard colorClass={params.colorClass}>
      <Box component="div" className="cornie-card-text cornie-text-card-text">
        {params.text}
      </Box>
    </BaseCard>
  );
};
