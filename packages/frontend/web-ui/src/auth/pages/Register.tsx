import { Link as RouterLink } from 'react-router-dom';
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
import { useRegisterForm } from '../hooks/useRegisterForm';
import { useShowPassword } from '../../common/hooks/useShowPassword';
import { CornieLayout } from '../../common/layout/CornieLayout';
import { CheckingAuth } from '../components/CheckingAuth';
import { RegisterStatus } from '../models/RegisterStatus';

export const Register = () => {
  const {
    backendError,
    formFields,
    formStatus,
    formValidation,
    notifyFormFieldsFilled,
    setFormField,
  } = useRegisterForm({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { showPassword, handleClickShowPassword, handleMouseDownPassword } =
    useShowPassword(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    notifyFormFieldsFilled();
  };

  const isTextFieldDisabled = () => {
    return (
      formStatus === RegisterStatus.backendOK ||
      formStatus === RegisterStatus.pendingBackend ||
      formStatus === RegisterStatus.pendingValidation
    );
  };

  const isShowPasswordButtonDisabled = () => {
    return (
      formStatus === RegisterStatus.backendOK ||
      formStatus === RegisterStatus.pendingBackend ||
      formStatus === RegisterStatus.pendingValidation
    );
  };

  if (
    formStatus === RegisterStatus.pendingValidation ||
    formStatus === RegisterStatus.pendingBackend
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
              {'Create an account'}
            </Typography>

            <form>
              <Grid container>
                <Grid item xs={12}>
                  <TextField
                    className="form-text-fieldset form-register-alias"
                    autoFocus
                    disabled={isTextFieldDisabled()}
                    label="Alias"
                    type="text"
                    placeholder="alias"
                    fullWidth
                    name="name"
                    value={formFields.name}
                    onChange={setFormField}
                    error={formValidation.name !== undefined}
                    helperText={formValidation.name}
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
                    value={formFields.email}
                    onChange={setFormField}
                    error={formValidation.email !== undefined}
                    helperText={formValidation.email}
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
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    placeholder="******"
                    fullWidth
                    name="confirmPassword"
                    value={formFields.confirmPassword}
                    onChange={setFormField}
                    error={formValidation.confirmPassword !== undefined}
                    helperText={formValidation.confirmPassword}
                  />
                </Grid>
              </Grid>

              <Grid container display={backendError !== null ? '' : 'none'}>
                <Grid item xs={12}>
                  <Box className="form-register-error">
                    <Alert severity="error">
                      <AlertTitle>Error</AlertTitle>
                      {backendError}
                    </Alert>
                  </Box>
                </Grid>
              </Grid>

              <Grid
                container
                display={formStatus === RegisterStatus.backendOK ? '' : 'none'}
              >
                <Grid item xs={12}>
                  <Box className="form-register-success">
                    <Alert severity="success">
                      <AlertTitle>Success</AlertTitle>
                      {`User created! We sent an email, please, complete the steps.`}
                    </Alert>
                  </Box>
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={12}>
                  <Box className="register-form-button">
                    <Button
                      className="register-button"
                      disabled={
                        formStatus === RegisterStatus.backendOK ? true : false
                      }
                      type="submit"
                      variant="contained"
                      fullWidth
                      onClick={onSubmit}
                    >
                      <Typography textAlign="center">Create</Typography>
                    </Button>
                  </Box>
                </Grid>

                <Grid container direction="column" alignItems="center">
                  <Grid item xs={6}>
                    <Typography>{"Do you have a Cornie's account?"}</Typography>
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
  );
};
