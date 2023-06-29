import { Button, Grid, Link, TextField, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useForm } from '../../cornie/hooks/useForm';
import { AuthLayout } from '../layout/AuthLayout';

export const Register = () => {

    const {formState, displayName, email, password, onInputChange, onResetForm} = useForm({
        username: '',
        email: '',
        password: ''
    });

    return (

        <AuthLayout title="Create a Cornie's account">

        <form>
          
          <Grid container>
          <Grid item xs={12} sx={{mt: 2}}>
              <TextField 
                label="Alias" 
                type="text" 
                placeholder="alias" 
                fullWidth 
                name="alias"
                value={displayName}
                onChange={onInputChange}
                //error={emailValid !== null}
                //helperText={emailValid}
              />
            </Grid>
            <Grid item xs={12} sx={{mt: 2}}>
              <TextField 
                label="e-mail" 
                type="email" 
                placeholder="mail@google.com" 
                fullWidth 
                name="email"
                value={email}
                onChange={onInputChange}
                //error={emailValid !== null}
                //helperText={emailValid}
              />
            </Grid>
            <Grid item xs={12} sx={{mt: 2}}>
              <TextField 
                label="Password" 
                type="password" 
                placeholder="*******" 
                fullWidth 
                name="password"
                value={password}
                onChange={onInputChange}
                //error={passwordValid !== null}
                //helperText={passwordValid}
              />
            </Grid>
            <Grid item xs={12} sx={{mt: 2}}>
                <TextField 
                  label="Confirm Password" 
                  type="password" 
                  placeholder="*******" 
                  fullWidth 
                  name="confirmPassword"
                  value={password}
                  onChange={onInputChange}
                  //error={passwordValid !== null}
                  //helperText={passwordValid}
                />
              </Grid>
            </Grid>

          <Grid container spacing={2} sx={{mt: 2, mb: 2}}>
            
            <Grid item xs={6} sm={12}>
              <Button 
                //disabled={isAuthenticating}
                type="submit" 
                variant='contained' 
                fullWidth
                //onClick={onSubmit}
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
              <Link sx={{mt: 2, mr:1}} component={RouterLink} color='inherit' to="/auth/login">
                Sign in
              </Link>
            </Grid>

          </Grid>
        </form>
    </AuthLayout>

    )
}