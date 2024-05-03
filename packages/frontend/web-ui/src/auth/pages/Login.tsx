import React, { useEffect } from 'react';
import {
  NavigateFunction,
  Link as RouterLink,
  useNavigate,
} from 'react-router-dom';
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
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useLoginForm } from '../hooks/useLoginForm';
import { useShowPassword } from '../../common/hooks/useShowPassword';
import { CornieLayout } from '../../common/layout/CornieLayout';
import { CheckingAuth } from '../components/CheckingAuth';
import { useAppSelector } from '../../app/store/hooks';
import { LoginStatus } from '../models/LoginStatus';
import { UseLoginFormResult } from '../models/UseLoginFormResult';
import { selectAuthenticatedAuth } from '../../app/store/features/authSlice';
import { AuthenticatedAuthState } from '../../app/store/helpers/models/AuthState';

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

  useEffect(() => {
    if (formStatus === LoginStatus.backendOK && auth !== null) {
      window.localStorage.setItem('accessToken', auth.accessToken);
      window.localStorage.setItem('refreshToken', auth.refreshToken);
      navigate('/', { replace: true });
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

  if (
    formStatus === LoginStatus.pendingValidation ||
    formStatus === LoginStatus.pendingBackend
  ) {
    return <CheckingAuth />;
  }

  return (
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
              {"Welcome to Cornie's game"}
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
                    error={formValidation?.email !== undefined}
                    helperText={formValidation?.email}
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
                            {showPassword ? <VisibilityOff /> : <Visibility />}
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
                        {"Don't you have a Cornie's account?"}
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
  );
};
