import { Link as RouterLink } from 'react-router-dom';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import { CornieLayout } from '../../common/layout/CornieLayout';
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
            <Typography variant="h5" className="register-title-text-position">
              {'Confirm your account user'}
            </Typography>
            <Grid container>
              <Grid
                aria-label="confirm-register-ok"
                container
                display={getRegisterConfirmOkDisplay()}
              >
                <Grid item xs={12}>
                  <Box className="form-register-success">
                    <Alert severity="success">
                      <AlertTitle>Success</AlertTitle>
                      {'Your account have been created succesfully!'}
                    </Alert>
                  </Box>
                </Grid>
              </Grid>

              <Grid
                aria-label="confirm-register-error-message"
                container
                display={getRegisterConfirmErrorDisplay()}
              >
                <Grid item xs={12}>
                  <Box className="form-register-error">
                    <Alert severity="error">
                      <AlertTitle>Error</AlertTitle>
                      {errorMessage}
                    </Alert>
                  </Box>
                </Grid>
              </Grid>

              <Grid
                aria-label="confirm-register-button"
                container
                direction="row"
                justifyContent="end"
              >
                <Grid item>
                  <Link component={RouterLink} color="primary" to="/">
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
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </CornieLayout>
  );
};
