import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
import {
  STATUS_LOG_BACKEND_KO,
  STATUS_LOG_BACKEND_OK,
  STATUS_LOG_PENDING_BACKEND,
  STATUS_LOG_PENDING_VAL,
  useLoginForm,
} from '../hooks/useLoginForm';
import { useShowPassword } from '../../common/hooks/useShowPassword';
import { CornieLayout } from '../../common/layout/CornieLayout';
import { CheckingAuth } from '../components/CheckingAuth';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

export const Login = () => {
  const {
    backendError,
    formFields,
    formStatus,
    formValidation,
    notifyFormFieldsFilled,
    setFormField,
  } = useLoginForm({
    email: '',
    password: '',
  });

  const { showPassword, handleClickShowPassword, handleMouseDownPassword } =
    useShowPassword(false);

  const navigate = useNavigate();

  const onSubmit = (event) => {
    event.preventDefault();

    notifyFormFieldsFilled();
  };

  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (formStatus === STATUS_LOG_BACKEND_OK) {
      window.localStorage.setItem('token', token);
      navigate('/', { replace: true });
    }
  }, [formStatus, token]);

  const isTextFieldDisabled = () => {
    return (
      formStatus === STATUS_LOG_BACKEND_OK ||
      formStatus === STATUS_LOG_PENDING_BACKEND ||
      formStatus === STATUS_LOG_PENDING_VAL
    );
  };

  const isShowPasswordButtonDisabled = () => {
    return (
      formStatus === STATUS_LOG_BACKEND_OK ||
      formStatus === STATUS_LOG_PENDING_BACKEND ||
      formStatus === STATUS_LOG_PENDING_VAL
    );
  };

  if (
    formStatus === STATUS_LOG_PENDING_VAL ||
    formStatus === STATUS_LOG_PENDING_BACKEND
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
            <Typography variant="h5" className="login-title-text-position">
              {"Welcome to Cornie's game"}
            </Typography>

            <form>
              <Grid container>
                <Grid item xs={12}>
                  <TextField
                    className="form-fieldset-border-color"
                    autoFocus
                    aria-label="form-login-email"
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
                    className="form-fieldset-border-color"
                    aria-label="form-login-password"
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
                  aria-label="form-login-error"
                  container
                  display={formStatus === STATUS_LOG_BACKEND_KO ? '' : 'none'}
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
                        className="button-"
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
