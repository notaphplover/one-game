import { Link as RouterLink } from 'react-router-dom';
import { Alert, AlertTitle, Button, Grid, Link } from '@mui/material';
import { RegisterConfirmLayout } from '../layout/RegisterConfirmLayout';
import { CheckingAuth } from '../components/CheckingAuth';
import {
  STATUS_FULFILLED,
  STATUS_PENDING,
  STATUS_REJECTED,
  useRegisterConfirm,
} from '../hooks/useRegisterConfirm';

export const RegisterConfirm = () => {
  const { status, errorMessage } = useRegisterConfirm();

  const getRegisterConfirmOkDisplay = () => {
    return status === STATUS_FULFILLED ? '' : 'none';
  };

  const getRegisterConfirmErrorDisplay = () => {
    return status === STATUS_REJECTED ? '' : 'none';
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
          display={getRegisterConfirmOkDisplay()}
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
          display={getRegisterConfirmErrorDisplay()}
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
