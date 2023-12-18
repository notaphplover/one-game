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
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item sx={{ mb: 2 }}>
          <Typography
            className="logo-cornie-text"
            variant="h4"
            noWrap
            component="a"
            href="/"
          >
            CORNIE
          </Typography>
        </Grid>

        <Grid item xs={3}>
          <Box className="box-shadow login-form-grid">
            <Typography variant="h5" sx={{ mb: 1, paddingBottom: 2 }}>
              {"Welcome to Cornie's game"}
            </Typography>

            <form>
              <Grid
                container
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'Orchid',
                    },
                  },
                }}
              >
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <TextField
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
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <TextField
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
                  <Grid item xs={12} sx={{ mt: 3 }}>
                    <Alert severity="error">
                      <AlertTitle>Error</AlertTitle>
                      {backendError}
                    </Alert>
                  </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ mt: 2, mb: 2 }}>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      onClick={onSubmit}
                    >
                      <Typography textAlign="center">Login</Typography>
                    </Button>
                  </Grid>

                  <Grid
                    container
                    direction="row"
                    justifyContent="end"
                    sx={{ mt: 4 }}
                  >
                    <Typography sx={{ mt: 2, mr: 1 }}>
                      {' '}
                      {`Don't you have a Cornie's account?`}
                    </Typography>
                    <Link
                      sx={{ mt: 2, mr: 1 }}
                      component={RouterLink}
                      color="primary"
                      to="/auth/register"
                    >
                      Sign up
                    </Link>
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
