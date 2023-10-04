import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Alert,
  AlertTitle,
  Button,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import { RegisterConfirmLayout } from '../layout/RegisterConfirmLayout';
import { useEffect, useState } from 'react';
import { CheckingAuth } from '../components/CheckingAuth';
import { httpClient } from '../../common/http/services/HttpService';
import { buildSerializableResponse } from '../../common/http/helpers/buildSerializableResponse';
import { createAuthByToken } from '../../app/store/thunk/createAuthByToken';

const CODE_QUERY_PARAM = 'code';
const STATUS_FULFILLED = 'fulfilled';
const STATUS_IDLE = 'idle';
const STATUS_PENDING = 'pending';
const STATUS_REJECTED = 'rejected';

const UNEXPECTED_ERROR_MESSAGE = 'Unexpected error!';

export const RegisterConfirm = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [status, setStatus] = useState(STATUS_IDLE);

  const url = new URL(window.location.href);
  const codeParam = url.searchParams.get(CODE_QUERY_PARAM);

  const dispatch = useDispatch();
  const { token, errorMessage: authErrorMessage } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    void (async () => {
      switch (status) {
        case STATUS_IDLE:
          setStatus(STATUS_PENDING);

          if (codeParam === null) {
            setErrorMessage(UNEXPECTED_ERROR_MESSAGE);
            setStatus(STATUS_REJECTED);
          } else {
            await dispatch(createAuthByToken(codeParam));
          }
          break;
        case STATUS_PENDING:
          if (token !== null) {
            try {
              await updateUserMe(token);
              setStatus(STATUS_FULFILLED);
            } catch (_) {
              setErrorMessage(UNEXPECTED_ERROR_MESSAGE);
              setStatus(STATUS_REJECTED);
            }
          }

          if (authErrorMessage !== null) {
            setErrorMessage(authErrorMessage);
          }
          break;
      }
    })();
  }, [token, status, authErrorMessage]);

  const updateUserMe = async (token) => {
    const response = await httpClient.updateUserMe(
      {
        authorization: `Bearer ${token}`,
      },
      {
        active: true,
      },
    );
    return buildSerializableResponse(response);
  };

  if (status === STATUS_PENDING) {
    return <CheckingAuth />;
  }

  return (
    <RegisterConfirmLayout title="Confirm your account user">
      <Grid container>
        <Grid
          aria-label="confirm-register-ok"
          container
          display={status === STATUS_FULFILLED ? '' : 'none'}
        >
          <Grid item xs={12} sx={{ mt: 2, mb: 3 }}>
            <Alert severity="success">
              <AlertTitle>Success</AlertTitle>
              {'Your account have been created succesfully!'}
            </Alert>
          </Grid>
        </Grid>

        <Grid
          aria-label="confirm-register-error-message"
          container
          display={errorMessage !== null ? '' : 'none'}
        >
          <Grid item xs={12} sx={{ mt: 2, mb: 3 }}>
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              {errorMessage}
            </Alert>
          </Grid>
        </Grid>

        <Grid
          aria-label="confirm-register-button"
          container
          direction="row"
          justifyContent="end"
        >
          <Link
            sx={{ mt: 2, mr: 1 }}
            component={RouterLink}
            color="primary"
            to="/"
          >
            <Button
              type="button"
              className="return-cornie-button"
              variant="contained"
            >
              Return to Cornie
            </Button>
          </Link>
        </Grid>
      </Grid>
    </RegisterConfirmLayout>
  );
};
