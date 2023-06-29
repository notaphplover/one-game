import { Button, Grid, Link, TextField, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useForm } from '../../cornie/hooks/useForm';
import { AuthLayout } from '../layout/AuthLayout';

export const Login = () => {

    const {email, password, onInputChange} = useForm({
        username: '',
        email: '',
        password: ''
    });

    return (

        <AuthLayout title="Welcome to Cornie's game !!">

        <form>
          
          <Grid container>
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
          </Grid>
          
          <Grid container spacing={2} sx={{mt: 2, mb: 2}}>
            
            <Grid item xs={12}>
              <Button 
                //disabled={isAuthenticating}
                type="submit" 
                variant='contained' 
                fullWidth
                //onClick={onSubmit}
              >
                <Typography textAlign='center'>Login</Typography> 
              </Button>
            </Grid>  

            <Grid container direction='row' justifyContent='end' sx={{mt: 4}}>
              <Typography sx={{mt: 2, mr:1}}> {`Don't you have a Cornie's account?`}</Typography>
              <Link sx={{mt: 2, mr:1}} component={RouterLink} color='primary' to="/auth/register">
                Sign up
              </Link>
            </Grid>

          </Grid>
        </form>
    </AuthLayout>

    )
}