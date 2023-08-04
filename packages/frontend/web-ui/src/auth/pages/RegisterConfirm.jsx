import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Grid, Link, Typography } from '@mui/material';
import { RegisterConfirmLayout } from '../layout/RegisterConfirmLayout';
import { useEffect, useState } from 'react';
import { CheckingAuth } from '../components/CheckingAuth';
import { httpClient } from '../../common/http/services/HttpService';
import { buildSerializableResponse } from '../../common/http/helpers/buildSerializableResponse';
import { createAuthByToken } from '../../app/store/features/authSlice';

const CODE_QUERY_PARAM = 'code';
const STATUS_FULFILLED = 'fulfilled';
const STATUS_IDLE = 'idle';
const STATUS_PENDING = 'pending';

export const RegisterConfirm = () => {

    const [ isHidden, setIsHidden ] = useState(false);
    
    const [ status, setStatus ] = useState(STATUS_IDLE);

    const url = new URL(window.location.href);
    const codeParam = url.searchParams.get(CODE_QUERY_PARAM);

    const dispatch = useDispatch();
    const { token, errorMessage } = useSelector((state) => state.auth);

    useEffect(() => {
      if (status === STATUS_PENDING && token !== null) {
          updateUserMe(token);
          setStatus(STATUS_FULFILLED);
          setIsHidden(true);
      }
          
    }, [token, status, errorMessage])
    

    window.onload = async () => {
        setStatus(STATUS_PENDING);
          if (codeParam !== null) {
              await dispatch(createAuthByToken(codeParam));          
          }
    };

    const updateUserMe = async(token) => {
        const response = await httpClient.updateUserMe(
            {
                authorization: `Bearer ${token}`
            }, 
            { 
                active: true
            }
        );
        return buildSerializableResponse(response);
    };

    if (status === STATUS_PENDING) {
        return <CheckingAuth />
    };

  return (
    <RegisterConfirmLayout title="Confirm your account user">
      
       <Grid container>
          <Grid container 
              display={status === STATUS_FULFILLED ? '' : 'none'}
          >
            <Grid 
                item 
                xs={12}
                sx={{mt: 2, mb: 3}}
            >
              <Alert severity='success'>{`Your account have been created succesfully!`}</Alert>
          </Grid>
        </Grid>

        <Grid container 
                  display={codeParam !== null ? 'none' : ''}>
              <Grid 
                item 
                xs={12}
                sx={{mt: 2, mb: 3}}
              >
                <Alert severity='error'>{`Unexpected error!`}</Alert>
              </Grid>
        </Grid>

        <Grid container 
              display={errorMessage !== null ? '' : 'none'}>
            <Grid 
                item 
                xs={12}
                sx={{mt: 2, mb: 3}}
            >
                <Alert severity='error'>{errorMessage}</Alert>
            </Grid>
        </Grid>

        <Grid 
              container 
              direction='row' 
              justifyContent='end' 
              sx={{mt: 4}}
              display={isHidden ? '' : 'none'}
            >
              <Typography sx={{mt: 2, mr:1}}>Return to</Typography>
              <Link sx={{mt: 2, mr:1}} component={RouterLink} color='primary' to="/">Cornie</Link>
            </Grid>

      </Grid>

    </RegisterConfirmLayout>
    
  )
}
