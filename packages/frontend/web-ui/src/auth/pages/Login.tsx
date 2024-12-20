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
import { useLoginForm } from '../hooks/useLoginForm';
import { LoginStatus } from '../models/LoginStatus';
import { UseLoginFormResult } from '../models/UseLoginFormResult';

export const Login = (): React.JSX.Element => {
  const {
    backendError,
    formFields,
    formStatus,
    formValidation,
    notifyFormFieldsFilled,
    setFormField,
  }: UseLoginFormResult = useLoginForm({
    email: '',
    password: '',
  });

  const { showPassword, handleClickShowPassword, handleMouseDownPassword } =
    useShowPassword(false);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    notifyFormFieldsFilled();
  };

  const isTextFieldDisabled = () => {
    return (
      formStatus === LoginStatus.backendOK ||
      formStatus === LoginStatus.pendingBackend ||
      formStatus === LoginStatus.pendingValidation
    );
  };

  const isShowPasswordButtonDisabled = () => {
    return (
      formStatus === LoginStatus.backendOK ||
      formStatus === LoginStatus.pendingBackend ||
      formStatus === LoginStatus.pendingValidation
    );
  };

  const isPending = (): boolean => {
    return (
      formStatus === LoginStatus.pendingValidation ||
      formStatus === LoginStatus.pendingBackend
    );
  };

  return (
    <>
      <CircularProgressModal open={isPending()} />
      <CornieLayout>
        <Grid2
          className="login-page-container"
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
            <Box className="box-shadow login-form-grid">
              <Typography variant="h5" className="login-form-title">
                Welcome
              </Typography>

              <form>
                <Grid2 container>
                  <Grid2 size={12}>
                    <TextField
                      className="form-text-fieldset form-login-email"
                      autoFocus
                      disabled={isTextFieldDisabled()}
                      label="Email"
                      type="email"
                      placeholder="mail@example.com"
                      fullWidth
                      name="email"
                      value={formFields.email}
                      onChange={setFormField}
                      error={formValidation.email !== undefined}
                      helperText={formValidation.email}
                    />
                  </Grid2>
                  <Grid2 size={12}>
                    <TextField
                      className="form-text-fieldset form-login-password"
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
                      value={formFields.password}
                      onChange={setFormField}
                      error={formValidation.password !== undefined}
                      helperText={formValidation.password}
                    />
                  </Grid2>

                  <Grid2
                    size={12}
                    display={formStatus === LoginStatus.backendKO ? '' : 'none'}
                  >
                    <Box className="form-login-error">
                      <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {backendError}
                      </Alert>
                    </Box>
                  </Grid2>

                  <Grid2 size={12}>
                    <Box className="login-form-button">
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        onClick={onSubmit}
                      >
                        <Typography textAlign="center">Login</Typography>
                      </Button>
                    </Box>
                  </Grid2>

                  <Grid2 size={6} className="login-form-links">
                    <Typography className="left-link">
                      <Link
                        component={RouterLink}
                        color="primary"
                        to={getSlug(PageName.register)}
                      >
                        Sign up
                      </Link>
                    </Typography>{' '}
                  </Grid2>
                  <Grid2 size={6} className="login-form-links">
                    <Typography className="right-link">
                      <Link
                        component={RouterLink}
                        color="primary"
                        to={getSlug(PageName.forgot)}
                      >
                        Forgot password?
                      </Link>
                    </Typography>{' '}
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
