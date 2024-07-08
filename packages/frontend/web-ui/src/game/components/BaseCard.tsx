import { Box } from '@mui/material';

interface BaseCardOptions {
  children: React.JSX.Element | React.JSX.Element[];
  colorClass: string;
}

export const BaseCard = (params: BaseCardOptions) => {
  return (
    <Box component="div" className="cornie-base-card">
      <Box component="div" className="cornie-base-card-inner-border">
        <Box
          component="div"
          className={`cornie-base-card-inner-content ${params.colorClass}`}
        >
          {params.children}
        </Box>
      </Box>
    </Box>
  );
};
