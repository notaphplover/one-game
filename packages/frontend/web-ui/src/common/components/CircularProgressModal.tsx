import {
  Box,
  CircularProgress as MuiCircularProgress,
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
      <Box className="circular-progress-bck">
        <MuiCircularProgress color="primary" />
      </Box>
    </Modal>
  );
};
