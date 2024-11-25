import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Grid2,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { Link as RouterLink } from 'react-router';

import { CircularProgressModal } from '../../common/components/CircularProgressModal';
import { getSlug } from '../../common/helpers/getSlug';
import { useShowPassword } from '../../common/hooks/useShowPassword';
import { CornieLayout } from '../../common/layout/CornieLayout';
import { PageName } from '../../common/models/PageName';
import { useResetPassword } from '../hooks/useResetPassword';
import { UseResetPasswordStatus } from '../models/UseResetPasswordStatus';

export const ResetPassword = (): React.JSX.Element => {
  const [{ form, status }, { handlers }] = useResetPassword();

  const { showPassword, handleClickShowPassword, handleMouseDownPassword } =
    useShowPassword(false);

  const isTextFieldDisabled = () => {
    return status !== UseResetPasswordStatus.pending;
  };

  const isShowPasswordButtonDisabled = () => {
    return status !== UseResetPasswordStatus.pending;
  };

  const getResetPasswordOkDisplay = (): string => {
    return status === UseResetPasswordStatus.success ? '' : 'none';
  };

  const getResetPasswordErrorDisplay = (): string => {
    return status === UseResetPasswordStatus.backendError ? '' : 'none';
  };

  const isDisplayResetButton = () => {
    return status !== UseResetPasswordStatus.success ? '' : 'none';
  };

  const isDisplayCornieButton = () => {
    return status === UseResetPasswordStatus.success ? '' : 'none';
  };

  const isPending = (): boolean => {
    return (
      status !== UseResetPasswordStatus.idle &&
      status !== UseResetPasswordStatus.backendError &&
      status !== UseResetPasswordStatus.pending &&
      status !== UseResetPasswordStatus.success
    );
  };

  return (
    <>
      <CircularProgressModal open={isPending()} />
      <CornieLayout>
        <Grid2
          className="reset-password-page-container"
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
            <Box className="box-shadow reset-password-form-grid">
              <Typography variant="h5" className="reset-password-form-title">
                Reset password
              </Typography>
              <Grid2 container>
                <Grid2 size={12}>
                  <TextField
                    className="form-text-fieldset form-reset-password"
                    disabled={isTextFieldDisabled()}
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              disabled={isShowPasswordButtonDisabled()}
                              color="primary"
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                    placeholder="******"
                    fullWidth
                    name="password"
                    value={form.fields.password}
                    onChange={handlers.onPasswordChanged}
                    error={form.validation.password !== undefined}
                    helperText={form.validation.password}
                  />
                </Grid2>
                <Grid2 size={12}>
                  <TextField
                    className="form-text-fieldset form-reset-confirm-password"
                    disabled={isTextFieldDisabled()}
                    label="Confirm Password"
                    type={showPassword ? 'text' : 'password'}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              disabled={isShowPasswordButtonDisabled()}
                              color="primary"
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                    placeholder="******"
                    fullWidth
                    name="confirmPassword"
                    value={form.fields.confirmPassword}
                    onChange={handlers.onConfirmPasswordChanged}
                    error={form.validation.confirmPassword !== undefined}
                    helperText={form.validation.confirmPassword}
                  />
                </Grid2>
                <Grid2 size={12}>
                  <Box
                    className="form-reset-password-success"
                    display={getResetPasswordOkDisplay()}
                  >
                    <Alert severity="success">
                      <AlertTitle>Success</AlertTitle>
                      Password reset successfully!
                    </Alert>
                  </Box>
                </Grid2>

                <Grid2 size={12}>
                  <Box
                    className="form-reset-password-error"
                    display={getResetPasswordErrorDisplay()}
                  >
                    <Alert severity="error">
                      <AlertTitle>Error</AlertTitle>
                      {form.errorMessage}
                    </Alert>
                  </Box>
                </Grid2>

                <Grid2 size={12}>
                  <Box
                    className="reset-password-form-button"
                    display={isDisplayResetButton()}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      onClick={handlers.onSubmit}
                      disabled={status === UseResetPasswordStatus.success}
                    >
                      <Typography textAlign="center">Reset</Typography>
                    </Button>
                  </Box>
                </Grid2>

                <Grid2 size={12}>
                  <Box
                    className="return-cornie-button"
                    display={isDisplayCornieButton()}
                  >
                    <Link
                      component={RouterLink}
                      color="primary"
                      to={getSlug(PageName.home)}
                    >
                      <Button type="button" variant="contained">
                        Return to Cornie
                      </Button>
                    </Link>
                  </Box>
                </Grid2>
              </Grid2>
            </Box>
          </Grid2>
        </Grid2>
      </CornieLayout>
    </>
  );
};
