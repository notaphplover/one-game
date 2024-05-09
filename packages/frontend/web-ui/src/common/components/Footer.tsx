import { Grid } from '@mui/material';
import React from 'react';

export const Footer = (): React.JSX.Element => {
  return (
    <Grid
      container
      component="footer"
      sx={{ backgroundColor: 'primary.dark', mt: 6 }}
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
