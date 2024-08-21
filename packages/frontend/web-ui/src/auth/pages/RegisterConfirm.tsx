import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { CircularProgressModal } from '../../common/components/CircularProgressModal';
import { CornieLayout } from '../../common/layout/CornieLayout';
import { useRegisterConfirm } from '../hooks/useRegisterConfirm';
import { RegisterConfirmStatus } from '../models/RegisterConfirmStatus';

export const RegisterConfirm = (): React.JSX.Element => {
  const { status, errorMessage } = useRegisterConfirm();

  const getRegisterConfirmOkDisplay = (): string => {
    return status === RegisterConfirmStatus.fulfilled ? '' : 'none';
  };

  const getRegisterConfirmErrorDisplay = (): string => {
    return status === RegisterConfirmStatus.rejected ? '' : 'none';
  };

  const isPending = (): boolean => {
    return status === RegisterConfirmStatus.pending;
  };

  return (
    <>
      <CircularProgressModal open={isPending()} />
      <CornieLayout>
        <Grid
          className="register-confirm-page-container"
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Grid item>
            <Box className="logo-cornie-position">
              <Typography
                className="logo-cornie-text"
                variant="h4"
                noWrap
                component="a"
                href="/"
              >
                CORNIE
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={3}>
            <Box className="box-shadow register-form-grid">
              <Typography variant="h5" className="register-form-title">
                Confirm your account user
              </Typography>
              <Grid container>
                <Grid
                  className="confirm-register-ok"
                  container
                  display={getRegisterConfirmOkDisplay()}
                >
                  <Grid item xs={12}>
                    <Box className="form-register-success">
                      <Alert severity="success">
                        <AlertTitle>Success</AlertTitle>
                        Your account have been created succesfully!
                      </Alert>
                    </Box>
                  </Grid>
                </Grid>

                <Grid
                  className="confirm-register-error-message"
                  container
                  display={getRegisterConfirmErrorDisplay()}
                >
                  <Grid item xs={12}>
                    <Box className="form-register-error">
                      <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {errorMessage}
                      </Alert>
                    </Box>
                  </Grid>
                </Grid>

                <Grid
                  className="confirm-register-button"
                  container
                  direction="row"
                  justifyContent="end"
                >
                  <Grid item>
                    <Link component={RouterLink} color="primary" to="/">
                      <Button
                        type="button"
                        className="return-cornie-button"
                        variant="contained"
                      >
                        Return to Cornie
                      </Button>
                    </Link>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </CornieLayout>
    </>
  );
};
