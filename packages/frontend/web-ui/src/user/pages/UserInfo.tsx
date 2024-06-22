import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

import { CircularProgressModal } from '../../common/components/CircularProgressModal';
import { useRedirectUnauthorized } from '../../common/hooks/useRedirectUnauthorized';
import { CornieLayout } from '../../common/layout/CornieLayout';
import { useUserInfo } from '../hooks/useUserInfo';
import { UserInfoStatus } from '../models/UserInfoStatus';

export const UserInfo = () => {
  useRedirectUnauthorized();

  const [name, setName] = useState<string>();

  const { status, updateUser, userDetailV1, userV1 } = useUserInfo();

  const email: string | null = userDetailV1?.email ?? null;

  useEffect(() => {
    if (status === UserInfoStatus.idle) {
      setName(userV1.name);
    }
  }, [userV1]);

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (status === UserInfoStatus.idle) {
      setName(event.currentTarget.value);
    }
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (name !== undefined) {
      updateUser({
        name,
      });
    }
  };

  const isNotIdle = () => status !== UserInfoStatus.idle;

  const isPending = () =>
    status === UserInfoStatus.fetchingUser ||
    status === UserInfoStatus.updatingUser;

  return (
    <>
      <CircularProgressModal open={isPending()} />
      <CornieLayout withFooter withNavBar>
        <Grid
          className="bkg-user-info"
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
                      value={email ?? ''}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      autoFocus
                      className="form-text-fieldset"
                      data-testid="user-info-form-text-name"
                      disabled={isNotIdle()}
                      fullWidth
                      label="Name"
                      name="name"
                      onChange={onNameChange}
                      placeholder="name"
                      type="text"
                      value={name ?? ''}
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
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        onClick={onSubmit}
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
