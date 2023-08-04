import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Alert, Button, Grid, IconButton, InputAdornment, Link, TextField, Typography } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useRegisterForm } from '../hooks';
import { useShowPassword } from '../../common/hooks';
import { RegisterLayout } from '../layout/RegisterLayout';
import { CheckingAuth } from '../components/CheckingAuth';
import { httpClient } from '../../common/http/services/HttpService';
import { buildSerializableResponse } from '../../common/http/helpers/buildSerializableResponse';

const STATUS_FULFILLED = 'fulfilled';
const STATUS_IDLE = 'idle';
const STATUS_PENDING = 'pending';

export const Register = () => {

    const { formState, onInputChange, formValidation, isFormValid } = useRegisterForm({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const { showPassword, handleClickShowPassword, handleMouseDownPassword } = useShowPassword(false);

    const [ formSubmitted, setFormSubmitted ] = useState(false);
    const [ status, setStatus ] = useState(STATUS_IDLE);
    const [ error, setError ] = useState('');
    
    const onSubmit = async (event) => {

        event.preventDefault();

        setFormSubmitted(true);
        
        if (isFormValid) {
            setStatus(STATUS_PENDING);
            setError('');

            const response = await fetchCreateUser(formState);

            if (response.statusCode === 200) {
              setStatus(STATUS_FULFILLED);
              setFormSubmitted(false);
            } else if (response.statusCode === 409) {
              setStatus(STATUS_IDLE);
              setError(`The user already exists.`);
            } else {
              setStatus(STATUS_IDLE);
              setError(`Ups... Something strange happened. Try again?`);
            }

        }
    };

    const fetchCreateUser = async ({email, name, password}) => {
      
      const response = await httpClient.createUser({}, {
         email: email,
         name: name,
         password: password
      });
      
      return buildSerializableResponse(response);
    }; 

    if (status === STATUS_PENDING) {
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
                disabled={status == STATUS_FULFILLED ? true : false}
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
                disabled={status == STATUS_FULFILLED ? true : false}
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
                disabled={status == STATUS_FULFILLED ? true : false}
                label="Password" 
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          disabled={status == STATUS_FULFILLED ? true : false}
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
                  disabled={status == STATUS_FULFILLED ? true : false}
                  label="Confirm Password" 
                  type={showPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            disabled={status == STATUS_FULFILLED ? true : false}
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
                  display={error !== '' ? '' : 'none'}>
              <Grid 
                item 
                xs={12}
                sx={{mt:3}}
              >
                <Alert severity='error'>{error}</Alert>
              </Grid>
            </Grid>

            <Grid container 
                  display={status === STATUS_FULFILLED ? '' : 'none'}>
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
                disabled={status === STATUS_FULFILLED ? true : false}
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
