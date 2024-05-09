import { CircularProgress, Grid } from '@mui/material';
import React from 'react';

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
