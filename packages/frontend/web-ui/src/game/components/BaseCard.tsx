import { Box } from '@mui/material';
import { MouseEvent } from 'react';

interface BaseCardOptions {
  children: React.JSX.Element | React.JSX.Element[];
  colorClass: string;
  onDoubleClick?: ((event: MouseEvent) => void) | undefined;
}

export const BaseCard = (params: BaseCardOptions) => {
  return (
    <Box
      component="div"
      className="cornie-card"
      onDoubleClick={params.onDoubleClick}
    >
      <Box
        component="div"
        className={`cornie-card-inner-content ${params.colorClass}`}
      >
        {params.children}
      </Box>
    </Box>
  );
};
