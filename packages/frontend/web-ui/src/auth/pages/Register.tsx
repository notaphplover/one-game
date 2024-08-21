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
import { Link as RouterLink } from 'react-router-dom';

import { CircularProgressModal } from '../../common/components/CircularProgressModal';
import { useShowPassword } from '../../common/hooks/useShowPassword';
import { CornieLayout } from '../../common/layout/CornieLayout';
import { useRegister } from '../hooks/useRegister';
import { UseRegisterStatus } from '../models/UseRegisterStatus';

export const Register = () => {
  const [{ form, status }, { handlers }] = useRegister();
  const { showPassword, handleClickShowPassword, handleMouseDownPassword } =
    useShowPassword(false);

  const isTextFieldDisabled = () => {
    return status !== UseRegisterStatus.idle;
  };

  const isShowPasswordButtonDisabled = () => {
    return status !== UseRegisterStatus.idle;
  };

  const isPending = (): boolean => {
    return (
      status !== UseRegisterStatus.idle &&
      status !== UseRegisterStatus.backendError &&
      status !== UseRegisterStatus.success
    );
  };

  return (
    <>
      <CircularProgressModal open={isPending()} />
      <CornieLayout>
        <Grid
          className="register-page-container"
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
                Create an account
              </Typography>

              <form>
                <Grid container>
                  <Grid item xs={12}>
                    <TextField
                      className="form-text-fieldset form-register-name"
                      autoFocus
                      disabled={isTextFieldDisabled()}
                      label="Name"
                      type="text"
                      placeholder="name"
                      fullWidth
                      name="name"
                      value={form.fields.name}
                      onChange={handlers.onNameChanged}
                      error={form.validation.name !== undefined}
                      helperText={form.validation.name}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      className="form-text-fieldset form-register-email"
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
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      className="form-text-fieldset form-register-password"
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
                      value={form.fields.password}
                      onChange={handlers.onPasswordChanged}
                      error={form.validation.password !== undefined}
                      helperText={form.validation.password}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      className="form-text-fieldset form-register-confirm-password"
                      disabled={isTextFieldDisabled()}
                      label="Confirm Password"
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
                      name="confirmPassword"
                      value={form.fields.confirmPassword}
                      onChange={handlers.onConfirmPasswordChanged}
                      error={form.validation.confirmPassword !== undefined}
                      helperText={form.validation.confirmPassword}
                    />
                  </Grid>
                </Grid>

                <Grid
                  container
                  display={
                    status === UseRegisterStatus.backendError ? '' : 'none'
                  }
                >
                  <Grid item xs={12}>
                    <Box className="form-register-error">
                      <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        Unexpected error occured. Please try again later.
                      </Alert>
                    </Box>
                  </Grid>
                </Grid>

                <Grid
                  container
                  display={status === UseRegisterStatus.success ? '' : 'none'}
                >
                  <Grid item xs={12}>
                    <Box className="form-register-success">
                      <Alert severity="success">
                        <AlertTitle>Success</AlertTitle>
                        User created! We sent an email, please, check your
                        inbox.
                      </Alert>
                    </Box>
                  </Grid>
                </Grid>

                <Grid container>
                  <Grid item xs={12}>
                    <Box className="register-form-button">
                      <Button
                        className="register-button"
                        disabled={status === UseRegisterStatus.success}
                        type="submit"
                        variant="contained"
                        fullWidth
                        onClick={handlers.onSubmit}
                      >
                        <Typography textAlign="center">Create</Typography>
                      </Button>
                    </Box>
                  </Grid>

                  <Grid container direction="column" alignItems="center">
                    <Grid item xs={6}>
                      <Typography>
                        {"Do you have a Cornie's account?"}
                      </Typography>
                    </Grid>
                    <Grid item md={12}>
                      <Link
                        component={RouterLink}
                        color="primary"
                        to="/auth/login"
                      >
                        Sign in
                      </Link>
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
