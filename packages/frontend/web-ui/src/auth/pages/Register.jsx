import { Link as RouterLink } from 'react-router-dom';
import {
  Alert,
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
  STATUS_REG_BACKEND_OK,
  STATUS_REG_PENDING_BACKEND,
  STATUS_REG_PENDING_VAL,
  useRegisterForm,
} from '../hooks';
import { useShowPassword } from '../../common/hooks';
import { RegisterLayout } from '../layout/RegisterLayout';
import { CheckingAuth } from '../components/CheckingAuth';

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

  const onSubmit = async (event) => {
    event.preventDefault();

    notifyFormFieldsFilled();
  };

  const isTextFieldDisabled = () => {
    return (
      formStatus === STATUS_REG_BACKEND_OK ||
      formStatus === STATUS_REG_PENDING_BACKEND ||
      formStatus === STATUS_REG_PENDING_VAL
    );
  };

  const isShowPasswordButtonDisabled = () => {
    return (
      formStatus === STATUS_REG_BACKEND_OK ||
      formStatus === STATUS_REG_PENDING_BACKEND ||
      formStatus === STATUS_REG_PENDING_VAL
    );
  };

  if (
    formStatus === STATUS_REG_PENDING_VAL ||
    formStatus === STATUS_REG_PENDING_BACKEND
  ) {
    return <CheckingAuth />;
  }

  return (
    <RegisterLayout title="Create an account">
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
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
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
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
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
          <Grid item xs={12} sx={{ mt: 3 }}>
            <Alert severity="error">{backendError}</Alert>
          </Grid>
        </Grid>

        <Grid
          container
          display={formStatus === STATUS_REG_BACKEND_OK ? '' : 'none'}
        >
          <Grid item xs={12} sx={{ mt: 3 }}>
            <Alert severity="success">{`User created! We sent an email, please, complete the steps.`}</Alert>
          </Grid>
        </Grid>

        <Grid
          container
          spacing={2}
          sx={{
            mt: 2,
            mb: 2,
            '& .Mui-disabled': {
              backgroundColor: 'Pink',
            },
          }}
        >
          <Grid item xs={12} sm={12}>
            <Button
              disabled={formStatus === STATUS_REG_BACKEND_OK ? true : false}
              type="submit"
              variant="contained"
              fullWidth
              onClick={onSubmit}
            >
              <Typography textAlign="center">Create</Typography>
            </Button>
          </Grid>

          <Grid container direction="row" justifyContent="end" sx={{ mt: 4 }}>
            <Typography sx={{ mt: 2, mr: 1 }}>
              {' '}
              Do you have a Cornie's account?{' '}
            </Typography>
            <Link
              sx={{ mt: 2, mr: 1 }}
              component={RouterLink}
              color="primary"
              to="/auth/login"
            >
              Sign in
            </Link>
          </Grid>
        </Grid>
      </form>
    </RegisterLayout>
  );
};
