import React from 'react';
import { CircularProgress, Grid } from '@mui/material';

export const CheckingAuth = (): React.JSX.Element => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: '100vh', backgroundColor: 'primary.light', padding: 4 }}
    >
      <Grid container direction="row" justifyContent="center">
        <CircularProgress color="secondary" />
      </Grid>
    </Grid>
  );
};
