import React from 'react';
import { CircularProgress, Grid } from '@mui/material';

export const CheckingGame = (): React.JSX.Element => {
  return (
    <Grid
      container
      className="checking-game-bck"
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Grid container direction="row" justifyContent="center">
        <CircularProgress color="primary" />
      </Grid>
    </Grid>
  );
};
