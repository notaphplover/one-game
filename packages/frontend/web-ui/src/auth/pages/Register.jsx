import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Button, Grid, IconButton, InputAdornment, Link, TextField, Typography } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useFormRegister, useShowPassword } from '../../common/hooks';
import { RegisterLayout } from '../layout/RegisterLayout';
import { fetchCreateUser } from '../../store/features/auth';
import { CheckingAuth } from '../components/CheckingAuth';

export const Register = () => {

    const { formState, onInputChange, onResetForm, formValidation, isFormValid } = useFormRegister({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [ formSubmitted, setFormSubmitted ] = useState(false);
    const { showPassword, handleClickShowPassword, handleMouseDownPassword } = useShowPassword(false);
    
    const dispatch = useDispatch();
    const { status, id, errorMessage } = useSelector((state) => state.auth);

    const onSubmit = (event) => {

        event.preventDefault();
        setFormSubmitted(true);
        if (isFormValid) {
          dispatch(fetchCreateUser(formState));

          if (errorMessage || id) {
            onResetForm();
          }
            
          setFormSubmitted(false);
        } 
    }

    if (status === 'checking') {
      return <CheckingAuth />
    }

    return (

      <RegisterLayout title="Create an account">

        <form>
          
          <Grid container sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'Orchid',
                    },
                  },
                }}>
          <Grid item xs={12} sx={{ mt: 2 }}>
              <TextField
                autoFocus
                disabled={id !== null ? true : false}
                label="Alias" 
                type="text" 
                placeholder="alias" 
                fullWidth 
                name="name"
                value={formState.name}
                onChange={onInputChange}
                error={formValidation.nameValidationError !== null && formSubmitted}
                helperText={(formValidation.nameValidationError && formSubmitted) && formValidation.nameValidationError}
              />
            </Grid>
            <Grid item xs={12} sx={{mt: 2}}>
              <TextField 
                disabled={id !== null ? true : false}
                label="Email" 
                type="email" 
                placeholder="mail@example.com" 
                fullWidth 
                name="email"
                value={formState.email}
                onChange={onInputChange}
                error={formValidation.emailValidationError !== null && formSubmitted}
                helperText={(formValidation.emailValidationError && formSubmitted) && formValidation.emailValidationError}
              />
            </Grid>
            <Grid item xs={12} sx={{mt: 2}}>
              <TextField 
                disabled={id !== null ? true : false}
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
                  )
                }}
                placeholder="******" 
                fullWidth 
                name="password"
                value={formState.password}
                onChange={onInputChange}
                error={formValidation.passwordValidationError !== null && formSubmitted}
                helperText={(formValidation.passwordValidationError && formSubmitted) && formValidation.passwordValidationError}
              />
            </Grid>
            <Grid item xs={12} sx={{mt: 2}}>
                <TextField 
                  disabled={id !== null ? true : false}
                  label="Confirm Password" 
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
                    )
                  }}
                  placeholder="******" 
                  fullWidth 
                  name="confirmPassword"
                  value={formState.confirmPassword}
                  onChange={onInputChange}
                  error={formValidation.confirmPasswordValidationError !== null && formSubmitted}
                  helperText={(formValidation.confirmPasswordValidationError && formSubmitted) && formValidation.confirmPasswordValidationError}
                />
              </Grid>
            </Grid>

            <Grid container 
                  display={errorMessage !== null ? '' : 'none'}>
              <Grid 
                item 
                xs={12}
                sx={{mt:3}}
              >
                <Alert severity='error'>{errorMessage}</Alert>
              </Grid>
            </Grid>

            <Grid container 
                  display={id !== null ? '' : 'none'}>
              <Grid 
                item 
                xs={12}
                sx={{mt:3}}
              >
                <Alert severity='success'>{`User created! We sent an email, please, complete the steps.`}</Alert>
              </Grid>
            </Grid>

          <Grid container spacing={2} 
                sx={{mt: 2, mb: 2, 
                     '& .Mui-disabled': {
                        backgroundColor: 'Pink',
                  },
          }}>
            
            <Grid item xs={12} sm={12}>
              <Button 
                disabled={id !== null ? true : false}
                type="submit" 
                variant='contained' 
                fullWidth
                onClick={onSubmit}
              >
                <Typography textAlign='center'>Create</Typography> 
              </Button>
            </Grid>  

            <Grid 
              container 
              direction='row' 
              justifyContent='end' 
              sx={{mt: 4}}
            >
              <Typography sx={{mt: 2, mr:1}}> Do you have a Cornie's account? </Typography>
              <Link sx={{mt: 2, mr:1}} component={RouterLink} color='primary' to="/auth/login">
                Sign in
              </Link>
            </Grid>

          </Grid>
        </form>
      </RegisterLayout>

    )
}
