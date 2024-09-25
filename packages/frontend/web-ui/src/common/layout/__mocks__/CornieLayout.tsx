import { jest } from '@jest/globals';

import { Box } from '@mui/material';

import type {
  CornieLayout as OriginalCornieLayout,
  CornieLayoutParams,
} from '../CornieLayout';

export const CornieLayout = jest.fn<typeof OriginalCornieLayout>(
  (params: CornieLayoutParams): React.JSX.Element => {
    return (
      <Box component="div" className="bkg-layout" id={params.id}>
        <article>{params.children}</article>
      </Box>
    );
  },
);
