import { Grid } from '@mui/material';
import React from 'react';

export const Footer = (): React.JSX.Element => {
  return (
    <Grid
      container
      component="footer"
      sx={{ mt: 6, backgroundColor: 'primary.dark' }}
    >
      <Grid
        item
        sx={{
          padding: 4,
        }}
      ></Grid>
    </Grid>
  );
};
