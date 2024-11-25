import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Grid2,
  Link,
  Typography,
} from '@mui/material';
import React from 'react';
import { Link as RouterLink } from 'react-router';

import { CircularProgressModal } from '../../common/components/CircularProgressModal';
import { getSlug } from '../../common/helpers/getSlug';
import { CornieLayout } from '../../common/layout/CornieLayout';
import { PageName } from '../../common/models/PageName';
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
        <Grid2
          className="register-confirm-page-container"
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Grid2>
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
          </Grid2>

          <Grid2>
            <Box className="box-shadow register-form-grid">
              <Typography variant="h5" className="register-form-title">
                Confirm your account user
              </Typography>
              <Grid2 container>
                <Grid2 size={12}>
                  <Box
                    className="form-register-success"
                    display={getRegisterConfirmOkDisplay()}
                  >
                    <Alert severity="success">
                      <AlertTitle>Success</AlertTitle>
                      Your account have been created succesfully!
                    </Alert>
                  </Box>
                </Grid2>

                <Grid2 size={12}>
                  <Box
                    className="form-register-error"
                    display={getRegisterConfirmErrorDisplay()}
                  >
                    <Alert severity="error">
                      <AlertTitle>Error</AlertTitle>
                      {errorMessage}
                    </Alert>
                  </Box>
                </Grid2>

                <Grid2 size={12}>
                  <Link
                    component={RouterLink}
                    color="primary"
                    to={getSlug(PageName.home)}
                  >
                    <Button
                      type="button"
                      className="return-cornie-button"
                      variant="contained"
                    >
                      Return to Cornie
                    </Button>
                  </Link>
                </Grid2>
              </Grid2>
            </Box>
          </Grid2>
        </Grid2>
      </CornieLayout>
    </>
  );
};
