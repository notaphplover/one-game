import { Box } from '@mui/material';
import { MouseEvent } from 'react';

interface BaseCardOptions {
  children: React.JSX.Element | React.JSX.Element[];
  colorClass: string;
  isSelected?: boolean | undefined;
  onClick?: ((event: MouseEvent) => void) | undefined;
}

function addSelectedClassName(isSelected: boolean | undefined): string {
  if (isSelected ?? false) {
    return 'selected';
  } else {
    return '';
  }
}

export const BaseCard = (params: BaseCardOptions) => {
  return (
    <Box
      component="div"
      className={`cornie-card ${addSelectedClassName(params.isSelected)}`}
      onClick={params.onClick}
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
