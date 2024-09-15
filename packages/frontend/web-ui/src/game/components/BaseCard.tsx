import { Box } from '@mui/material';

interface BaseCardOptions {
  children: React.JSX.Element | React.JSX.Element[];
  colorClass: string;
}

export const BaseCard = (params: BaseCardOptions) => {
  return (
    <Box component="div" className="cornie-card">
      <Box
        component="div"
        className={`cornie-card-inner-content ${params.colorClass}`}
      >
        {params.children}
      </Box>
    </Box>
  );
};
