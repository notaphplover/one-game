import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useLoginForm } from '../hooks';
import { useShowPassword } from '../../common/hooks';
import { LoginLayout } from '../layout/LoginLayout';

export const Login = () => {
  const { formState, onInputChange, onResetForm, formValidation, isFormValid } =
    useLoginForm({
      email: '',
      password: '',
    });

  const { showPassword, handleClickShowPassword, handleMouseDownPassword } =
    useShowPassword(false);

  const [formSubmitted, setFormSubmitted] = useState(false);

  const onSubmitLogin = (event) => {
    event.preventDefault();

    if (isFormValid) {
      setFormSubmitted(true);
      onResetForm();
    }
    setFormSubmitted(false);
  };

  return (
    <LoginLayout title="Welcome to Cornie's game !!">
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
              label="Email"
              type="email"
              placeholder="mail@example.com"
              fullWidth
              name="email"
              value={formState.email}
              onChange={onInputChange}
              error={
                formValidation.emailValidationError !== null && formSubmitted
              }
              helperText={
                formValidation.emailValidationError &&
                formSubmitted &&
                formValidation.emailValidationError
              }
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
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
              value={formState.password}
              onChange={onInputChange}
              error={
                formValidation.passwordValidationError !== null && formSubmitted
              }
              helperText={
                formValidation.passwordValidationError &&
                formSubmitted &&
                formValidation.passwordValidationError
              }
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 2, mb: 2 }}>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              onClick={onSubmitLogin}
            >
              <Typography textAlign="center">Login</Typography>
            </Button>
          </Grid>

          <Grid container direction="row" justifyContent="end" sx={{ mt: 4 }}>
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
      </form>
    </LoginLayout>
  );
};
