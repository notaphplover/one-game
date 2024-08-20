import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import {
  Link as RouterLink,
  NavigateFunction,
  useNavigate,
} from 'react-router-dom';

import { selectAuthenticatedAuth } from '../../app/store/features/authSlice';
import { AuthenticatedAuthState } from '../../app/store/helpers/models/AuthState';
import { useAppSelector } from '../../app/store/hooks';
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

  const navigate: NavigateFunction = useNavigate();

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    notifyFormFieldsFilled();
  };

  const auth: AuthenticatedAuthState | null = useAppSelector(
    selectAuthenticatedAuth,
  );

  const getRedirectTo = (): string | null => {
    return new URL(window.location.href).searchParams.get('redirectTo');
  };

  useEffect(() => {
    if (formStatus === LoginStatus.backendOK && auth !== null) {
      window.localStorage.setItem('accessToken', auth.accessToken);
      window.localStorage.setItem('refreshToken', auth.refreshToken);

      const redirectTo: string | null = getRedirectTo();
      if (redirectTo === null) {
        navigate(getSlug(PageName.home));
      } else {
        window.location.href = redirectTo;
      }
    }
  }, [formStatus, auth]);

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
        <Grid
          className="bkg-layout"
          container
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
            <Box className="box-shadow login-form-grid">
              <Typography variant="h5" className="login-form-title">
                Welcome to Cornie's game
              </Typography>

              <form>
                <Grid container>
                  <Grid item xs={12}>
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
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      className="form-text-fieldset form-login-password"
                      disabled={isTextFieldDisabled()}
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      InputProps={{
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
                      }}
                      placeholder="******"
                      fullWidth
                      name="password"
                      value={formFields.password}
                      onChange={setFormField}
                      error={formValidation.password !== undefined}
                      helperText={formValidation.password}
                    />
                  </Grid>

                  <Grid
                    container
                    display={formStatus === LoginStatus.backendKO ? '' : 'none'}
                  >
                    <Grid item xs={12}>
                      <Box className="form-login-error">
                        <Alert severity="error">
                          <AlertTitle>Error</AlertTitle>
                          {backendError}
                        </Alert>
                      </Box>
                    </Grid>
                  </Grid>

                  <Grid container>
                    <Grid item xs={12}>
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
                    </Grid>

                    <Grid container direction="column" alignItems="center">
                      <Grid item xs={6}>
                        <Typography>
                          Don't you have a Cornie's account?
                        </Typography>
                      </Grid>
                      <Grid item md={12}>
                        <Link
                          component={RouterLink}
                          color="primary"
                          to="/auth/register"
                        >
                          Sign up
                        </Link>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Grid>
        </Grid>
      </CornieLayout>
    </>
  );
};
