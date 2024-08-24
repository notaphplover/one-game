import { Box } from '@mui/material';

interface CornieLayoutParams {
  children: React.JSX.Element | React.JSX.Element[];
  id?: string;
  withFooter?: boolean;
  withNavBar?: boolean;
}

export const CornieLayout = (params: CornieLayoutParams): React.JSX.Element => {
  return (
    <Box component="div" className="bkg-layout" id={params.id}>
      <article>{params.children}</article>
    </Box>
  );
};
