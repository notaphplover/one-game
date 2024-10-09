import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Grid2,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';

import { CircularProgressModal } from '../../common/components/CircularProgressModal';
import { CornieLayout } from '../../common/layout/CornieLayout';
import { useAuthForgot } from '../hooks/useAuthForgot';
import { UseAuthForgotStatus } from '../models/UseAuthForgotStatus';

export const AuthForgot = (): React.JSX.Element => {
  const [{ form, status }, { handlers }] = useAuthForgot();

  const isTextFieldDisabled = () => {
    return status !== UseAuthForgotStatus.idle;
  };

  const isPending = (): boolean => {
    return (
      status !== UseAuthForgotStatus.idle &&
      status !== UseAuthForgotStatus.backendError &&
      status !== UseAuthForgotStatus.success
    );
  };

  return (
    <>
      <CircularProgressModal open={isPending()} />
      <CornieLayout>
        <Grid2
          className="forgot-page-container"
          container
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
            <Box className="box-shadow forgot-form-grid">
              <Typography variant="h5" className="forgot-form-title">
                Forgot Password
              </Typography>

              <form>
                <Grid2 container>
                  <Grid2 size={12}>
                    <TextField
                      className="form-text-fieldset form-forgot-email"
                      autoFocus
                      disabled={isTextFieldDisabled()}
                      label="Email"
                      type="email"
                      placeholder="mail@example.com"
                      fullWidth
                      name="email"
                      value={form.fields.email}
                      onChange={handlers.onEmailChanged}
                      error={form.validation.email !== undefined}
                      helperText={form.validation.email}
                    />
                  </Grid2>

                  <Grid2 size={12}>
                    <Box
                      className="forgot-error-container"
                      display={
                        status === UseAuthForgotStatus.backendError
                          ? ''
                          : 'none'
                      }
                    >
                      <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {form.errorMessage}
                      </Alert>
                    </Box>
                  </Grid2>

                  <Grid2 size={12}>
                    <Box
                      className="forgot-success-container"
                      display={
                        status === UseAuthForgotStatus.success ? '' : 'none'
                      }
                    >
                      <Alert severity="success">
                        <AlertTitle>Success</AlertTitle>
                        We sent an email, please, check your inbox.
                      </Alert>
                    </Box>
                  </Grid2>

                  <Grid2 size={12}>
                    <Box className="forgot-form-button">
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        onClick={handlers.onSubmit}
                        disabled={status === UseAuthForgotStatus.success}
                      >
                        <Typography textAlign="center">Send</Typography>
                      </Button>
                    </Box>
                  </Grid2>
                </Grid2>
              </form>
            </Box>
          </Grid2>
        </Grid2>
      </CornieLayout>
    </>
  );
};
