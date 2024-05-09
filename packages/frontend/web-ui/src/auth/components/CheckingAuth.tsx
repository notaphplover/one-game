import { CircularProgress, Grid } from '@mui/material';
import React from 'react';

export const CheckingAuth = (): React.JSX.Element => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ backgroundColor: 'primary.light', minHeight: '100vh', padding: 4 }}
    >
      <Grid container direction="row" justifyContent="center">
        <CircularProgress color="secondary" />
      </Grid>
    </Grid>
  );
};
