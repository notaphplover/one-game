import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
} from '@mui/material';

import { CircularProgressModal } from '../../common/components/CircularProgressModal';
import { useRedirectUnauthorized } from '../../common/hooks/useRedirectUnauthorized';
import { CornieLayout } from '../../common/layout/CornieLayout';
import { useUserInfo } from '../hooks/useUserInfo';
import { UserInfoStatus } from '../models/UserInfoStatus';

export interface UserInfoFormValidationResult {
  confirmPassword?: string;
  name?: string;
  password?: string;
}

export const UserInfo = () => {
  useRedirectUnauthorized();

  const [{ form, status }, { handlers }] = useUserInfo();

  const isNotIdle = () => status !== UserInfoStatus.idle;

  const isPending = () =>
    status === UserInfoStatus.fetchingUser ||
    status === UserInfoStatus.updatingUser;

  return (
    <>
      <CircularProgressModal open={isPending()} />
      <CornieLayout withFooter withNavBar>
        <Grid
          className="user-info-page-container"
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Grid item xs={3}>
            <Box className="box-shadow user-info-form-grid">
              <Typography variant="h5" className="user-info-form-title">
                {'User info'}
              </Typography>

              <form>
                <Grid container>
                  <Grid item xs={12}>
                    <TextField
                      className="form-text-fieldset"
                      data-testid="user-info-form-text-email"
                      disabled={true}
                      fullWidth
                      label="Email"
                      name="email"
                      placeholder="email"
                      type="text"
                      value={form.fields.email ?? ''}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      autoFocus
                      className="form-text-fieldset"
                      data-testid="user-info-form-text-name"
                      disabled={isNotIdle()}
                      error={form.validation.name !== undefined}
                      fullWidth
                      helperText={form.validation.name}
                      label="Name"
                      name="name"
                      onChange={handlers.onNameChanged}
                      placeholder="name"
                      type="text"
                      value={form.fields.name ?? ''}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      autoFocus
                      className="form-text-fieldset"
                      data-testid="user-info-form-text-password"
                      disabled={isNotIdle()}
                      error={form.validation.password !== undefined}
                      fullWidth
                      helperText={form.validation.password}
                      label="Password"
                      name="password"
                      onChange={handlers.onPasswordChanged}
                      placeholder="password"
                      type="password"
                      value={form.fields.password ?? ''}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      autoFocus
                      className="form-text-fieldset"
                      data-testid="user-info-form-text-confirm-password"
                      disabled={isNotIdle()}
                      error={form.validation.confirmPassword !== undefined}
                      fullWidth
                      helperText={form.validation.confirmPassword}
                      label="Confirm password"
                      name="confirm-password"
                      onChange={handlers.onConfirmPasswordChanged}
                      placeholder="password"
                      type="password"
                      value={form.fields.confirmPassword ?? ''}
                    />
                  </Grid>
                </Grid>

                <Grid
                  container
                  display={
                    status === UserInfoStatus.userFetchError ? '' : 'none'
                  }
                >
                  <Grid item xs={12}>
                    <Box className="user-info-form-error">
                      <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        Unexpected error encountered while fetching user data
                      </Alert>
                    </Box>
                  </Grid>
                </Grid>

                <Grid container>
                  <Grid item xs={12}>
                    <Box className="user-info-form-button-box">
                      <Button
                        disabled={isNotIdle()}
                        type="submit"
                        variant="contained"
                        fullWidth
                        onClick={handlers.onSubmit}
                      >
                        <Typography textAlign="center">Save</Typography>
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Grid>
        </Grid>
      </CornieLayout>
    </>
  );
};
