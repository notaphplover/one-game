import { Grid2 } from '@mui/material';
import React from 'react';

export const Footer = (): React.JSX.Element => {
  return (
    <Grid2
      container
      component="footer"
      sx={{ backgroundColor: 'primary.dark', mt: 6 }}
    >
      <Grid2
        sx={{
          padding: 4,
        }}
      ></Grid2>
    </Grid2>
  );
};
