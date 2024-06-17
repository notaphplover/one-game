import {
  CircularProgress as MuiCircularProgress,
  Grid,
  Modal,
} from '@mui/material';
import React from 'react';

interface CircularProgressParams {
  open?: boolean;
}

export const CircularProgressModal = (
  params: CircularProgressParams,
): React.JSX.Element => {
  return (
    <Modal open={params.open ?? false}>
      <Grid
        container
        className="circular-progress-bck"
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid container direction="row" justifyContent="center">
          <MuiCircularProgress color="primary" />
        </Grid>
      </Grid>
    </Modal>
  );
};
